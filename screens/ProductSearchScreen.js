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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from '../services/firebaseConfig'; // Adjust path as necessary
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const fetchProducts = async (query) => {
  try {
    const response = await fetch(
        `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=us&language=en`, // Correct URL
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '986e0ce574msh4e5fc3b712bec59p1893ddjsnaffedc384ab2', // Your API key
            'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com', // Correct Host
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

export default function ProductSearchScreen({ route }) {
  const { searchQuery } = route.params;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: null, asc: true });
  const [isLoading, setIsLoading] = useState(false);  // New loading state

  const userId = getAuth().currentUser?.uid; 

  const getData = useCallback(async () => {
    setIsLoading(true);  // Set loading state to true
    const results = await fetchProducts(searchQuery);
    setProducts(results);
    setDisplayedProducts(results);
    setIsLoading(false);  // Set loading state to false
  }, [searchQuery]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleProductClick = (productUrl) => {
    Linking.openURL(productUrl);
  };

  const toggleFavorite = async (id, item) => {
    const isFav = favorites.includes(id);
    let updatedFavorites;

    if (isFav) {
      updatedFavorites = favorites.filter((favId) => favId !== id);
      await deleteDoc(doc(db, 'users', userId, 'favorites', id));
    } else {
      updatedFavorites = [...favorites, id];
      await setDoc(doc(db, 'users', userId, 'favorites', id), item);
    }

    setFavorites(updatedFavorites);
  };

  const addToCart = async (item) => {
    const isInCart = cart.find((c) => c.product_id === item.product_id);
    if (!isInCart) {
      const updated = [...cart, item];
      setCart(updated);
      await setDoc(doc(db, 'users', userId, 'cart', item.product_id), item);
    }
  };

  const sortBy = (key) => {
    const isAsc = sortOrder.key === key ? !sortOrder.asc : true;
    setSortOrder({ key, asc: isAsc });

    const sorted = [...products].sort((a, b) => {
      const aVal = key === 'price' ? a.offer?.price || 0 : a.product_rating || 0;
      const bVal = key === 'price' ? b.offer?.price || 0 : b.product_rating || 0;
      return isAsc ? aVal - bVal : bVal - aVal;
    });

    setDisplayedProducts(sorted);
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Results for "{searchQuery}"</Text>

      <View style={styles.sortContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={() => sortBy('price')}>
          <Text style={styles.sortText}>Sort by Price</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => sortBy('rating')}>
          <Text style={styles.sortText}>Sort by Rating</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={displayedProducts}
          keyExtractor={(item) => item.product_id || item.product_title}
          renderItem={({ item }) => {
            const isFav = favorites.includes(item.product_id);
            const isInCart = cart.find((c) => c.product_id === item.product_id);

            return (
              <View style={styles.card}>
                <Text style={styles.title}>{item.product_title}</Text>
                <Text style={styles.details}>${item.offer?.price || 'N/A'}</Text>
                <Text style={styles.details}>⭐ {item.product_rating || 'N/A'}</Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => toggleFavorite(item.product_id, item)}>
                    <Icon
                      name={isFav ? 'heart' : 'heart-outline'}
                      size={24}
                      color={isFav ? 'red' : isDark ? 'white' : 'black'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleProductClick(item.product_page_url)}
                  >
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: isInCart ? '#aaa' : '#6cc070' }]}
                    onPress={() => addToCart(item)}
                    disabled={isInCart}
                  >
                    <Text style={styles.buttonText}>
                      {isInCart ? 'In Cart' : 'Add to Cart'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          numColumns={1}
          contentContainerStyle={styles.list}
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
    sortContainer: {
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
      fontSize: 14,
      color: '#000',
    },
    list: {
      gap: 10,
    },
    card: {
      flex: 1,
      margin: 5,
      backgroundColor: isDark ? '#222' : '#f9f9f9',
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: isDark ? '#fff' : '#000',
    },
    details: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
      marginVertical: 4,
      textAlign: 'center',
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    button: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: '#ddd',
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 13,
      color: '#000',
    },
  });
