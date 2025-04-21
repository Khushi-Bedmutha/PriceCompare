import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const userId = getAuth().currentUser?.uid;

  const fetchFavorites = async () => {
    try {
      if (userId) {
        const snapshot = await getDocs(collection(db, 'users', userId, 'favorites'));
        const items = snapshot.docs.map((doc) => doc.data());
        setFavorites(items);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (productId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this item from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', userId, 'favorites', productId));
              setFavorites((prev) => prev.filter((item) => item.product_id !== productId));
            } catch (error) {
              console.error('Error removing favorite:', error);
              Alert.alert('Error', 'Failed to remove item from favorites.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Favorites</Text>
      {favorites.length === 0 ? (
        <Text>Your favorites list is empty.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.product_id}
          renderItem={({ item }) => (
            <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{item.product_title}</Text>
              <TouchableOpacity onPress={() => removeFavorite(item.product_id)}>
                <Icon name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
