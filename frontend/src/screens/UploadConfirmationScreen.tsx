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
import { API_BASE_URL } from "../apiConfig";
import { useAuth } from "@clerk/clerk-expo";
import type { ScreenProps } from "../types";
import UploadConfirmationStyle from "../styles/UploadConfirmationStyle";
import Toast from "../components/Toast";

const styles = UploadConfirmationStyle;
const { width } = Dimensions.get("window");

const UploadConfirmationScreen = ({
  navigation,
  route,
}: ScreenProps<"UploadConfirmationScreen">) => {
  const { photo, photos, location } = route.params || {};
  const { getToken } = useAuth();

  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    success: boolean;
  }>({
    visible: false,
    message: "",
    success: true,
  });

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

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setToast({
        visible: true,
        message: "Photo uploaded successfully",
        success: true,
      });
    } catch (error) {
      setToast({
        visible: true,
        message: "Upload failed",
        success: false,
      });
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
            <View
              key={index}
              style={[
                styles.imageCard,
                { width: width - 40, marginHorizontal: 20 },
              ]}
            >
              <Image source={{ uri: p.uri }} style={styles.previewImage} />

              <View style={styles.locationBadge}>
                <Text style={styles.locationText}>
                  {photosToUpload.length > 1
                    ? `Photo ${index + 1}/${photosToUpload.length}`
                    : "Main Court"}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.captionBox}>
        <TextInput
          placeholder="Write a caption..."
          placeholderTextColor="#999"
          style={styles.captionInput}
          value={caption}
          onChangeText={setCaption}
        />
      </View>

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
              } >`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      <Toast
        visible={toast.visible}
        message={toast.message}
        success={toast.success}
        onHide={() => {
          setToast((prev) => ({ ...prev, visible: false }));
          if (toast.success) {
            navigation.navigate("HomeScreen");
          }
        }}
      />
    </View>
  );
};

export default UploadConfirmationScreen;
