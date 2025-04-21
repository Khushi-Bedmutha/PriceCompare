import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function CartScreen({ route, navigation }) {
  const { cart } = route.params;  // Get cart data passed from HomeScreen

  const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    navigation.navigate('Home', { updatedCart });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.total}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>
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
  removeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  removeText: {
    color: 'white',
    textAlign: 'center',
  },
  total: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
