import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const isWeb = Platform.OS === 'web';
const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleBackPress = () => {
      if (pathname === '/') {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      } else {
        router.back();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [pathname, router]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.text}>Karpool.</Text>
        <Text style={styles.subtext}>Get rid of transportation problems!</Text>
      </View>

      {/* Car Image Section */}
      <View style={styles.imageContainer}>
        <View style={styles.oval} />
        <Image source={require('@/assets/images/bmw.webp')} style={styles.image} />
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonGroup}>
        <Text style={styles.footer}>Let's get started.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/signup')}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00308F',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: isWeb ? 80 : 40,
    paddingBottom: isWeb ? 80 : 40,
  },
  headerContainer: {
    alignItems: 'flex-start',
    width: '90%',
  },
  text: {
    fontSize: isWeb ? 60 : 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    top: isWeb? 200: 0,
  },
  subtext: {
    fontSize: isWeb ? 48 : 16,
    color: '#FFFFFF',
    marginTop: 10,
    top:isWeb? 250: 0,
    
  },
  imageContainer: {
    position: 'relative',
    width: isWeb ? 600 : 320,
    height: isWeb ? 300 : 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oval: {
    width: isWeb ? 1000 : 400,
    height: isWeb ? 1000 : 400,
    borderRadius: isWeb ? 500 : 200,
    backgroundColor: '#1485EE',
    position: 'absolute',
    right: isWeb ? -1000 : -150,
  },
  image: {
    width: isWeb ? 1000 : 700,
    height: isWeb ? 1000 : 700,
    resizeMode: 'contain',
    transform: [{ scaleX: -1 }],
    marginLeft: isWeb ? 1700 : 300,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 20,
  },
  button: {
    width: isWeb ? 300 : '70%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 20,
    color: '#1485EE',
    fontWeight: '600',
    textAlign: 'center',
  },
});
