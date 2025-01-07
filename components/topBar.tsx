import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserMode } from '../store/userModeStore';
import { useRouter } from 'expo-router';

const TopBar: React.FC = () => {
  const mode = useUserMode((state) => state.mode);
  const setMode = useUserMode((state) => state.setMode);
  const router = useRouter();

  const toggleMode = () => {
    if (mode === 'driver') {
      setMode('passenger');
      router.push('/home-screen'); // Navigate to home-screen.tsx
    } else {
      setMode('driver');
      router.push('/index1'); // Navigate to index.tsx
    }
  };

  const navigateToMenu = () => {
    router.push('/menu'); // Navigate to the menu screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToMenu}>
        <Image source={require('../assets/images/Menu.png')} style={styles.icon1} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleMode}>
        <Image
          source={
            mode === 'driver'
              ? require('../assets/images/Steering Wheel.png')
              : require('../assets/images/Passenger1.png')
          }
          style={styles.icon2}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  icon1: {
    width: 20,
    height: 20,
  },
  icon2: {
    width: 30,
    height: 30,
  },
});

export default TopBar;
