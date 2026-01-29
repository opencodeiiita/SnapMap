import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { ClerkProvider } from "@clerk/clerk-expo";
import Navigation from "./navigation/Navigation";
import { ProfileProvider } from "./context/ProfileContext";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF5F5",
        }}
      >
        <ActivityIndicator size="large" color="#f43f5e" />
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ProfileProvider>
        <Navigation />
      </ProfileProvider>
    </ClerkProvider>
  );
}
