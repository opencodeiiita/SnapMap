import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface LocationIconProps {
  size?: number;
}

const LocationIcon: React.FC<LocationIconProps> = ({ size = 64 }) => {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#F5385D", "#FF8FA3"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container, { width: size, height: size }]}
      >
        <MaterialCommunityIcons
          name="map-marker"
          size={32}
          color="#FFFFFF"
        />
      </LinearGradient>
    </View>
  );
};

export default LocationIcon;

const styles = StyleSheet.create({
  wrapper: {
    shadowColor: "#F5385D",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 13.9989,
    paddingBottom: 14.0019,
    borderRadius: 20,
    transform: [{ rotate: "-0.15deg" }],
    overflow: "hidden",
  },
});
