import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUserMode } from '../store/userModeStore';
import { useUserStore } from '../store/userStore';
import { useVehicleStore } from '../store/vehicleStore';
import { useDriverStore } from '../store/driverStore'; // Import Zustand store for driverID
import { useRouter } from 'expo-router';

interface TopBarProps {
  onMenuPress: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuPress }) => {
  const mode = useUserMode((state) => state.mode);
  const setMode = useUserMode((state) => state.setMode);
  const { user } = useUserStore();
  const vehicleID = useVehicleStore((state) => state.vehicleID);
  const driverID = useDriverStore((state) => state.driverID); // Fetch driverID from Zustand
  const router = useRouter();

  //console.log("TopBar is loading user: ",user);

  const toggleMode = () => {
    Alert.alert(
      "Confirm Mode Switch",
      "Are you sure you want to switch your mode?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            if (mode === 'passenger') {
              //console.log("DriverID is",driverID);
              //console.log(user?.driverid);
              if (!user.driverid) {
                // First-time driver without driverID: Redirect to Driver Details
                router.push('/driver-details');
                return;
              }
              setMode('driver');
            } else {
              setMode('passenger');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress}>
        <Image source={require('../assets/images/Menu.png')} style={styles.icon1} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleMode}>
        <Image
          source={mode === 'driver'
            ? require('../assets/images/Steering Wheel.png')
            : require('../assets/images/Passenger1.png')}
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
