import React from "react";
import { Alert, Button, Image, StyleSheet, View } from "react-native";
import type { ScreenProps } from "../types";
import UploadConfirmationStyle from "../styles/UploadConfirmationStyle";

const styles = UploadConfirmationStyle;

const UploadConfirmationScreen = ({
  navigation,
  route,
}: ScreenProps<"UploadConfirmationScreen">) => {
  const { photo, location } = route.params || {};

  const handleUpload = () => {
    const timestamp = new Date().toISOString();
    const coords = location?.coords
      ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      : null;

    console.log("metadata", {
      timestamp,
      photo,
      location: coords,
    });

    Alert.alert("Photo was uploaded", "logged the data.");
    navigation.navigate("HomeScreen");
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
        <Button title="Upload Photo" onPress={handleUpload} />
        <Button title="Wanna Retake?" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

export default UploadConfirmationScreen;
