import getLocalIPAddress from "./getLocalIPAddress.ts";

const ip = getLocalIPAddress();

export default {
  name: "Snap Map",
  slug: "snap-map",
  scheme: "snapmap",
  version: "1.0.0",

  extra: {
    API_BASE_URL: `http://${ip}:5000`,
  },
};
