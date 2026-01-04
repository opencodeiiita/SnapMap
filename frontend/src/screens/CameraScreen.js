import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const CameraScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // 🔁 This simulates the existing upload pipeline.
  // If your project already has an upload function, MOVE its logic here
  // and reuse it for both camera & gallery images.
  const uploadPhoto = async (imageUri) => {
    try {
      console.log("Uploading image:", imageUri);
      Alert.alert("Upload", "Image uploaded successfully!");
      navigation.navigate("HomeScreen");
    } catch (err) {
      Alert.alert("Error", "Upload failed");
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery permission is needed");
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

  const confirmUpload = async () => {
    if (!selectedImage) return;
    await uploadPhoto(selectedImage);
    setSelectedImage(null);
    setShowPreview(false);
  };

  // 🖼️ Preview Screen
  if (showPreview && selectedImage) {
    return (
      <View style={styles.root}>
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        <View style={styles.previewActions}>
          <Button title="Cancel" onPress={() => setShowPreview(false)} />
          <Button title="Upload" onPress={confirmUpload} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.text}>Camera Screen</Text>

      {/* Existing camera button can stay here */}
      <Button title="Open Gallery" onPress={pickFromGallery} />

      <View style={{ marginTop: 20 }}>
        <Button title="Go Back Home" onPress={() => navigation.navigate("HomeScreen")} />
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  previewImage: {
    width: 300,
    height: 400,
    resizeMode: "contain",
    marginBottom: 20,
  },
  previewActions: {
    flexDirection: "row",
    gap: 20,
  },
});
