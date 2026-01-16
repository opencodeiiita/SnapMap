import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";
import type { ScreenProps } from "../types";
import UploadConfirmationStyle from "../styles/UploadConfirmationStyle";

const styles = UploadConfirmationStyle;

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

const UploadConfirmationScreen = ({
  navigation,
  route,
}: ScreenProps<"UploadConfirmationScreen">) => {
  const { photo: initialPhoto, location } = route.params || {};
  const [photo, setPhoto] = useState(initialPhoto);
  const { getToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  if (!photo?.uri) {
    Alert.alert("No photo found", "Please retake and try again.");
    navigation.goBack();
    return null;
  }


  const handleUpload = async () => {
    if (!location?.coords) {
      Alert.alert("Missing location", "Enable location and try again.");
      return;
    }

    if (isUploading) return;
    setIsUploading(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Auth error");

      const form = new FormData();
      form.append("photo", {
        uri: photo.uri,
        name: "snap.jpg",
        type: "image/jpeg",
      } as any);
      form.append("lat", String(location.coords.latitude));
      form.append("lon", String(location.coords.longitude));


      console.log("form", form);
      console.log(`${API_BASE_URL}/api/v1/photos/upload-photo`);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/photos/upload-photo`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("errorText", errorText);
        throw new Error("Upload failed");
      }

      Alert.alert("Success", "Photo uploaded successfully", [
        { text: "OK", onPress: () => navigation.navigate("HomeScreen") },
      ]);
    } catch (error: any) {
      Alert.alert("Upload failed", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.header}>New Post</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Image Card */}
      <View style={styles.imageCard}>
        <Image source={{ uri: photo.uri }} style={styles.previewImage} />

        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>📍 Main Court</Text>
        </View>

        <View style={styles.imageActions}>
  <TouchableOpacity
    style={styles.retakeIcon}
    onPress={() => navigation.navigate("CameraScreen")}
  >
    <Text style={styles.retakeText}>⟳</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.editIcon}
    onPress={() => navigation.goBack()}
  >
    <Text style={styles.editText}>✏️</Text>
  </TouchableOpacity>
</View>
      </View>

      {/* Caption */}
      <View style={styles.captionBox}>
        <TextInput
          placeholder="Write a caption..."
          placeholderTextColor="#999"
          style={styles.captionInput}
        />
        <Text style={styles.emoji}>🙂</Text>
      </View>

      {/* Add Photo */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleUpload}
        disabled={isUploading}
      >
        <Text style={styles.primaryButtonText}>
          {isUploading ? "Uploading..." : "Add Photo  >"}
        </Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadConfirmationScreen;
