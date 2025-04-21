import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme } from 'react-native';
import { db, auth } from '../services/firebaseConfig'; // Adjusted path
import { collection, getDocs } from 'firebase/firestore';

export default function UserProfileScreen() {
  const userId = 'demoUser123'; // Replace with actual user UID
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    const fetchUserData = async () => {
      const favSnapshot = await getDocs(collection(db, 'users', userId, 'favorites'));
      const cartSnapshot = await getDocs(collection(db, 'users', userId, 'cart'));

      setFavorites(favSnapshot.docs.map((doc) => doc.data()));
      setCartItems(cartSnapshot.docs.map((doc) => doc.data()));
    };

    fetchUserData();
  }, []);

  const styles = createStyles(isDark);

  const renderItem = ({ item }) => (
    <View style={styles.itemBox}>
      <Text style={styles.itemTitle}>{item.product_title}</Text>
      <Text style={styles.itemSub}>Price: ${item.offer?.price || 'N/A'}</Text>
      <Text style={styles.itemSub}>Rating: ⭐ {item.product_rating || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>

      <Text style={styles.subHeader}>Favorites</Text>
      {favorites.length === 0 ? (
        <Text style={styles.empty}>No favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.product_id || item.product_title}
          renderItem={renderItem}
        />
      )}

      <Text style={styles.subHeader}>Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.product_id || item.product_title}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const createStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#111' : '#fff',
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },
    subHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      color: isDark ? '#ddd' : '#222',
    },
    empty: {
      fontSize: 16,
      fontStyle: 'italic',
      color: isDark ? '#aaa' : '#555',
      marginTop: 5,
    },
    itemBox: {
      backgroundColor: isDark ? '#222' : '#f0f0f0',
      padding: 10,
      borderRadius: 8,
      marginVertical: 5,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    itemSub: {
      fontSize: 14,
      color: isDark ? '#bbb' : '#555',
    },
  });
