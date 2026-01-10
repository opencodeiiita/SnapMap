import { LinearGradient } from "expo-linear-gradient";
import { useCameraPermissions } from "expo-camera";
import React, { useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { ScreenProps } from "../types";
import CameraPermissionStyle from "../styles/CameraPermissionStyle";

const styles = CameraPermissionStyle;

const CameraPermissionScreen = ({
  navigation,
}: ScreenProps<"CameraPermissionScreen">) => {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission?.granted) {
      navigation.replace("LocationPermissionScreen");
    }
  }, [navigation, permission]);

  const handleAllow = async () => {
    const response = await requestPermission();

    if (response?.granted) {
      navigation.replace("LocationPermissionScreen");
      return;
    }

    if (response && !response.canAskAgain) {
      Alert.alert(
        "Camera permission blocked",
        "Enable camera access for SnapMap in your system settings to continue."
      );
    }
  };

  const handleSkip = () => {
    navigation.replace("LocationPermissionScreen");
  };

  return (
    <LinearGradient
      colors={["#fff4f7", "#ffe9ee"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Share With Campus</Text>
          <Text style={styles.subtitle}>
            SnapMap needs access to your camera so you can capture and share
            photos on the live campus map.
          </Text>

          <View style={styles.iconHolder}>
            <LinearGradient
              colors={["#ff3a64", "#ff586f"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <Ionicons name="camera" size={64} color="#ffffff" />
            </LinearGradient>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity activeOpacity={0.92} onPress={handleAllow}>
            <LinearGradient
              colors={["#ff3a64", "#ff5b6c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Allow Camera Access</Text>
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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CameraPermissionScreen;
