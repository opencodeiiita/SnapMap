import React, { useState } from "react";
import { Alert, Button, Image, View } from "react-native";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";
import type { ScreenProps } from "../types";
import UploadConfirmationStyle from "../styles/UploadConfirmationStyle";

const styles = UploadConfirmationStyle;
const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

console.log("API_BASE_URL:", API_BASE_URL);
console.log("Constants.expoConfig?.extra:", Constants.expoConfig?.extra);

const UploadConfirmationScreen = ({
  navigation,
  route,
}: ScreenProps<"UploadConfirmationScreen">) => {
  const { photo, location } = route.params || {};
  const { getToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!photo?.uri) {
      Alert.alert("No photo found", "Please retake and try again.");
      return;
    }

    if (!location?.coords) {
      Alert.alert("Missing location", "Please enable location and try again.");
      return;
    }

    if (isUploading) return;

    setIsUploading(true);

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Auth error", "Please sign in again.");
        return;
      }

      const form = new FormData();
      form.append("photo", {
        uri: photo.uri,
        name: "snap.jpg",
        type: "image/jpeg",
      } as any);
      form.append("lat", String(location.coords.latitude));
      form.append("lon", String(location.coords.longitude));

      const uploadUrl = `${API_BASE_URL}/api/v1/photos/upload-photo`;
      console.log("Uploading to:", uploadUrl);
      console.log("Token:", token.substring(0, 20) + "...");
      console.log("Full Token:", token);

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { raw: text };
      }

      if (!response.ok) {
        const message = data?.message || `Upload failed (${response.status})`;
        throw new Error(message);
      }

      Alert.alert("Success", "Photo uploaded successfully.", [
        { text: "OK", onPress: () => navigation.navigate("HomeScreen") },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Upload failed",
        error?.message || "Something went wrong during upload."
      );
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
        <Button
          title={isUploading ? "Uploading..." : "Upload Photo"}
          onPress={handleUpload}
          disabled={isUploading}
        />
        <Button
          title="Wanna Retake?"
          onPress={() => navigation.goBack()}
          disabled={isUploading}
        />
      </View>
    </View>
  );
};

export default UploadConfirmationScreen;
