import { StyleSheet } from "react-native";

const MapStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  CameraButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#DB001A",
    justifyContent: "center",
    alignItems: "center",
  },
  HomeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#DB001A",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapStyle;