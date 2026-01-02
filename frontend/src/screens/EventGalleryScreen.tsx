import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import type { ScreenProps } from "../types";
import EventGalleryStyle from "../styles/EventGalleryStyle";

const styles = EventGalleryStyle;

const EventGalleryScreen = ({
  navigation,
}: ScreenProps<"EventGalleryScreen">) => {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>You are on EventGalleryScreen</Text>
      <Button
        title="Go Back Home"
        onPress={() => navigation.navigate("HomeScreen")}
      />
    </View>
  );
};

export default EventGalleryScreen;
