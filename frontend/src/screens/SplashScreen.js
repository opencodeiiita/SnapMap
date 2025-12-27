import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("HomeScreen");
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>You are on SplashScreen</Text>
    </View>
  );
}
