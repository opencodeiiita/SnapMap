import React, { useEffect, useState } from "react";
import { View, Text, Image, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { useAuth } from "@clerk/clerk-expo";
import { useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import type { ScreenProps } from "../types";
import SplashStyle from "../styles/SplashStyle";

const styles = SplashStyle;

const SplashScreen = ({ navigation }: ScreenProps<"SplashScreen">) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [dotOpacity] = useState(new Animated.Value(0.3));

  // Camera permission hook (THIS is the key fix)
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();

  // Loading animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [dotOpacity]);

  // 🔑 CENTRAL PERMISSION + AUTH FLOW (FIXED)
  useEffect(() => {
    if (!isLoaded) return;

    const handleAppFlow = async () => {
      // 1️⃣ Camera permission
      if (!cameraPermission) return;

      if (!cameraPermission.granted) {
        await requestCameraPermission();
        navigation.replace("CameraPermissionScreen");
        return;
      }

      // 2️⃣ Location permission
      const locationStatus =
        await Location.getForegroundPermissionsAsync();

      if (!locationStatus.granted) {
        navigation.replace("LocationPermissionScreen");
        return;
      }

      // 3️⃣ Auth routing
      if (isSignedIn) {
        navigation.replace("HomeScreen");
      } else {
        navigation.replace("SignInScreen");
      }
    };

    handleAppFlow();
  }, [
    isLoaded,
    isSignedIn,
    cameraPermission,
    navigation,
    requestCameraPermission,
  ]);

  return (
    <View style={styles.root}>
      <BlurView intensity={25} style={styles.blurOverlayTop} />

      <View style={styles.centerContent}>
        <View style={{ position: "relative" }}>
          <BlurView intensity={20} style={styles.blurOverlayIcon} />
          <Image
            source={require("../assets/images/splashlogo.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.mainText}>SNAP MAP</Text>
        <Text style={styles.subtitle}>DISCOVER YOUR CAMPUS</Text>

        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
        </View>

        <Text style={styles.version}>VERSION 1.0</Text>
      </View>

      <BlurView intensity={20} style={styles.blurOverlayBottom} />
    </View>
  );
};

export default SplashScreen;
