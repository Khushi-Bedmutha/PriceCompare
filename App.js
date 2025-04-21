import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './services/firebaseConfig';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ProductSearchScreen from './screens/ProductSearchScreen'; 
import ProfileScreen from './screens/ProfileScreen';
import CartScreen from './screens/CartScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { Text, View, ActivityIndicator } from 'react-native';

// Import the ThemeProvider to wrap the app
import { ThemeProvider } from './utils/ThemeContext'; 

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    // Wrap the app with the ThemeProvider to access the theme context
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'Home' : 'SignUp'}
          screenOptions={{
            headerStyle: {
              backgroundColor: 'lightgray', // Default light theme color
            },
            headerTintColor: 'black',  // Default text color for light theme
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ProductSearch" component={ProductSearchScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />

       </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
