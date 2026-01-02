import { StyleSheet } from "react-native";

const CameraStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    backgroundColor: "#000000ff",
  },
  permissionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  controlButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  controlText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#0e0d0dff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInnerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffffffff",

    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default CameraStyle;