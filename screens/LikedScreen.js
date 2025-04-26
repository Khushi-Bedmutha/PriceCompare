import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { auth } from '../services/firebaseConfig';

export default function LikedScreen({ route }) {
  const { favorites } = route.params;
  const { isDarkMode } = useTheme();
  const email = auth.currentUser?.email || 'user@example.com';

  const getInitials = (email) => {
    const name = email.split('@')[0];
    const parts = name.split(/[.\-_]/);
    const initials = parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
    return initials || 'U';
  };

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

      {/* Header */}
      <Text style={[styles.header, isDarkMode && styles.darkText]}>
        Your Favorites
      </Text>

      {/* Favorite items list */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.productCard, isDarkMode && styles.darkCard]}>
            <Text style={[styles.productName, isDarkMode && styles.darkText]}>{item.name}</Text>
            <Text style={[styles.productPrice, isDarkMode && styles.darkText]}>${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
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
    elevation: 5,
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
  productCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1f1f1f',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 14,
    marginTop: 4,
  },
  darkText: {
    color: '#fff',
  },
});
