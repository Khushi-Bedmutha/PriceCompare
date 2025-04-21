import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { auth } from '../services/firebaseConfig'; // Your firebase configuration file
import debounce from 'lodash.debounce';
import { useTheme } from '../utils/ThemeContext'; // Use the dark theme
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon library

// API Fetch function
const fetchProducts = async (query = 'electronics') => {
  try {
    console.log(`Fetching products for query: ${query}`);
    const response = await fetch(
      `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=us&language=en`, // Correct URL
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '986e0ce574msh4e5fc3b712bec59p1893ddjsnaffedc384ab2', // Your API key
          'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com', // Correct Host
        },
    });

    const json = await response.json();
    console.log('API Response:', json); // Log the entire API response
    return json.data || []; // Ensure the data is accessed correctly
  } catch (error) {
    console.error('API Fetch error:', error);
    return [];
  }
};

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('electronics');
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { isDarkMode } = useTheme(); // Dark Mode

  // Debounced effect for API calls
  useEffect(() => {
    const getData = async () => {
      console.log(`Fetching products with query: ${searchQuery}`);
      const results = await fetchProducts(searchQuery || 'electronics');
      console.log('Fetched products:', results); // Log fetched results
      setProducts(results);
    };
    const debouncedGetData = debounce(getData, 1000); // 1000ms debounce delay
    debouncedGetData();
    return () => debouncedGetData.cancel(); // Cleanup debounce when component unmounts
  }, [searchQuery]);

  const handleAddToCart = (product) => {
    if (!cart.some(item => item.id === product.id)) {
      setCart([...cart, product]);
      Alert.alert('Added to Cart', `${product.product_title} has been added to your cart!`);
    } else {
      Alert.alert('Already in Cart', `${product.product_title} is already in your cart.`);
    }
  };

  const handleAddToFav = (product) => {
    if (!favorites.some(item => item.id === product.id)) {
      setFavorites([...favorites, product]);
      Alert.alert('Added to Favorites', `${product.product_title} has been added to your favorites!`);
    } else {
      Alert.alert('Already in Favorites', `${product.product_title} is already in your favorites.`);
    }
  };

  const handleSearchButton = () => {
    // Navigate to ProductSearchScreen and pass the search query
    navigation.navigate('ProductSearch', { searchQuery });
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.header, isDarkMode && styles.darkText]}>Welcome to ShopX</Text>

      <TextInput
        placeholder="Search products..."
        style={[styles.search, isDarkMode && styles.darkSearch]}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Button title="Search Products" onPress={handleSearchButton} />

      {/* Icon buttons for Profile, Cart, and Favorites */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="user" size={30} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="shopping-cart" size={30} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
          <Icon name="heart" size={30} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.product_id || item.id || item.product_title}
        renderItem={({ item }) => {
          console.log('Rendering item:', item); // Log individual item
          return (
            <View style={[styles.card, isDarkMode && styles.darkCard]}>
              <Image source={{ uri: item.product_photos?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
              <Text style={[styles.title, isDarkMode && styles.darkText]}>{item.product_title}</Text>
              <Text style={[styles.details, isDarkMode && styles.darkText]}>${item.price} - {item.seller_name}</Text>
              <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={() => handleAddToCart(item)}>
                <Text>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={() => handleAddToFav(item)}>
                <Text>Add to Fav</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  darkText: {
    color: '#fff',
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  darkSearch: {
    backgroundColor: '#333',
    color: '#fff',
  },
  list: {
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#333',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  details: {
    fontSize: 12,
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    marginBottom: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  darkButton: {
    backgroundColor: '#444',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
});

