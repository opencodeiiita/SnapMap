import { Platform, PermissionsAndroid } from "react-native";
import * as Location from "expo-location";

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

let hasRNGeolocation = false;
let RNGeolocation: any = null;
try {
  // try to require react-native-geolocation-service if available
  // this will work when the app is built with native modules (bare or prebuilt)
  // otherwise we fall back to expo-location
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  RNGeolocation = require("react-native-geolocation-service");
  hasRNGeolocation = !!RNGeolocation?.getCurrentPosition;
} catch (e) {
  hasRNGeolocation = false;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    // iOS: use expo-location request which shows the native prompt
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (err) {
    console.warn("Permission request failed, falling back:", err);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
  if (hasRNGeolocation && RNGeolocation) {
    return new Promise((resolve) => {
      RNGeolocation.getCurrentPosition(
        (position: any) => {
          const { latitude, longitude, accuracy } = position.coords;
          resolve({ latitude, longitude, accuracy });
        },
        (error: any) => {
          console.warn("RNGeolocation error, falling back to expo-location:", error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0, distanceFilter: 0 }
      );
    });
  }

  try {
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, maximumAge: 0 });
    return { latitude: loc.coords.latitude, longitude: loc.coords.longitude, accuracy: loc.coords.accuracy };
  } catch (err) {
    console.warn("expo-location getCurrentPositionAsync failed:", err);
    return null;
  }
};

export default { requestLocationPermission, getCurrentLocation };
