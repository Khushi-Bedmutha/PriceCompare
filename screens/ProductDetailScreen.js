import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchProducts } from '../services/api'; // Assuming you have a function to fetch products

export default function ProductDetails({ route }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null); // Store product data
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle any errors

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products based on query (e.g., product name or id)
        const products = await fetchProducts('Nike Men\'s Dunk Low Retro');
        
        // Find the product by matching the ID or title
        const foundProduct = products.find(item => item.product_id === productId);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found!');
        }
      } catch (err) {
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    getProductDetails();
  }, [productId]); // Run this effect when productId changes

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{product.product_title}</Text>
      <Text>Price Range: ${product.typical_price_range[0]} - ${product.typical_price_range[1]}</Text>
      <Text>Store: {product.product_page_url}</Text>
      <Text>Description: {product.product_description}</Text>
      
      <View style={styles.imageContainer}>
        {product.product_photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={styles.productImage} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  imageContainer: {
    marginTop: 20,
  },
});
