import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/clerk-expo";
import type { RootParamList } from "../types";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect } from "react";


// Import screens
import SplashScreen from "../screens/SplashScreen";
import SignInScreen from "../screens/SignInScreen";
import HomeScreen from "../screens/HomeScreen";
import CameraPermissionScreen from "../screens/CameraPermissionScreen";
import LocationPermissionScreen from "../screens/LocationPermissionScreen";
import CameraScreen from "../screens/CameraScreen";
import MapScreen from "../screens/MapScreen";
import UploadConfirmationScreen from "../screens/UploadConfirmationScreen";
import BubbleDetailsScreen from "../screens/BubbleDetailsScreen";
import EventGalleryScreen from "../screens/EventGalleryScreen";
import MyUploadsScreen from "../screens/MyUploadsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ErrorScreen from "../screens/ErrorScreen";
import RegisterUserScreen from "../screens/RegisterUserScreen";
import CropScreen from "../screens/CropScreen";

const Stack = createNativeStackNavigator<RootParamList>();
ExpoSplashScreen.preventAutoHideAsync();

// Main navigator that shows SplashScreen first
const MainNavigator = () => {
  return (
    <Stack.Navigator
      id="MainStack"
      screenOptions={{ headerShown: false }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="CameraPermissionScreen"
        component={CameraPermissionScreen}
      />
      <Stack.Screen
        name="LocationPermissionScreen"
        component={LocationPermissionScreen}
      />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen
        name="UploadConfirmationScreen"
        component={UploadConfirmationScreen}
      />
      <Stack.Screen
        name="BubbleDetailsScreen"
        component={BubbleDetailsScreen}
      />
      <Stack.Screen name="EventGalleryScreen" component={EventGalleryScreen} />
      <Stack.Screen name="MyUploadsScreen" component={MyUploadsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ErrorScreen" component={ErrorScreen} />
      <Stack.Screen name="RegisterUserScreen" component={RegisterUserScreen} />
      <Stack.Screen name="CropScreen" component={CropScreen} />
    </Stack.Navigator>
  );
};

// Loading screen while Clerk initializes
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4285F4" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const Navigation = () => {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      ExpoSplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default Navigation;
