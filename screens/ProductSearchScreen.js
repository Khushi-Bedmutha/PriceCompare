import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getData, storeData } from '../utils/storage';

const fetchProducts = async (query) => {
  try {
    const response = await fetch(
      `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=us&language=en`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '986e0ce574msh4e5fc3b712bec59p1893ddjsnaffedc384ab2',
          'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com',
        },
      }
    );
    const json = await response.json();
    return json.data?.products || [];
  } catch (error) {
    console.error('API Fetch error:', error);
    return [];
  }
};

export default function ProductSearchScreen({ route, navigation }) {
  const { searchQuery } = route.params;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState({});
  const [sortOption, setSortOption] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const getDataFromStorage = useCallback(async () => {
    setIsLoading(true);
    const results = await fetchProducts(searchQuery);
    setProducts(results);
    const favs = await getData('favorites') || [];
    const cartItems = await getData('cart') || [];
    const ratingData = await getData('ratings') || {};
    setFavorites(favs.map(item => item.product_id));
    setCart(cartItems);
    setRatings(ratingData);
    setIsLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    getDataFromStorage();
  }, [getDataFromStorage]);

  const getSortedProducts = () => {
    let sorted = [...products];

    if (sortOption === 'price') {
      sorted.sort((a, b) =>
        sortDirection === 'asc'
          ? (a.offer?.price || 0) - (b.offer?.price || 0)
          : (b.offer?.price || 0) - (a.offer?.price || 0)
      );
    } else if (sortOption === 'rating') {
      sorted.sort((a, b) =>
        sortDirection === 'asc'
          ? (ratings[a.product_id] || 0) - (ratings[b.product_id] || 0)
          : (ratings[b.product_id] || 0) - (ratings[a.product_id] || 0)
      );
    }

    return sorted;
  };

  const toggleFavorite = async (id, item) => {
    let favs = await getData('favorites') || [];
    const isFav = favs.find((p) => p.product_id === id);
    if (isFav) {
      favs = favs.filter((p) => p.product_id !== id);
    } else {
      favs.push(item);
    }
    setFavorites(favs.map(p => p.product_id));
    await storeData('favorites', favs);
  };

  const addToCart = async (item) => {
    try {
      let cartItems = await getData('cart') || [];
      const exists = cartItems.find((p) => p.product_id === item.product_id);
      if (!exists) {
        const updatedCart = [...cartItems, item];
        await storeData('cart', updatedCart);
        setCart(updatedCart);
        Alert.alert('Added to Cart', `"${item.product_title}" has been added to your cart.`);
      } else {
        Alert.alert('Already in Cart', `"${item.product_title}" is already in your cart.`);
      }
    } catch (e) {
      console.error('Error adding to cart:', e);
      Alert.alert('Error', 'Could not add item to cart. Please try again.');
    }
  };

  const submitRating = async (productId, rating) => {
    const updatedRatings = { ...ratings, [productId]: rating };
    setRatings(updatedRatings);
    await storeData('ratings', updatedRatings);
    Alert.alert('Success', 'Rating submitted successfully.');
  };

  const toggleSort = (option) => {
    if (sortOption === option) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortOption(option);
      setSortDirection('asc');
    }
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Results for "{searchQuery}"</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Icon name="heart" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ marginLeft: 16 }}>
            <Icon name="cart" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortBar}>
        <TouchableOpacity style={styles.sortButton} onPress={() => toggleSort('price')}>
          <Text style={styles.sortText}>
            Price ({sortOption === 'price' ? sortDirection : 'asc'})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => toggleSort('rating')}>
          <Text style={styles.sortText}>
            Rating ({sortOption === 'rating' ? sortDirection : 'asc'})
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={getSortedProducts()}
          keyExtractor={(item) => item.product_id}
          renderItem={({ item }) => {
            const isFav = favorites.includes(item.product_id);
            const isInCart = !!cart.find((c) => c.product_id === item.product_id);
            const productRating = ratings[item.product_id] || 0;

            return (
              <View style={styles.card}>
                <Text style={styles.title}>{item.product_title}</Text>
                <Text style={styles.details}>${item.offer?.price || 'N/A'}</Text>
                <Text style={styles.details}>⭐ {productRating}</Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => toggleFavorite(item.product_id, item)}>
                    <Icon
                      name={isFav ? 'heart' : 'heart-outline'}
                      size={24}
                      color={isFav ? 'red' : isDark ? 'white' : 'black'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(item.product_page_url)}>
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: isInCart ? '#aaa' : '#6cc070' },
                    ]}
                    onPress={() => addToCart(item)}
                    disabled={isInCart}
                  >
                    <Text style={styles.buttonText}>
                      {isInCart ? 'In Cart' : 'Add to Cart'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.ratingContainer}>
                  <Text style={styles.details}>Rate this Product:</Text>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => submitRating(item.product_id, star)}>
                      <Icon
                        name={star <= productRating ? 'star' : 'star-outline'}
                        size={24}
                        color="gold"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const createStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: isDark ? '#111' : '#fff',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },
    card: {
      marginBottom: 15,
      padding: 15,
      borderRadius: 10,
      backgroundColor: isDark ? '#333' : '#f9f9f9',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
    },
    details: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#555',
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    button: {
      padding: 8,
      borderRadius: 5,
      backgroundColor: '#6cc070',
    },
    buttonText: {
      color: '#fff',
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    iconRow: {
      flexDirection: 'row',
    },
    sortBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    sortButton: {
      padding: 8,
      backgroundColor: '#ddd',
      borderRadius: 5,
    },
    sortText: {
      fontWeight: 'bold',
    },
  });
