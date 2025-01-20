import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useMapStore } from "../store/mapStore";

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
  const mapRef = useRef<MapView>(null);

  // State from the store
  const locationMarker = useMapStore((state) => state.locationMarker);
  const destinationMarker = useMapStore((state) => state.destinationMarker);
  const choice = useMapStore((state) => state.choice);
  const fitToMarkers = useMapStore((state) => state.fitToMarkers);

  // Actions from the store
  const setLocationMarker = useMapStore((state) => state.setLocationMarker);
  const setDestinationMarker = useMapStore((state) => state.setDestinationMarker);
  const toggleFitToMarkers = useMapStore((state) => state.toggleFitToMarkers);

  // Fit Markers Above the Box
  const fitMarkers = () => {
    if (mapRef.current && locationMarker && destinationMarker) {
      console.log("Fitting markers...");
      mapRef.current.fitToCoordinates([locationMarker, destinationMarker], {
        edgePadding: { top: 50, right: 50, bottom: 300, left: 50 }, // Adjust padding for UI overlap
        animated: true,
      });
    }
  };

  // Effect to re-center markers dynamically
  useEffect(() => {
    if (fitToMarkers) {
      fitMarkers();
      toggleFitToMarkers(false); // Reset flag after fitting
    }
  }, [fitToMarkers]);

  // Effect to log marker updates
  useEffect(() => {
    console.log("Location Marker Updated:", locationMarker);
    console.log("Destination Marker Updated:", destinationMarker);
  }, [locationMarker, destinationMarker]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: 24.8607,
          longitude: 67.1011,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => {
          const coords = e.nativeEvent.coordinate;
          console.log("Map Pressed at:", coords, "Choice:", choice);

          if (choice === 1) {
            console.log("Setting Destination Marker:", coords);
            setDestinationMarker(coords);
          } else {
            console.log("Setting Location Marker:", coords);
            setLocationMarker(coords);
          }
        }}
      >
        {/* Location Marker */}
        <Marker
          coordinate={locationMarker}
          title="Your Location"
          description="Start point"
          draggable
          onDragEnd={(e) => {
            const coords = e.nativeEvent.coordinate;
            console.log("Location Marker Dragged to:", coords);
            setLocationMarker(coords);
          }}
          image={require("../assets/images/LocationPinEdited.png")}
          anchor={{ x: 0.5, y: 1 }}
        />

        {/* Destination Marker */}
        <Marker
          coordinate={destinationMarker}
          title="Destination"
          description="End point"
          draggable
          onDragEnd={(e) => {
            const coords = e.nativeEvent.coordinate;
            console.log("Destination Marker Dragged to:", coords);
            setDestinationMarker(coords);
          }}
          image={require("../assets/images/DestinationPinEdited.png")}
          anchor={{ x: 0.5, y: 1 }}
        />

        {/* Polyline (Path) */}
        {locationMarker.latitude &&
          destinationMarker.latitude && (
            <Polyline
              coordinates={[locationMarker, destinationMarker]}
              strokeColor="#000080" // Navy Blue
              strokeWidth={4}
            />
          )}
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