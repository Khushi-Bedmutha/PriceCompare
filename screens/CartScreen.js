import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getData, storeData } from '../utils/storage';
import { useTheme } from '../utils/ThemeContext';
import { auth } from '../services/firebaseConfig';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const email = auth.currentUser?.email || 'user@example.com';

  const getInitials = (email) => {
    const name = email.split('@')[0];
    const parts = name.split(/[.\-_]/);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'U';
  };

  const fetchCartItems = async () => {
    try {
      const items = await getData('cart');
      setCartItems(items || []);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    Alert.alert(
      'Remove from Cart',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            const updatedCart = cartItems.filter(item => item.product_id !== productId);
            setCartItems(updatedCart);
            await storeData('cart', updatedCart);
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <View style={[styles.centered, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#0000ff'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatarCircle, isDarkMode && styles.darkAvatar]}>
          <Text style={styles.avatarText}>{getInitials(email)}</Text>
        </View>
        <Text style={[styles.emailText, isDarkMode && styles.darkText]}>
          {email}
        </Text>
      </View>

      <Text style={[styles.header, isDarkMode && styles.darkText]}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
          Your cart is empty.
        </Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.product_id}
          renderItem={({ item }) => (
            <View style={[styles.itemRow, isDarkMode && styles.darkItem]}>
              <Text style={[styles.title, isDarkMode && styles.darkText]}>
                {item.product_title}
              </Text>
              <TouchableOpacity onPress={() => removeFromCart(item.product_id)}>
                <Icon name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  darkAvatar: {
    backgroundColor: '#333',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
  },
  emailText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  itemRow: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginVertical: 6,
    borderRadius: 8,
  },
  darkItem: {
    backgroundColor: '#1e1e1e',
  },
  title: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkText: {
    color: '#fff',
  },
});
