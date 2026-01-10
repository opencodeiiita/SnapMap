import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { useAuth } from "@clerk/clerk-expo";
import type { ScreenProps } from "../types";
import SplashStyle from "../styles/SplashStyle";

const styles = SplashStyle;

const SplashScreen = ({ navigation }: ScreenProps<"SplashScreen">) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [dotOpacity] = useState(new Animated.Value(0.3));

  useEffect(() => {
    // Animate the loading dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [dotOpacity]);

  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      if (isSignedIn) {
        navigation.replace("HomeScreen");
      } else {
        navigation.replace("SignInScreen");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, navigation]);

  return (
    <View style={styles.root}>
      <BlurView intensity={25} style={styles.blurOverlayTop} />
      
      <View style={styles.centerContent}>
        <View style={{ position: "relative" }}>
          <BlurView intensity={20} style={styles.blurOverlayIcon} />
          <Image
            source={require("../assets/images/splashlogo.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.mainText}>SNAP MAP</Text>
        <Text style={styles.subtitle}>DISCOVER YOUR CAMPUS</Text>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
        </View>
        <Text style={styles.version}>VERSION 1.0</Text>
      </View>
      <BlurView intensity={20} style={styles.blurOverlayBottom} />
    </View>
  );
};

export default SplashScreen;
