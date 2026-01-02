import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import type { ScreenProps } from "../types";
import MyUploadsStyle from "../styles/MyUploadsStyle";

const styles = MyUploadsStyle;

const MyUploadsScreen = ({ navigation }: ScreenProps<"MyUploadsScreen">) => {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>You are on MyUploadsScreen</Text>
      <Button
        title="Go Back Home"
        onPress={() => navigation.navigate("HomeScreen")}
      />
    </View>
  );
};

export default MyUploadsScreen;