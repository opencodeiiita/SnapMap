import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  success: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, visible, onHide, success }) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(onHide);
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <LinearGradient
        colors={["#EC4899", "#F472B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.toast}
      >
        <Ionicons
          name={success ? "checkmark-circle" : "close-circle"}
          size={22}
          color={success ? "#22C55E" : "#EF4444"}
        />

        <Text style={styles.text}>{message}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 12,
    width,
    alignItems: "center",
    zIndex: 1000,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: width - 32,
    gap: 10,
    elevation: 6,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
});
