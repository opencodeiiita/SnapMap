import Constants from "expo-constants";

export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("API_BASE_URL is not defined in the Expo configuration.");
}
