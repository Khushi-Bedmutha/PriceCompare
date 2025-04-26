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
import { auth, signInWithEmailAndPassword } from '../services/firebaseConfig';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scaleAnim = new Animated.Value(1);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful');
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
    <View style={styles.gradient}> {/* Replace LinearGradient with View temporarily */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Welcome Back 💫</Text>

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
            style={styles.loginButton}
            onPress={() => {
              animateButton();
              handleLogin();
            }}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign Up
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </View>  
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#FFDEE9',  // Temporary background color to mimic gradient
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
    textShadowColor: '#ffffffaa',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#ffffffdd',
    marginBottom: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#ff758c',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#ff8ebc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
    fontSize: 15,
  },
  signupLink: {
    color: '#ff5e9c',
    fontWeight: 'bold',
  },
});
