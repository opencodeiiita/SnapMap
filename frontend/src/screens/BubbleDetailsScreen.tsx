import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import type { ScreenProps } from "../types";
import BubbleDetailsStyle from "../styles/BubbleDetailsStyle";

const styles = BubbleDetailsStyle;
const BubbleDetailsScreen = ({
  navigation,
}: ScreenProps<"BubbleDetailsScreen">) => {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>You are on BubbleDetailsScreen</Text>
      <Button
        title="Go Back Home"
        onPress={() => navigation.navigate("HomeScreen")}
      />
    </View>
  );
};

export default BubbleDetailsScreen;
