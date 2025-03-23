import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, FlatList, Pressable } from 'react-native';
import MapComponent from '../components/MapComponent';
import TopBar from '../components/topBar';
import { useRouter } from 'expo-router';
import { useTripStore } from '@/store/useTripStore';
import { useSelectedTripStore } from '@/store/selectedTripStore';

const { height } = Dimensions.get('window');

type Trip = {
  tripid: number;
  driverid: number;
  vehicleid: number;
  numberofpassengers: number;
  numberofstops: number;
  overallrating: number;
  price: number;
  triptime: string;
  tripdate: string;
  totalseats: number;
  startlocation: { latitude: number; longitude: number };
  destinationlocation: { latitude: number; longitude: number };
  distance: string;
  estimatedTime: string;
  username: string;
  profile_photo: string | null;
  vehiclename: string;
  vehiclecolor: string;
  vehiclenumber: string;
  vehicleaverage: number;
};

type Something = {
  item: Trip;
};

const ConfirmScreen: React.FC = () => {
  const router = useRouter();
  const data = useTripStore((state) => state.trips);
  const setSelectedTripId = useSelectedTripStore((state) => state.setSelectedTripId);

  const renderItem = ({ item }: Something) => (
    <View style={styles.itemContainer}>
      <View style={styles.topSection}>
        {/* Right section with details */}
        <View style={styles.rightSection}>
          <Text style={styles.name}>{item.username}</Text>
          <Text style={styles.descriptionText}>
            {`${item.vehiclename} • ${item.totalseats - item.numberofpassengers} seats • ${item.numberofstops} stops`}
          </Text>
          <Text style={styles.descriptionText}>
            {`${item.triptime} • ${item.tripdate.slice(0, 10)}`}
          </Text>
          <View style={styles.locationRow}>
            <Image
              source={require(`../assets/images/mapMarker.png`)}
              style={styles.icon}
            />
            <Text style={styles.locationText}>
              {`${item.distance}km (${item.estimatedTime} away)`}
            </Text>
          </View>
        </View>

        {/* Left section with Image */}
        <View style={styles.leftSection}>
          {/* Display profile picture from data if available */}
          <Image
            source={require("../assets/images/person1.jpeg")}
            style={styles.image}
          />
        </View>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{`PKR ${item.price}`}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Pressable
            style={styles.button}
            onPress={() => {
              setSelectedTripId(item.tripid);
              router.push(`/${item.tripid}`);
            }}
          >
            <Text style={{ color: 'white' }}>View Details</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar />
      <MapComponent />

      <View style={styles.bottomView}>
        <View style={styles.flatListContainer}>
          <FlatList
            data={data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};

export default ConfirmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    maxHeight: height * 0.7,
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
  },
  itemContainer: {
    flexDirection: 'column',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#EDFAFF',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#00308F',
    height: height * 0.2,
    elevation: 5,
  },
  leftSection: {
    flex: 1,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  rightSection: {
    flex: 1,
    width: '50%',
    paddingLeft: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#00308F',
  },
  descriptionText: {
    fontSize: 12,
    color: '#00308F',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#414141',
  },
  icon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  topSection: {
    flexDirection: 'row',
    height: '70%',
  },
  bottomSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#00308F',
    paddingLeft: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#00308F',
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
});
