import ImageCropPicker from "react-native-image-crop-picker";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import type { ScreenProps } from "../types";

export default function CropScreen({
  navigation,
  route,
}: ScreenProps<"CropScreen">) {
  const { photo, location } = route.params;

  useEffect(() => {
    (async () => {
      try {
        const cropped = await ImageCropPicker.openCropper({
          path: photo.uri,
          width: 1080,
          height: 1080,
          cropping: true,
          freeStyleCropEnabled: true,
          cropperToolbarTitle: "Crop Photo",
          mediaType: "photo"
        });

        navigation.replace("UploadConfirmationScreen", {
          photo: {
            uri: cropped.path,
            width: cropped.width,
            height: cropped.height,
            format: "jpg",
            exif: photo.exif, // keep original EXIF if needed
          },
          location,
        });
      } catch {
        navigation.goBack();
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
