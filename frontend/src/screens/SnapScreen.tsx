import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ScreenProps } from "../types";
import SnapStyle from "../styles/SnapStyle";
import { RouteProp } from "@react-navigation/native";


const styles = SnapStyle;
export default function SnapScreen({
  navigation,
  route,
}: ScreenProps<"SnapScreen">) {
  const { imageURL, caption } = route.params || {};
  

    return (
    <SafeAreaView style={styles.container}>
  <View style={styles.content}>
    <Text style={styles.titleText}>Snapped Photo</Text>

    {Array.isArray(imageURL) && imageURL.length > 0 ? (
      imageURL.map((url, idx) => (
        <Image
          key={idx}
          source={{ uri: url }}
          style={styles.image}
        />
      ))
    ) : (
      <Text style={styles.infoText}>No image URL provided</Text>
    )}

    <Text style={styles.infoText}>
      {caption} 
    </Text>
  </View>
</SafeAreaView>

  );
};


