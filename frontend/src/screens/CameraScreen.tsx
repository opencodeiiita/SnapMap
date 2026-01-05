import React, { useState } from "react";
import { View, Text, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import styles from "../styles/CameraScreen.styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<any>;

const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const uploadPhoto = async (imageUri: string): Promise<void> => {
    try {
      console.log("Uploading image:", imageUri);
      Alert.alert("Upload", "Image uploaded successfully!");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "Upload failed");
    }
  };

  const pickFromGallery = async (): Promise<void> => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Gallery permission is required to upload images"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowPreview(true);
    }
  };

  const confirmUpload = async (): Promise<void> => {
    if (!selectedImage) return;
    await uploadPhoto(selectedImage);
    setSelectedImage(null);
    setShowPreview(false);
  };

  if (showPreview && selectedImage) {
    return (
      <View style={styles.root}>
        <Image
          source={{ uri: selectedImage }}
          style={styles.previewImage}
        />

        <View style={styles.previewActions}>
          <Button
            title="Cancel"
            onPress={() => setShowPreview(false)}
          />
          <Button title="Upload" onPress={confirmUpload} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.text}>Camera Screen</Text>

      <Button title="Open Gallery" onPress={pickFromGallery} />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Go Back Home"
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    </View>
  );
};

export default CameraScreen;