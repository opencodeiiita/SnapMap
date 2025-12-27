import React from "react";
import { View, Text, Button } from "react-native";

export default function UploadConfirmationScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ textAlign: "center" }}>You are on UploadConfirmationScreen</Text>
      <Button title="Back to Home" onPress={() => navigation.navigate("HomeScreen")} />
    </View>
  );
}
