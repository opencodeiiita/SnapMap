import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import type { ScreenProps } from "../types";
import { useUser } from "@clerk/clerk-expo";
import HomeStyle from "../styles/HomeStyle";
import BottomNavigation from "../navigation/BottomNavigation";
import Constants from "expo-constants";
import { useProfile } from "../context/ProfileContext";

const styles = HomeStyle;

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";
const DEFAULT_RADIUS_METERS = 300;

type Coordinates = {
  latitude: number;
  longitude: number;
};

type PhotoMarker = {
  id: string;
  latitude: number;
  longitude: number;
};

const HomeScreen = ({ navigation }: ScreenProps<"HomeScreen">) => {
  const { user } = useUser();
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [photos, setPhotos] = useState<PhotoMarker[]>([]);
  const defaultLocation = {
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
        }
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
      }));

      return markers;
    } catch (error) {
      console.error("Error fetching photos:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!user) return;
    if (!user.publicMetadata?.isRegistered) {
      navigation.navigate("RegisterUserScreen");
    }
  }, [user, navigation]);

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
        } else {
          console.warn(
            "Location permission not granted, using default location for nearby photos"
          );
        }
      } catch (error) {
        console.error("Error getting current location, using default:", error);
      }

      setLocation(coords);

      const fetchedPhotos = await getPhotos(coords);
      setPhotos(fetchedPhotos);
    })();
  }, []);

  const mapLocation = location || defaultLocation;
  const activeCount = photos.length || 124;
  const mapHeight =
    (Dimensions.get("window").height - insets.top - insets.bottom) * 0.5;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.appNameContainer}>
              <Text style={styles.appNameSnap}>SNAP</Text>
              <Text style={styles.appNameMap}>MAP</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              navigation.navigate("ProfileScreen");
            }}
          >
            {profile?.profileImage ? (
              <Image
                source={{ uri: profile.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={28} color="#f43f5e" />
            )}
          </TouchableOpacity>
        </View>

        {/* Discovery Section */}
        <View style={styles.discoverySection}>
          <Text style={styles.discoveryTitle}>
            <Text style={styles.discoverText}>Discover</Text>
            {"\n"}
            <Text style={styles.campusLifeText}>Campus Life</Text>
          </Text>
          <Text style={styles.discoverySubtitle}>
            See what's buzzing on campus right now.
          </Text>
        </View>

        {/* Map Card */}
        <View style={[styles.mapCard, { height: mapHeight }]}>
          {/* LIVE Indicator */}
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
            <Text style={styles.activeText}>{activeCount} Active</Text>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              // Handle send/share action
            }}
          >
            <Ionicons name="paper-plane-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Map */}
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: mapLocation.latitude,
              longitude: mapLocation.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
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
        </View>

        {/* Full Campus Map Card - Below map */}
        <TouchableOpacity
          style={styles.fullMapCard}
          onPress={() => navigation.navigate("MapScreen")}
        >
          <View style={styles.fullMapIconContainer}>
            <MaterialCommunityIcons
              name="map"
              size={24}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.fullMapTextContainer}>
            <Text style={styles.fullMapSubtext}>Tap to explore</Text>
            <Text style={styles.fullMapText}>Full Campus Map</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000000" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default HomeScreen;
