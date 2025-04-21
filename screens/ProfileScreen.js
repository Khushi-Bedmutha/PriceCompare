import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { getData } from '../utils/storage';
import { auth } from '../services/firebaseConfig';
import { useTheme } from '../utils/ThemeContext'; // Use the theme context

export default function ProfileScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const { toggleTheme, isDarkMode } = useTheme(); // Access theme from context

  useEffect(() => {
    const loadData = async () => {
      const favs = await getData('favorites');
      const cartItems = await getData('cart');
      setFavorites(favs || []);
      setCart(cartItems || []);
    };
    loadData();
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        Alert.alert('Logout Failed', error.message);
      });
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.header, isDarkMode && styles.darkText]}>
        Welcome, {auth.currentUser?.email || 'User'}
      </Text>

      <View style={styles.section}>
        <Text style={[styles.subheader, isDarkMode && styles.darkText]}>Favorites ({favorites.length})</Text>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.product_id}
          renderItem={({ item }) => <Text style={[styles.item, isDarkMode && styles.darkText]}>{item.product_title}</Text>}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.subheader, isDarkMode && styles.darkText]}>Cart ({cart.length})</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.product_id}
          renderItem={({ item }) => <Text style={[styles.item, isDarkMode && styles.darkText]}>{item.product_title}</Text>}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.subheader, isDarkMode && styles.darkText]}>Theme</Text>
        <View style={styles.toggleRow}>
          <Text style={[styles.item, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.subheader, isDarkMode && styles.darkText]}>Terms & Privacy</Text>
        <Text style={[styles.item, isDarkMode && styles.darkText]}>By using this app you agree to our terms and conditions.</Text>
        <Text style={[styles.item, isDarkMode && styles.darkText]}>We respect your privacy and do not share your data.</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  darkText: {
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  subheader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  item: {
    fontSize: 14,
    paddingVertical: 2,
    color: '#333',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
