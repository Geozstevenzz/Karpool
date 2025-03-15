import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserMode } from '../store/userModeStore';
import { useDateTimeStore } from '../store/dateTImeStore';
import * as SecureStore from 'expo-secure-store';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const SIDEBAR_WIDTH = 300;
const SWIPE_THRESHOLD = -50;

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        const newPosition = Math.max(-SIDEBAR_WIDTH, Math.min(0, gestureState.dx));
        translateX.setValue(newPosition);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < SWIPE_THRESHOLD) {
          closeSidebar();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  const closeSidebar = () => {
    Animated.spring(translateX, {
      toValue: -SIDEBAR_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start(() => onClose());
  };

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [isVisible]);

  const navigateTo = (route: string) => {
    closeSidebar();
    router.push(route);
  };

  const resetDateTime = useDateTimeStore.getState().reset;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('token');
              // Reset mode to "passenger"
              useUserMode.getState().setMode('passenger');
              // Reset date and time
            resetDateTime();
              closeSidebar();
              router.replace('/'); // Redirect to index.tsx
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/images/person1.jpeg')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>John Doe</Text>
      </View>

      <View style={styles.menuItems}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('/trips')}
        >
          <Text style={styles.menuText}>My Trips</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('/settings')}
        >
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: 'white',
    zIndex: 2,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#ff4d4d',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Sidebar;
