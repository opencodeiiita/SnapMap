import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import type { ScreenProps } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapStyle from "../styles/MapStyle";
import BottomNavigation from "../navigation/BottomNavigation";
import Constants from "expo-constants";
import { API_BASE_URL } from "../apiConfig";
import { useProfile } from "../context/ProfileContext";
import { useUser } from "@clerk/clerk-expo";
import SnapScreen from "./SnapScreen";

const styles = MapStyle;

const DEFAULT_RADIUS_METERS = 300;

type Coordinates = {
  latitude: number;
  longitude: number;
};

type PhotoMarker = {
  id: string;
  latitude: number;
  longitude: number;
  imageURL: string[];
  caption: string;
};

const MapScreen = ({ navigation }: ScreenProps<"MapScreen">) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [photos, setPhotos] = useState<PhotoMarker[]>([]);

  const singlePhoto = require("../assets/images/single-photo-icon.png");
  const multiPhoto = require("../assets/images/multi-photo-icon.png");

  const { profile } = useProfile();
  const { user } = useUser();

  const email = user?.emailAddresses?.[0]?.emailAddress;

  const profileImage =
    profile?.profileImage ||
    user?.imageUrl ||
    (email
      ? `https://api.dicebear.com/7.x/initials/png?seed=${email}`
      : undefined);

  const defaultLocation: Coordinates = {
    latitude: 25.3176,
    longitude: 82.9739,
  };

  const getPhotos = async (coords: Coordinates): Promise<PhotoMarker[]> => {
    try {
      const query = `lat=${coords.latitude}&lon=${coords.longitude}&radius=${DEFAULT_RADIUS_METERS}`;

      const response = await fetch(
        `${API_BASE_URL}/api/v1/photos/nearby?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        console.error("Failed to fetch photos:", response.statusText);
        return [];
      }

      const data = await response.json();

      const markers: PhotoMarker[] = data.map((photo: any) => ({
        id: photo._id,
        longitude: photo.location.coordinates[0],
        latitude: photo.location.coordinates[1],
        imageURL: photo.imageUrl,
        caption: photo.caption,
      }));

      return markers;
    } catch (error) {
      console.error("Error fetching photos:", error);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      let coords: Coordinates = defaultLocation;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync();
          coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
        }
      } catch (error) {
        console.error("Error getting current location, using default:", error);
      }

      setLocation(coords);
      const fetchedPhotos = await getPhotos(coords);
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {photos.map((photo, idx) => (
          <View key={idx}>
            <Marker
              key={photo.id}
              coordinate={{
                latitude: photo.latitude,
                longitude: photo.longitude,
              }}
              image={photo.imageURL.length === 1 ? singlePhoto : multiPhoto}
              onPress={() =>
                navigation.navigate("SnapScreen", {
                  imageURL: photo.imageURL,
                  caption: photo.caption,
                  latitude: photo.latitude,
                  longitude: photo.longitude,
                })
              }
            />
          </View>
        ))}
      </MapView>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search campus..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          {profileImage && (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileAvatar}
            />
          )}
        </TouchableOpacity>
      </View>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default MapScreen;
