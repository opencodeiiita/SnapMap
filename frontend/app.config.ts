import { ExpoConfig } from "@expo/config";
import getLocalIPAddress from "./getLocalIPAddress";

const LOCAL_IP = getLocalIPAddress();

const config: ExpoConfig = {
  name: "Snap Map",
  slug: "snap-map",
  version: "1.0.0",

  extra: {
    API_BASE_URL: `http://${LOCAL_IP}:5000`
  }
};

export default config;