import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../services/firebaseConfig'; // Auth instance

const UserProfile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      // Fetch user data from Firebase (cart, favorites, etc.)
      // Here, I'm using static data for simplicity.
      setUserInfo(user);
      setCart(['Product 1', 'Product 2']); // Example cart data
      setFavorites(['Product 3', 'Product 4']); // Example favorite data
    }
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.navigate('Login'); // Navigate to login page on logout
    });
  };

  return (
    <View style={styles.container}>
      <Text>User Profile</Text>
      {userInfo ? (
        <>
          <Text>{`Email: ${userInfo.email}`}</Text>
          <Text>Cart:</Text>
          {cart.map((item, index) => (
            <Text key={index}>{item}</Text>
          ))}
          <Text>Favorites:</Text>
          {favorites.map((item, index) => (
            <Text key={index}>{item}</Text>
          ))}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default UserProfile;
