import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import type { ScreenProps } from "../types";
import LocationPermissionStyle from "../styles/LocationPermissionStyle";

const styles = LocationPermissionStyle;

const FEATURES = [
  {
    icon: "people-outline" as const,
    title: "Find friends nearby",
    description: "See who is hanging out around campus in real time.",
  },
  {
    icon: "camera-outline" as const,
    title: "Tag your snaps",
    description: "Drop photos on the live map so friends can explore them.",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "You control visibility",
    description: "Your location is only shared when you choose to.",
  },
];

const LocationPermissionScreen = ({
  navigation,
}: ScreenProps<"LocationPermissionScreen">) => {
  const [requesting, setRequesting] = useState(false);

  const handleAllow = async () => {
    if (requesting) return;

    setRequesting(true);
    try {
      const response = await Location.requestForegroundPermissionsAsync();

      if (response.status === "granted") {
        // 🔁 Return control to SplashScreen
        navigation.replace("SplashScreen");
        return;
      }

      if (!response.canAskAgain) {
        Alert.alert(
          "Location permission blocked",
          "Enable location access for SnapMap in your system settings."
        );
      }
    } finally {
      setRequesting(false);
    }
  };

  const handleSkip = () => {
    // 🔁 SplashScreen decides next step
    navigation.replace("SplashScreen");
  };

  return (
    <LinearGradient
      colors={["#fff4f7", "#ffe9ee"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageShadow}>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../assets/images/map.png")}
                style={styles.featureImage}
              />
            </View>
          </View>

          <View style={styles.headerBlock}>
            <Text style={styles.title}>Unlock Your Campus</Text>
            <Text style={styles.subtitle}>
              SnapMap needs your location to show you the best parties, study
              spots, and live events happening right now.
            </Text>
          </View>

          <View style={styles.featureList}>
            {FEATURES.map((item) => (
              <View key={item.title} style={styles.featureCard}>
                <LinearGradient
                  colors={["#fff0f5", "#ffe1ea"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureIcon}
                >
                  <Ionicons name={item.icon} size={20} color="#ff3d67" />
                </LinearGradient>
                <View style={styles.featureTextBlock}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed-outline" size={14} color="#9a9a9a" />
            <Text style={styles.privacyText}>
              WE NEVER TRACK YOU WHEN CLOSED
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={handleAllow}
              disabled={requesting}
            >
              <LinearGradient
                colors={["#ff3a64", "#ff5b6c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.primaryButton,
                  requesting && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {requesting ? "Allowing..." : "Allow Location Access"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.secondaryButton}
              onPress={handleSkip}
            >
              <Text style={styles.secondaryButtonText}>Not now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LocationPermissionScreen;
