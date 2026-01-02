import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import type { ScreenProps } from "../types";
import SettingsStyle from "../styles/SettingsStyle";

const styles = SettingsStyle;

const SettingsScreen = ({ navigation }: ScreenProps<"SettingsScreen">) => {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>You are on SettingsScreen</Text>
      <Button
        title="Go Back Home"
        onPress={() => navigation.navigate("HomeScreen")}
      />
    </View>
  );
};

export default SettingsScreen;
