import React from "react";
import { View, Text, Button, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { LocationObject } from "expo-location";
import type { ScreenProps } from "../types";
import EventGalleryStyle from "../styles/EventGalleryStyle";

const styles = EventGalleryStyle;

const EventGalleryScreen = ({
  navigation,
}: ScreenProps<"EventGalleryScreen">) => {

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true, // 🔴 REQUIRED to read GPS metadata
      quality: 1,
    });

    if (!result.canceled) {
      extractExifLocation(result.assets[0]);
    }
  };

  const extractExifLocation = (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.exif) {
      Alert.alert("No EXIF metadata found in this image");
      return;
    }

    const { GPSLatitude, GPSLongitude } = asset.exif as any;

    if (!GPSLatitude || !GPSLongitude) {
      Alert.alert("No GPS location found in image metadata");
      return;
    }

    const location: LocationObject = {
      coords: {
        latitude: GPSLatitude,
        longitude: GPSLongitude,
        altitude: null,
        accuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    // ✅ Popup required by Issue #268
    Alert.alert(
      "📍 Image Location",
      `Latitude: ${GPSLatitude}\nLongitude: ${GPSLongitude}`
    );

    // ✅ Pass data to next screen (SnapMap flow)
    navigation.navigate("UploadConfirmationScreen", {
      photo: asset,
      location,
    });
  };

  return (
    <View style={styles.root}>
      <Text style={styles.text}>
        Pick an image from gallery to extract location metadata
      </Text>

      <Button
        title="Pick Image from Gallery"
        onPress={pickImageFromGallery}
      />

      <Button
        title="Go Back Home"
        onPress={() => navigation.navigate("HomeScreen")}
      />
    </View>
  );
};

export default EventGalleryScreen;
