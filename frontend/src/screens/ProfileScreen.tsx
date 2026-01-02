import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import type { ScreenProps } from "../types";
import ProfileStyle from "../styles/ProfileStyle";

const styles = ProfileStyle;

const ProfileScreen = ({ navigation }: ScreenProps<"ProfileScreen">) => {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>You are on ProfileScreen</Text>
      <Button
        title="Go Back Home"
        onPress={() => navigation.navigate("HomeScreen")}
      />
    </View>
  );
};

export default ProfileScreen;
