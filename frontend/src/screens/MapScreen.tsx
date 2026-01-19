import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import type { ScreenProps } from "../types";
import { FontAwesome } from "@expo/vector-icons";
import MapStyle from "../styles/MapStyle";
import Constants from "expo-constants";
import { useProfile } from "../context/ProfileContext";

const styles = MapStyle;

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

type PhotoMarker = {
  id: string;
  latitude: number;
  longitude: number;
};

const MapScreen = ({ navigation }: ScreenProps<"MapScreen">) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [photos, setPhotos] = useState<PhotoMarker[]>([]);
  const { profile } = useProfile();

  const getPhotos = async (): Promise<PhotoMarker[]> => {
    try {
      console.log(`${API_BASE_URL}/api/v1/photos/all-photos`);

      const response = await fetch(`${API_BASE_URL}/api/v1/photos/all-photos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("response", response);

      if (!response.ok) {
        console.error("Failed to fetch photos:", response.statusText);
        return [];
      }

      const data = await response.json();

      // Transform API response to marker format
      // API returns coordinates as [longitude, latitude] (GeoJSON format)
      const markers: PhotoMarker[] = data.map((photo: any) => ({
        id: photo._id,
        longitude: photo.location.coordinates[0], // longitude first in GeoJSON
        latitude: photo.location.coordinates[1], // latitude second in GeoJSON
      }));

      return markers;
    } catch (error) {
      console.error("Error fetching photos:", error);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status == "granted") {
        console.log("Permission successful");
      } else {
        console.log("Permission not granted");
      }

      const loc = await Location.getCurrentPositionAsync();

      console.log(loc);
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();

    (async () => {
      const fetchedPhotos = await getPhotos();
      setPhotos(fetchedPhotos);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.loading}>
        <Text>Loading Map</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {photos.length > 0 &&
          photos.map((photo) => (
            <Marker
              key={photo.id}
              coordinate={{
                latitude: photo.latitude,
                longitude: photo.longitude,
              }}
            />
          ))}
      </MapView>

      <TouchableOpacity
        style={styles.CameraButton}
        onPress={() => navigation.navigate("CameraScreen")}
      >
        <FontAwesome name="camera" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.HomeButton}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <FontAwesome name="home" size={25} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;
