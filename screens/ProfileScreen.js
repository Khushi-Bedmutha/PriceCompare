import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Pressable,
  Image,
} from 'react-native';
import { auth } from '../services/firebaseConfig';
import { useTheme } from '../utils/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation }) {
  const { toggleTheme, isDarkMode } = useTheme();
  const email = auth.currentUser?.email || 'user@example.com';

  // Get initials
  const getInitials = (email) => {
    const name = email.split('@')[0];
    const parts = name.split(/[.\-_]/);
    const initials = parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
    return initials || 'U';
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        Alert.alert('Logout Failed', error.message);
      });
  };

  return (
    <View
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      {/* Header with icons */}
      <View style={styles.headerRow}>
        <Text style={[styles.header, isDarkMode && styles.darkText]}>
          Welcome
        </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Icon name="heart" size={26} color={isDarkMode ? '#f8bbd0' : '#e91e63'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Icon name="cart" size={26} color={isDarkMode ? '#bbdefb' : '#2196f3'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {/* Profile pic fallback using initials */}
        <View style={[styles.avatarCircle, isDarkMode && styles.darkAvatar]}>
          <Text style={styles.avatarText}>{getInitials(email)}</Text>
        </View>
        <Text style={[styles.emailText, isDarkMode && styles.darkText]}>
          {email}
        </Text>
      </View>

      {/* Theme toggle */}
      <View style={styles.section}>
        <Text style={[styles.subheader, isDarkMode && styles.darkText]}>Theme</Text>
        <View style={styles.toggleRow}>
          <Text style={[styles.item, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
      </View>

      {/* Terms */}
      <View style={styles.section}>
        <Text style={[styles.subheader, isDarkMode && styles.darkText]}>
          Terms & Privacy
        </Text>
        <Text style={[styles.item, isDarkMode && styles.darkText]}>
          By using this app you agree to our terms and conditions.
        </Text>
        <Text style={[styles.item, isDarkMode && styles.darkText]}>
          We respect your privacy and do not share your data.
        </Text>
      </View>

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
        ]}
      >
        <View style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Default background color
  },
  darkContainer: {
    backgroundColor: '#121212', // Dark mode background color
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  darkText: {
    color: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  darkAvatar: {
    backgroundColor: '#333',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#444',
  },
  emailText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  section: {
    marginBottom: 30,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  item: {
    fontSize: 14,
    paddingVertical: 4,
    color: '#333',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 30,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: '#ff6f91',
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
