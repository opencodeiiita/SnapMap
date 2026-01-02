import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ScreenProps } from "../types";
import ErrorStyle from "../styles/ErrorStyle";

const styles = ErrorStyle;
const ErrorScreen = ({ navigation }: ScreenProps<"ErrorScreen">) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.errorText}>404 ERROR!</Text>
        <Text style={styles.messageText}>
          please check you connection{"\n"}and try again!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen;
