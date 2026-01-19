import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ScreenProps } from "../types";
import { useUser } from "@clerk/clerk-expo";
import HomeStyle from "../styles/HomeStyle";
import { useAuth } from "@clerk/clerk-expo";
import { CommonActions } from "@react-navigation/native";

const styles = HomeStyle;

const HomeScreen = ({ navigation }: ScreenProps<"HomeScreen">) => {
  const { user } = useUser();
  // const { signOut } = useAuth();

  console.log("user", user);

  useEffect(() => {
    if (!user) return;

    if (!user.publicMetadata?.isRegistered) {
      navigation.navigate("RegisterUserScreen");
    }
  }, [user, navigation]);

  // const logout = async () => {
  //   try {
  //     // await signOut();
  //     navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{ name: "SplashScreen" }],
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.mapContainer}>
        <Image
          source={require("../assets/images/map.png")}
          style={styles.mapImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MapScreen")}
        >
          <Text style={styles.buttonText}>EXPLORE MAP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EventGalleryScreen")}
        >
          <Text style={styles.buttonText}>EVENT GALLERY</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CameraScreen")}
        >
          <Ionicons
            name="camera-outline"
            size={24}
            color="#FFFFFF"
            style={styles.cameraIcon}
          />
          <Text style={styles.buttonText}>TAKE PHOTO</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logout}>
        <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
