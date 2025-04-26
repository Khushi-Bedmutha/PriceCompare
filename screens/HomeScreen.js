import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Pressable } from 'react-native';
import { auth } from '../services/firebaseConfig';
import debounce from 'lodash.debounce';
import { useTheme } from '../utils/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const fetchProducts = async (query = 'electronics') => {
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
    return json.data || [];
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
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const getData = async () => {
      const results = await fetchProducts(searchQuery || 'electronics');
      setProducts(results);
    };
    const debouncedGetData = debounce(getData, 1000);
    debouncedGetData();
    return () => debouncedGetData.cancel();
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
    navigation.navigate('ProductSearch', { searchQuery });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: isDarkMode ? '#0f0f0f' : '#f2f2f2' }]}
    >
      <Text style={[styles.header, isDarkMode && styles.darkText]}>Welcome to <Text style={{ color: '#00c6ff' }}>ShopX</Text></Text>

      <TextInput
        placeholder="Search products..."
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
        style={[styles.search, isDarkMode && styles.darkSearch]}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Pressable onPress={handleSearchButton} style={({ pressed }) => [styles.searchButton, pressed && styles.buttonPressed]}>
        <Text style={styles.searchButtonText}>Search Products</Text>
      </Pressable>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="user" size={30} color={isDarkMode ? '#00c6ff' : '#007BFF'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="shopping-cart" size={30} color={isDarkMode ? '#00c6ff' : '#007BFF'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
          <Icon name="heart" size={30} color={isDarkMode ? '#ff6b81' : '#e63946'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.product_id || item.id || item.product_title}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, isDarkMode && styles.darkCard, pressed && styles.cardPressed]}
            onPress={() => handleAddToCart(item)}
          >
            <Image source={{ uri: item.product_photos?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
            <Text style={[styles.title, isDarkMode && styles.darkText]}>{item.product_title}</Text>
            <Text style={[styles.details, isDarkMode && styles.darkText]}>
              ${item.price} - {item.seller_name}
            </Text>

            <View style={styles.buttonRow}>
              <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]} onPress={() => handleAddToCart(item)}>
                <Text style={styles.actionButtonText}>Add to Cart</Text>
              </Pressable>

              <Pressable style={({ pressed }) => [styles.actionButtonFav, pressed && styles.buttonPressed]} onPress={() => handleAddToFav(item)}>
                <Text style={styles.actionButtonText}>Fav</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
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
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  darkText: {
    color: '#fff',
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  darkSearch: {
    backgroundColor: '#333',
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#00c6ff',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  list: {
    paddingBottom: 50,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 8,
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    alignItems: 'center',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  details: {
    fontSize: 12,
    color: '#888',
    marginVertical: 5,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    marginRight: 5,
  },
  actionButtonFav: {
    backgroundColor: '#ff6b81',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    marginLeft: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
});
