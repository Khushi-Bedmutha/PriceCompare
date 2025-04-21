import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getAuth().currentUser?.uid;

  const fetchCartItems = async () => {
    try {
      if (userId) {
        const snapshot = await getDocs(collection(db, 'users', userId, 'cart'));
        const items = snapshot.docs.map((doc) => doc.data());
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const removeFromCart = async (productId) => {
    Alert.alert(
      'Remove from Cart',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', userId, 'cart', productId));
              setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
            } catch (error) {
              console.error('Error removing from cart:', error);
              Alert.alert('Error', 'Failed to remove item from cart.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.product_id}
          renderItem={({ item }) => (
            <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{item.product_title}</Text>
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
