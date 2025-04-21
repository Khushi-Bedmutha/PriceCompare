import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth, signInWithEmailAndPassword } from '../services/firebaseConfig'; // Import the modular SDK functions

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Login the user
      await signInWithEmailAndPassword(auth, email, password);  // Using the modular SDK function
      alert('Login successful');
      navigation.navigate('Home');  // Navigate to home page
    } catch (error) {
      alert(error.message);  // Alert on error
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});
