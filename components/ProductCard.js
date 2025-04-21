import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ProductCard({ product }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.store}>{product.store}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8
  },
  info: {
    justifyContent: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  store: {
    color: 'gray'
  },
  price: {
    fontSize: 16,
    color: 'green',
    fontWeight: '600'
  }
});
