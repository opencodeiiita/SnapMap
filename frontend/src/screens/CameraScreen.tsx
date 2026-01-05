import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import type { CameraType, FlashMode } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { ScreenProps } from "../types";
import CameraStyle from "../styles/CameraStyle";

const styles = CameraStyle;

export default function CameraScreen({
  navigation,
}: ScreenProps<"CameraScreen">) {
  const cameraRef = useRef<CameraView | null>(null);

  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOk, setIsCameraOk] = useState(false);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  /* -------------------- Permissions -------------------- */
  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* -------------------- Helpers -------------------- */
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const ensureLocation = async () => {
    const { status } =
      await Location.getForegroundPermissionsAsync();

    if (status === "granted") {
      return await Location.getCurrentPositionAsync({});
    }

    return null;
  };

  /* -------------------- Camera Capture -------------------- */
  const handleCapture = async () => {
    if (!cameraRef.current || !isCameraOk) return;

    const photo = await cameraRef.current.takePictureAsync();
    const location = await ensureLocation();

    navigation.navigate("UploadConfirmationScreen", {
      photo,
      location,
    });
  };

  /* -------------------- Gallery Picker -------------------- */
  const pickFromGallery = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Gallery permission is required"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate("UploadConfirmationScreen", {
        photo: { uri: result.assets[0].uri },
        location: null,
      });
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        onCameraReady={() => setIsCameraOk(true)}
      />

      {/* Top Controls (Flash) */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={toggleFlash}
        >
          <Text style={styles.topButtonText}>
            Flash {flash === "on" ? "On" : "Off"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Gallery (LEFT) */}
        <TouchableOpacity
          style={styles.sideButton}
          onPress={pickFromGallery}
        >
          <Text style={styles.controlText}>Gallery</Text>
        </TouchableOpacity>

        {/* Shutter (CENTER) */}
        <TouchableOpacity
          style={styles.shutterOuter}
          onPress={handleCapture}
        >
          <View style={styles.shutterInnerButton} />
        </TouchableOpacity>

        {/* Flip Camera (RIGHT) */}
        <TouchableOpacity
          style={styles.sideButton}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.controlText}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
