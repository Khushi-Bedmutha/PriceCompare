import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../services/firebaseConfig';

const { width } = Dimensions.get('window');

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scaleAnim = new Animated.Value(1);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signInWithEmailAndPassword(auth, email, password);
      alert('Account created and logged in successfully!');
      navigation.navigate('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Create Account 🌟</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.signupButton}
            onPress={() => {
              animateButton();
              handleSignUp();
            }}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c2ffd8', // Light background color
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    color: '#000', // Dark text color for title
    textShadowColor: '#00000055',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#ffffffee',
    marginBottom: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  signupButton: {
    backgroundColor: '#34c1eb',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#34c1eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#000', // Dark text color for login message
    fontSize: 15,
  },
  loginLink: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
});
