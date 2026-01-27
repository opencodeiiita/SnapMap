import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import type { CameraType, FlashMode } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import type { ScreenProps } from "../types";
import CameraStyle from "../styles/CameraStyle";

const styles = CameraStyle;
export default function CameraScreen({
  navigation,
}: ScreenProps<"CameraScreen">) {
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOk, setIsCameraOk] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const requestLocationPermission = async () => {
      await Location.requestForegroundPermissionsAsync();
    };

    if (isMounted) {
      requestLocationPermission();
    }

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
      return "granted";
    }

    if (current.canAskAgain) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status;
    }

    Alert.alert(
      "Location permission needed",
      "Enable location permission for Expo Go in system settings."
    );
    return current.status;
  };

  const handletheCapture = async () => {
    if (!cameraRef.current || !isCameraOk) return;

    // fast capture
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.85,
      skipProcessing: true,
    });

    // navigate instantly
    navigation.navigate("UploadConfirmationScreen", {
      photo,
      location: null,
    });

    // fetch location in background
    fetchLocationInBackground(photo);
  };
  const fetchLocationInBackground = async (photo: any) => {
    const permissionStatus = await ensureLocationPermission();

    if (permissionStatus === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        navigation.navigate("UploadConfirmationScreen", {
          photo,
          location,
        });
      } catch (err) {
        Alert.alert(err);
      }
    }
  };

  const handleGalleryPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need gallery access to select photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (result.canceled) {
      return;
    }

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
      photo:
        result.assets.length === 1
          ? ({
              uri: result.assets[0].uri,
              width: result.assets[0].width,
              height: result.assets[0].height,
            } as any)
          : undefined,
      photos: result.assets.map((asset) => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        name: asset.fileName || "photo.jpg",
        type: asset.mimeType || "image/jpeg",
      })),
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

      {/* Top controls */}
      <View style={styles.topControls}>
        <TouchableOpacity onPress={toggleFlash} style={styles.topButton}>
          <Text style={styles.topButtonText}>
            ⚡ {flash === "on" ? "On" : "Off"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleCameraFacing} style={styles.topButton}>
          <Text style={styles.topButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom pill controls */}
      <View style={styles.bottomPill}>
        {/* Gallery preview */}
        <TouchableOpacity onPress={handleGalleryPick}>
          <View style={styles.galleryPreview}>
            <Text style={styles.previewText}>🖼️</Text>
          </View>
        </TouchableOpacity>

        {/* Capture button */}
        <TouchableOpacity onPress={handletheCapture}>
          <View style={styles.captureButton}>
            <Text style={styles.captureIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
          <View style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
