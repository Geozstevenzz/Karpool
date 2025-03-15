import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useRouter, usePathname } from 'expo-router'; 

export default function HomeScreen() {
  const router = useRouter();
  const pathname = usePathname(); // Tracks the current route

  // Handle Android back press
  useEffect(() => {
    const handleBackPress = () => {
      if (pathname === '/') {
        // If on the index page, ask to exit
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() },
          ]
        );
        return true; // Prevent default behavior
      } else {
        // If on any other page, navigate back
        router.back();
        return true; // Prevent default behavior
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove(); // Cleanup on component unmount
  }, [pathname, router]);

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Image source={require('@/assets/images/bmw.webp')} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.text}>Karpool</Text>
        <Image source={require('@/assets/images/people-in-car.png')} style={styles.carImage} />
      </View>

      <Text style={styles.subtext}>Get rid of transportation problems!</Text>
      <Text style={styles.footer}>Let's get started.</Text>

      <TouchableOpacity 
        style={[styles.button, styles.loginButton]} 
        onPress={() => router.replace('/login')} 
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.signupButton]} 
        onPress={() => router.replace('/signup')}
      >
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00308F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 360,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#1485EE',
    position: 'absolute',
    top: 170,
    left: 120,
  },
  image: {
    width: 600,
    height: 250,
    position: 'absolute',
    top: 230,
    left: 40,
    transform: [{ scaleX: -1 }],
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    left: 20,
  },
  text: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  carImage: {
    width: 7,
    height: 7,
    marginLeft: 2,
    top: 11,
  },
  subtext: {
    fontSize: 24,
    color: '#FFFFFF',
    position: 'absolute',
    top: 560,
    left: 20,
  },
  footer: {
    fontSize: 18,
    color: '#FFFFFF',
    position: 'absolute',
    bottom: 200,
    left: 20,
    fontWeight: '600',
  },
  button: {
    width: '70%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    position: 'absolute',
    bottom: 110,
  },
  signupButton: {
    position: 'absolute',
    bottom: 40,
  },
  buttonText: {
    fontSize: 20,
    color: '#1485EE',
    fontWeight: '600',
    textAlign: 'center',
  },
});
