import { networkInterfaces } from "os";

function getLocalIPAddress() {
  const interfaces = networkInterfaces();

  for (const name in interfaces) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "localhost";
}

export default getLocalIPAddress;
