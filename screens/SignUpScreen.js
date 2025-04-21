import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../services/firebaseConfig'; // Import the modular SDK functions

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      // First, create the user
      await createUserWithEmailAndPassword(auth, email, password);  // Using the modular SDK function

      // After signing up, immediately sign in
      await signInWithEmailAndPassword(auth, email, password); // Sign in the user

      alert('Account created and logged in successfully!');
      navigation.navigate('Home'); // Navigate to home page after login
    } catch (error) {
      alert(error.message); // Alert if there is any error
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
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
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
