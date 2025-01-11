import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MenuScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/passenger-home')}
      >
        <Ionicons name="arrow-back" size={24} color="#007BFF" />
      </TouchableOpacity>

      {/* Menu Options */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/contact-driver')}
      >
        <Text style={styles.buttonText}>Contact Driver</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/review')}
      >
        <Text style={styles.buttonText}>Reviews</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/trips')}
      >
        <Text style={styles.buttonText}>Trips</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MenuScreen;
