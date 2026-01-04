import React, { useState } from "react";
import { Alert, Button, Image, View, ActivityIndicator } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import type { ScreenProps } from "../types";
import UploadConfirmationStyle from "../styles/UploadConfirmationStyle";

const styles = UploadConfirmationStyle;
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

const UploadConfirmationScreen = ({
  navigation,
  route,
}: ScreenProps<"UploadConfirmationScreen">) => {
  const { photo, location } = route.params || {};
  const { getToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (isUploading) return;
    setIsUploading(true);

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication required. Please sign in again.");
        setIsUploading(false);
        return;
      }

      const data = new FormData();
      data.append("image", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      if (location?.coords) {
        data.append("lat", location.coords.latitude.toString());
        data.append("lon", location.coords.longitude.toString());
      }

      const uploadResponse = await fetch(`${API_BASE_URL}/api/v1/photos/upload-photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.text();
        console.error("Upload failed:", errorData);
        throw new Error("Upload failed");
      }

      Alert.alert("Success", "Photo uploaded successfully!");
      navigation.navigate("HomeScreen");
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert("Upload Failed", error.message || "Failed to upload photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!photo?.uri) {
    return (
      Alert.alert("No photo found", " retake or try agin."),
      navigation.goBack(),
      (<View />)
    );
  }

  return (
    <View style={styles.root}>
      <Image source={{ uri: photo.uri }} style={styles.preview} />
      <View style={styles.actions}>
        {isUploading ? (
          <ActivityIndicator size="large" color="#FF4444" />
        ) : (
          <>
            <Button title="Upload Photo" onPress={handleUpload} />
            <Button title="Wanna Retake?" onPress={() => navigation.goBack()} />
          </>
        )}
      </View>
    </View>
  );
};

export default UploadConfirmationScreen;
