import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function LikedScreen({ route, navigation }) {
  const { favorites } = route.params;  // Get favorites passed from HomeScreen

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productCard: {
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});
