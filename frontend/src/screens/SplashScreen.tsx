import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import type { ScreenProps } from "../types";
import SplashStyle from "../styles/SplashStyle";

const styles = SplashStyle;

const SplashScreen = ({ navigation }: ScreenProps<"SplashScreen">) => {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      if (isSignedIn) {
        navigation.replace("HomeScreen");
      } else {
        navigation.replace("SignInScreen");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, navigation]);

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.text}>SNAP MAP</Text>
    </View>
  );
};

export default SplashScreen;
