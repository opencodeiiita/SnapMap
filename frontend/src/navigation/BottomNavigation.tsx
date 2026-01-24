import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<RootParamList>;

const BottomNavigation = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const isActive = (screenName: keyof RootParamList) => {
    return route.name === screenName;
  };

  // Determine center button icon and action based on current route
  const getCenterButton = () => {
    const currentRoute = route.name;
    
    if (currentRoute === "MapScreen") {
      return {
        icon: <MaterialCommunityIcons name="compass-outline" size={26} color="#FFFFFF" />,
        onPress: () => {}, // Already on MapScreen, do nothing
      };
    } else if (currentRoute === "EventGalleryScreen") {
      return {
        icon: <Ionicons name="images-outline" size={26} color="#FFFFFF" />,
        onPress: () => {}, // Already on EventGalleryScreen, do nothing
      };
    } else {
      // Default: Camera button for HomeScreen and other screens
      return {
        icon: <FontAwesome name="camera" size={26} color="#FFFFFF" />,
        onPress: () => navigation.navigate("CameraScreen"),
      };
    }
  };

  const centerButton = getCenterButton();
  const currentRoute = route.name;

  // Get left button - if it is mapscreen, the left should be camera... else map
  // Get right button - if it is eventgalleryscreen, the right should be camera... else gallery
  const leftButton = currentRoute === "MapScreen" ? "camera" : "map";
  const rightButton = currentRoute === "EventGalleryScreen" ? "camera" : "eventgallery";

  // Get left button icon and action
  const getLeftButton = () => {
    if (leftButton === "camera") {
      return {
        icon: <FontAwesome name="camera" size={26} color="#9CA3AF" />,
        onPress: () => navigation.navigate("CameraScreen"),
      };
    } else {
      return {
        icon: (
          <MaterialCommunityIcons
            name="compass-outline"
            size={26} // Compass icon
            color={isActive("MapScreen") || route.name === "SnapScreen" ? "#EF4444" : "#9CA3AF"}
          />
        ),
        onPress: () => navigation.navigate("MapScreen"),
      };
    }
  };

  // Get right button icon and action
  const getRightButton = () => {
    if (rightButton === "camera") {
      return {
        icon: <FontAwesome name="camera" size={26} color="#9CA3AF" />,
        onPress: () => navigation.navigate("CameraScreen"),
      };
    } else {
      return {
        icon: (
          <Ionicons
            name="images-outline"
            size={26}
            color={isActive("EventGalleryScreen") ? "#EF4444" : "#9CA3AF"}
          />
        ),
        onPress: () => navigation.navigate("EventGalleryScreen"),
      };
    }
  };

  const leftButtonConfig = getLeftButton();
  const rightButtonConfig = getRightButton();

  return (
    <View style={styles.bottomNavWrapper}>
      <View style={styles.bottomNav}>
        {/* Left Button - Dynamic: Camera on MapScreen, Map otherwise */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={leftButtonConfig.onPress}
        >
          {leftButtonConfig.icon}
        </TouchableOpacity>

        {/* Spacer for center button */}
        <View style={{ width: 72 }} />

        {/* Right Button - Dynamic: Camera on EventGalleryScreen, Gallery otherwise */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={rightButtonConfig.onPress}
        >
          {rightButtonConfig.icon}
        </TouchableOpacity>
      </View>

      {/* Center Button - Dynamic based on current route */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={centerButton.onPress}
        activeOpacity={0.85}
      >
        {centerButton.icon}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavWrapper: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNav: {
    width: "100%",
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  navItem: {
    padding: 10,
  },
  centerButton: {
    position: "absolute",
    top: -28, // Creates the cut-out effect
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 16,
  },
  floatingCameraButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
});

export default BottomNavigation;
