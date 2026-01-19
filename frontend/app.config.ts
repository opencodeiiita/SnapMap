import getLocalIPAddress from "./getLocalIPAddress.ts";

const ip = getLocalIPAddress();

export default {
  name: "Snap Map",
  slug: "snap-map",
  scheme: "snapmap",
  version: "1.0.0",

  userInterfaceStyle: "automatic",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.snapmap.app",
    infoPlist: {
      NSCameraUsageDescription: "Allow Snap Map to access your camera.",
      NSLocationWhenInUseUsageDescription: "Allow Snap Map to access your location while using the app."
    }
  },

  android: {
    package: "com.snapmap.app",
    edgeToEdgeEnabled: true,
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/icon.png",
      backgroundColor: "#E6F4FE",
      backgroundImage: "./src/assets/images/android-icon-background.png",
      monochromeImage: "./src/assets/images/android-icon-monochrome.png"
    }
  },

  plugins: [
    [
      "expo-splash-screen",
      {
        image: "./src/assets/images/icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: { backgroundColor: "#000000" }
      }
    ]
  ],

  experiments: {
    reactCompiler: true
  },

  extra: {
    API_BASE_URL: `http://${ip}:5000`
  }
};
