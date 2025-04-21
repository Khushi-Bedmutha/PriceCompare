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
import { db } from '../services/firebaseConfig'; // Adjust path as necessary
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const fetchProducts = async (query) => {
  try {
    const response = await fetch(
      `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=us&language=en`, 
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'YOUR_API_KEY_HERE', // Your API key
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

export default function ProductSearchScreen({ route }) {
  const { searchQuery } = route.params;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // New loading state
  const [ratings, setRatings] = useState({});  // Store ratings for each product

  const userId = getAuth().currentUser?.uid;

  const getData = useCallback(async () => {
    setIsLoading(true);  // Set loading state to true
    const results = await fetchProducts(searchQuery);
    setProducts(results);
    setDisplayedProducts(results);
    setIsLoading(false);  // Set loading state to false
    fetchRatings(results);  // Fetch existing ratings for products
    fetchFavorites(); // Fetch user's favorite products
    fetchCart(); // Fetch user's cart items
  }, [searchQuery]);

  const fetchRatings = async (products) => {
    const ratingsData = {};
    for (const product of products) {
      const docRef = doc(db, 'ratings', product.product_id); 
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        ratingsData[product.product_id] = docSnap.data().rating || 0;
      } else {
        ratingsData[product.product_id] = 0;  // Default rating if not found
      }
    }
    setRatings(ratingsData);
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    if (userId) {
      const favRef = doc(db, 'users', userId, 'favorites', 'list');
      const favSnap = await getDoc(favRef);
      if (favSnap.exists()) {
        setFavorites(favSnap.data().favorites || []);
      }
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    if (userId) {
      const cartRef = doc(db, 'users', userId, 'cart', 'list');
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        setCart(cartSnap.data().cart || []);
      }
    }
  };

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

  const submitRating = async (productId, rating) => {
    try {
      // Save rating to Firestore
      await setDoc(doc(db, 'ratings', productId), { rating });
      setRatings(prevRatings => ({
        ...prevRatings,
        [productId]: rating,
      }));
      Alert.alert('Rating Submitted', 'Your rating has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'There was an error submitting your rating.');
    }
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

                  {/* Rating submission section */}
                  <View style={styles.ratingContainer}>
                    <Text style={styles.details}>Rate this Product:</Text>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => submitRating(item.product_id, star)}
                      >
                        <Icon
                          name={star <= productRating ? 'star' : 'star-outline'}
                          size={24}
                          color="gold"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
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
      fontSize: 12,
      color: isDark ? '#ccc' : '#555',
      textAlign: 'center',
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {
      padding: 8,
      backgroundColor: '#6cc070',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 12,
    },
    ratingContainer: {
      marginTop: 10,
      alignItems: 'center',
    },
  });
