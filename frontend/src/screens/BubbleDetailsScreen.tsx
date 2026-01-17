import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import type { ScreenProps } from "../types";
import { Ionicons } from "@expo/vector-icons";
import BubbleDetailsStyle from "../styles/BubbleDetailsStyle";
import { useProfile } from "../context/ProfileContext";

const styles = BubbleDetailsStyle;

const BubbleDetailsScreen = ({
  navigation,
}: ScreenProps<"BubbleDetailsScreen">) => {
  const { profile } = useProfile();

  const handleProfilePress = () => {
    navigation.navigate("ProfileScreen");
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery</Text>

        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileButton}
          accessibilityLabel="Open profile"
        >
          {profile.profileImage ? (
            <Image
              source={{ uri: profile.profileImage }}
              style={styles.profileAvatar}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={28}
              color="#6b7280"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.text}>You are on BubbleDetailsScreen</Text>
      </View>
    </View>
  );
};

export default BubbleDetailsScreen;
