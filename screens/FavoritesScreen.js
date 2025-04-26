import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { getData, storeData } from '../utils/storage';
import { useTheme } from '../utils/ThemeContext';
import { auth } from '../services/firebaseConfig';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const { isDarkMode } = useTheme();
  const email = auth.currentUser?.email || 'user@example.com';

  const getInitials = (email) => {
    const name = email.split('@')[0];
    const parts = name.split(/[.\-_]/);
    const initials = parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
    return initials || 'U';
  };

  const fetchFavorites = async () => {
    const favs = await getData('favorites');
    setFavorites(favs || []);
  };

  const removeFavorite = async (productId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this item from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            const updated = favorites.filter((item) => item.product_id !== productId);
            setFavorites(updated);
            await storeData('favorites', updated);
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

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

      <Text style={[styles.header, isDarkMode && styles.darkText]}>Favorites</Text>
      {favorites.length === 0 ? (
        <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
          Your favorites list is empty.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.product_id}
          renderItem={({ item }) => (
            <View style={[styles.itemContainer, isDarkMode && styles.darkItem]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, isDarkMode && styles.darkText]}>
                  {item.product_title}
                </Text>
                <Text style={[styles.price, isDarkMode && styles.darkText]}>
                  ${item.offer?.price || 'N/A'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeFavorite(item.product_id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
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
  itemContainer: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  darkItem: {
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
});
