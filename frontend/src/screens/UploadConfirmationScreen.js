import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";

const UploadConfirmationScreen = ({ route, navigation }) => {
  const { photo, location } = route.params || {};

  const handleUpload = () => {
    const metadata = {
      timestamp: new Date().toISOString(),
      cameraData: photo?.exif || {},
      location: location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : null,
    };

    console.log("📸 Upload Metadata:", metadata);

    Alert.alert("Success", "Photo uploaded successfully!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("HomeScreen"),
      },
    ]);
  };

  if (!photo) {
    return (
      <View style={styles.center}>
        <Text>No photo captured</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.preview} />

      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
          <Text style={styles.btnText}>Retake Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleUpload} style={styles.btn}>
          <Text style={styles.btnText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UploadConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  preview: {
    flex: 1,
  },
 buttons: {
  flexDirection: "row",
  justifyContent: "space-around",
  padding: 20,
  backgroundColor: "#111",
},

  btn: {
    backgroundColor: "#1e1e1e",
    padding: 14,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginTop: 10,
    color: "blue",
  },
});
