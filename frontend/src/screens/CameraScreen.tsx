import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import type { CameraType, FlashMode } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { ScreenProps } from "../types";
import CameraStyle from "../styles/CameraStyle";

const styles = CameraStyle;
export default function CameraScreen({
  navigation,
}: ScreenProps<"CameraScreen">) {
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState(null);
  const [isCameraOk, setIsCameraOk] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (isMounted) {
        setLocationPermission(status);
      }
    };

    requestLocationPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need camera permission.</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const ensureLocationPermission = async () => {
    const current = await Location.getForegroundPermissionsAsync();

    if (current.status === "granted") {
      setLocationPermission(current.status);
      return "granted";
    }

    if (current.canAskAgain) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      return status;
    }

    Alert.alert(
      "Location permission needed",
      "Enable location permission for Expo Go in system settings."
    );
    setLocationPermission(current.status);
    return current.status;
  };

  const handletheCapture = async () => {
    if (!cameraRef.current || !isCameraOk) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync();
    let location = null;
    const permissionStatus = await ensureLocationPermission();

    if (permissionStatus === "granted") {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          "Location off",
          "Enable location services to add location data."
        );
      } else {
        try {
          location = await Location.getCurrentPositionAsync({});
        } catch (error) {
          Alert.alert("Location error", "Unable to fetch your location.");
        }
      }
    }

    navigation.navigate("UploadConfirmationScreen", {
      photo,
      location,
    });
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        onCameraReady={() => setIsCameraOk(true)}
      />
      <View style={styles.controls}>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Text style={styles.controlText}>
              Flash {flash === "on" ? "On" : "Off"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.controlText}>Flip</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.shutterOuter}
          onPress={handletheCapture}
        >
          <View style={styles.shutterInnerButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
