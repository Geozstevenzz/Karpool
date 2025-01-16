import React, {useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, FlatList, Pressable } from 'react-native';
import MapComponent from '../../components/MapComponent';
import TopBar from '../../components/topBar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Polyline, Marker } from 'react-native-maps';
import axios from 'axios';
import { useTripStore } from '@/store/useTripStore';

const { height } = Dimensions.get('window');

const ConfirmScreen: React.FC = () => {
    const { tripid } = useLocalSearchParams<{ tripid: string }>(); // Get tripId from the route
    const trip = useTripStore((state) =>
        state.trips.find((t) => t.tripid === Number(tripid))
    );

    if (!trip) {
        return (
        <View style={styles.container}>
            <Text style={styles.errorText}>Trip not found</Text>
        </View>
        );
    }
  
    const [route, setRoute] = useState([]);

    useEffect(() => {
        const fetchRoute = async () => {
          const origin = [trip.startlocation.latitude, trip.startlocation.longitude]; 
          const destination = [trip.destinationlocation.latitude, trip.destinationlocation.longitude]; 
          
          try {
            const response = await axios.get(
              `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf6248f6c0554d630a4d5294487cf1edfd5e13&start=${origin[0]},${origin[1]}&end=${destination[0]},${destination[1]}`
            );      
            // Check if the response contains routes
            if (response.data.features && response.data.features.length > 0) {
              const coordinates = response.data.features[0].geometry.coordinates;
              const routeCoordinates = coordinates.map((coord: any) => ({
                latitude: coord[1],
                longitude: coord[0],
              }));
              setRoute(routeCoordinates);
            } else {
              console.error("No routes found in the response.");
            }
          } catch (error) {
            console.error("Error fetching the route: ", error);
          }
        };
    
        fetchRoute();
      }, []);
    

  return (
    <View style={styles.container}>
      <TopBar />
      <MapComponent />
    
      <View style={styles.bottomView}>
      <View style={styles.infoContainer}>
      {/* Header */}
      <Text style={styles.header}>Trip Details</Text>

      {/* Driver Info */}
      <View style={styles.driverInfo}>
        <Pressable onPress={() => alert('Profile Pressed')}>
          <View style={styles.profileSection}>
            <Text style={styles.driverName}>{trip.username}</Text>
            <Text style={styles.driverRating}>⭐ 4.5/5 - 13 ratings</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => alert('Profile Pressed')} style={styles.profile}>
          <Image
            source={require("../../assets/images/person3.jpeg")}
            style={styles.profilePic}
          />
          <Text style={{alignSelf: 'center', marginLeft: 10, fontSize: 16,}}>&gt;</Text>
        </Pressable>
      </View>

      {/* Car Info */}
      <View style={styles.carInfo}>
        <View>
          <Text style={styles.carModel}>{trip.vehiclename}</Text>
          <Text style={styles.carNumber}>{trip.vehiclenumber}</Text>
          <Text style={styles.carColor}>{trip.vehiclecolor}</Text>
        </View>
        <Image
          source={require("../../assets/images/Car.png")}
          style={styles.carImage}
        />
      </View>

      {/* Passengers and Stops */}
      <View style={styles.passengerStops}>
        <View style={styles.passengerSection}>
          <Text style={styles.sectionTitle}>Passengers</Text>
          <View style={styles.icons}>
            {Array.from({ length: trip.numberofpassengers }).map((_, index) => (
              <Image
                key={`passenger-${index}`}
                source={require("../../assets/images/Person.png")}
                style={styles.icon}
              />
            ))}
            {Array.from({ length: trip.totalseats - trip.numberofpassengers }).map((_, index) => (
              <Image
                key={`empty-seat-${index}`}
                source={require("../../assets/images/Person.png")}
                style={[styles.icon, styles.iconDisabled]}
              />
            ))}
          </View>
        </View>

        <Pressable onPress={() => alert('Stops Pressed')}>
          <View style={styles.stopsSection}>
            <Text style={styles.sectionTitle}>Stops</Text>
            <Text style={styles.stopsValue}>{trip.numberofstops} &gt;</Text>
          </View>
        </Pressable>
      </View>

      {/* Price */}
      <Text style={styles.price}>PKR {trip.price}</Text>
      <View style={{ flex: 1, height: 200,  }}>
      <MapView
        style={{ flex: 1, height: 200, }}
        initialRegion={{
          latitude: trip.startlocation.longitude,
          longitude: trip.startlocation.latitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker 
          coordinate={{
            latitude: trip.startlocation.longitude,
            longitude:trip.startlocation.latitude,
            }} 
          image={require("../../assets/images/LocationPinEdited.png")}
          anchor = {{x: 0.5, y: 1}}
        />

        <Marker 
          coordinate={{
            latitude: trip.destinationlocation.longitude,
            longitude: trip.destinationlocation.latitude,
        }}
          image={require("../../assets/images/DestinationPinEdited.png")}
          anchor = {{x: 0.5, y: 1}}
        />
        {/* Render the route */}
        <Polyline
          coordinates={route}
          strokeWidth={3}
          strokeColor="blue"
        />


      </MapView>
    </View>
    </View>
    
    <Pressable style={styles.nextButton} onPress={() => {return;}}>
                <Text style={{color: 'white',}}>Request for Ride</Text>
              </Pressable>
      </View>
    
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        maxHeight: height * 0.75,
      },
      button: {
        flex: 1,
        backgroundColor: '#00308F',
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
      },
      infoContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
       
      },
      header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0044cc',
        marginBottom: 10,
        textAlign: 'center',
      },
      driverInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      profileSection: {
        flex: 1,
      },
      driverName: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      profile: {
        flexDirection: 'row',
      },
      driverRating: {
        fontSize: 12,
        color: '#666',
      },
      profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
      },
      carInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      carModel: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      carNumber: {
        fontSize: 14,
        color: '#666',
      },
      carColor: {
        fontSize: 14,
        color: '#999',
      },
      carImage: {
        width: 85,
        height: 50,
      },
      passengerStops: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      passengerSection: {
        alignItems: 'center',
      },
      sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      icons: {
        flexDirection: 'row',
      },
      icon: {
        width: 20,
        height: 20,
        marginHorizontal: 5,
      },
      iconDisabled: {
        opacity: 0.3,
      },
      stopsSection: {
        alignItems: 'center',
      },
      stopsValue: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0044cc',
        textAlign: 'center',
        marginBottom: 10,
      },
      nextButton: {
        flex: 1,
        backgroundColor: '#00308F',
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        height: 40,
        margin: 10
      },
      errorText: {
        color: "red",
        fontSize: 18,
      },
      // text: {
      //   marginBottom: 15,
      //   fontWeight: '600',
      //   fontSize: 20,
      // }
});

export default ConfirmScreen;