import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";
import type { ScreenProps } from "../types";
import UploadConfirmationStyle from "../styles/UploadConfirmationStyle";

const styles = UploadConfirmationStyle;
const { width } = Dimensions.get("window");

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

const UploadConfirmationScreen = ({
  navigation,
  route,
}: ScreenProps<"UploadConfirmationScreen">) => {
  const { photo, photos, location } = route.params || {};
  const { getToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState('');

  // Normalize input to an array of photos
  const photosToUpload = photos || (photo ? [photo] : []);

  if (photosToUpload.length === 0) {
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

      const isMultiple = photosToUpload.length > 1;
      const endpoint = isMultiple
        ? `${API_BASE_URL}/api/v1/photos/upload-photos`
        : `${API_BASE_URL}/api/v1/photos/upload-photo`;
      console.log("PHOTO UPLOAD DETAILS");
      console.log("Total photos:", photosToUpload.length);
      console.log("Caption:", caption);
      console.log("Latitude:", location.coords.latitude);
      console.log("Longitude:", location.coords.longitude);
      console.log("Endpoint:", endpoint);

      photosToUpload.forEach((p, index) => {
        console.log(`Photo ${index + 1}`);
        console.log("uri:", p.uri);
        console.log("name:", "snap.jpg");
        console.log("type:", "image/jpeg");
      });
      if (isMultiple) {
        photosToUpload.forEach((p) => {
          form.append("photos[]", {
            uri: p.uri,
            name: "snap.jpg",
            type: "image/jpeg",
          } as any);
        });
      } else {
        form.append("photo", {
          uri: photosToUpload[0].uri,
          name: "snap.jpg",
          type: "image/jpeg",
        } as any);
      }

      form.append("lat", String(location.coords.latitude));
      form.append("lon", String(location.coords.longitude));
      form.append("caption", caption);

      console.log(`Uploading ${photosToUpload.length} photos to ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data', // Usually handled automatically by fetch with FormData
        },
        body: form,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Upload error:", errorText);
        throw new Error("Upload failed");
      }

      Alert.alert("Success", `${photosToUpload.length} photo(s) uploaded!`, [
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.header}>New Post ({photosToUpload.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ height: 400, marginBottom: 20 }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {photosToUpload.map((p, index) => (
            <React.Fragment key={index}>
              <View
                style={[
                  styles.imageCard,
                  { width: width - 40, marginHorizontal: 20 },
                ]}
              >
                <Image source={{ uri: p.uri }} style={styles.previewImage} />

                <View style={styles.locationBadge}>
                  <Text style={styles.locationText}>
                    📍{" "}
                    {photosToUpload.length > 1
                      ? `Photo ${index + 1}/${photosToUpload.length}`
                      : "Main Court"}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </ScrollView>
      </View>

      {/* Caption (Shared for now) */}
      <View style={styles.captionBox}>
        <TextInput
          placeholder="Write a caption..."
          placeholderTextColor="#999"
          style={styles.captionInput}
          value={caption}
          onChangeText={setCaption}
        />
        <Text style={styles.emoji}>🙂</Text>
      </View>

      {/* Add Photo Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleUpload}
        disabled={isUploading}
      >
        <Text style={styles.primaryButtonText}>
          {isUploading
            ? "Uploading..."
            : `Post ${photosToUpload.length} Photo${
                photosToUpload.length > 1 ? "s" : ""
              }  >`}
        </Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadConfirmationScreen;
