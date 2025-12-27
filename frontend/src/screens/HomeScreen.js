import React from "react";
import { View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", gap: 10 }}>
      <Text style={{ textAlign: "center" }}>You are on HomeScreen</Text>

      <Button title="Camera" onPress={() => navigation.navigate("CameraScreen")} />
      <Button title="Map" onPress={() => navigation.navigate("MapScreen")} />
      <Button title="Upload Confirmation" onPress={() => navigation.navigate("UploadConfirmationScreen")} />
      <Button title="Bubble Details" onPress={() => navigation.navigate("BubbleDetailsScreen")} />
      <Button title="Event Gallery" onPress={() => navigation.navigate("EventGalleryScreen")} />
      <Button title="My Uploads" onPress={() => navigation.navigate("MyUploadsScreen")} />
      <Button title="Profile" onPress={() => navigation.navigate("ProfileScreen")} />
      <Button title="Settings" onPress={() => navigation.navigate("SettingsScreen")} />
      <Button title="Error Screen" onPress={() => navigation.navigate("ErrorScreen")} />
    </View>
  );
}