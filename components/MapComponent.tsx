import React, { useState, useRef } from "react";
import { View, StyleSheet} from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";
import {useMapStore} from '../store/mapStore'

const mapStyle= [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]



const MapComponent = () => {
  const mapRef = useRef(null);

  const locationMarker = useMapStore((state) => state.locationMarker);
  const destinationMarker = useMapStore((state) => state.destinationMarker);
  const choice = useMapStore((state) => state.choice);

  const setLocationMarker = useMapStore((state) => state.setLocationMarker);
  const setDestinationMarker = useMapStore((state) => state.setDestinationMarker);

  // // 0 means current location, 1 means destination
  // const [choice, setChoice] = useState(0);
  
  // const [locationMarker, setLocationMarker] = useState({
  //   latitude: 24.8607,
  //   longitude: 67.0011,
  // });

  // const [destinationMarker, setDestinationMarker] = useState({
  //   latitude: 24.8607,
  //   longitude: 67.1011,
  // });

  // const goToLocationMarker = () => {

  //   mapRef.current.animateToRegion({
  //     latitude: locationMarker.latitude,
  //     longitude: locationMarker.longitude,
  //     latitudeDelta: 0.02,
  //     longitudeDelta: 0.02,
  //   }, 1 * 1000);
  // };
  
  // const goToDestinationMarker = () => {
  //   mapRef.current.animateToRegion({
  //     latitude: destinationMarker.latitude,
  //     longitude: destinationMarker.longitude,
  //     latitudeDelta: 0.02,
  //     longitudeDelta: 0.02,
  //   }, 1 * 1000);
  // };

  

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}

        initialRegion={{
          latitude: 24.8607,
          longitude: 67.0011,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        //customMapStyle={mapStyle}

        onPress={(e) => {
          if (choice == 1) {
            setDestinationMarker(e.nativeEvent.coordinate)
          }
          else if (choice == 0) {
            setLocationMarker(e.nativeEvent.coordinate)
          }
        }}
      >
        <Marker 
          draggable
          coordinate={locationMarker} 
          onDragEnd={e => {setLocationMarker(e.nativeEvent.coordinate)}}
          image={require("../assets/images/LocationPinEdited.png")}
          anchor = {{x: 0.5, y: 1}}
        />

        <Marker 
          draggable
          coordinate={destinationMarker} 
          onDragEnd={e => {setDestinationMarker(e.nativeEvent.coordinate)}}
          image={require("../assets/images/DestinationPinEdited.png")}
          anchor = {{x: 0.5, y: 1}}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  
});

export default MapComponent;