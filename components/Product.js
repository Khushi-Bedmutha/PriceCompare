import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Product = ({ product, onAddToFav, onAddToCart }) => {
  return (
    <View style={styles.productContainer}>
      <Text>{product.name}</Text>
      <Text>Price: ${product.price}</Text>
      <Text>Store: {product.store}</Text>
      <Button title="Add to Favorites" onPress={() => onAddToFav(product)} />
      <Button title="Add to Cart" onPress={() => onAddToCart(product)} />
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default Product;
