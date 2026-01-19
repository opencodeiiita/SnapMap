import { StyleSheet } from "react-native";

const HomeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    overflow: "hidden",
  },
  mapImage: {
    width: "125%",
    height: "125%",
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  button: {
    backgroundColor: "#FF4444",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cameraIcon: {
    marginRight: 12,
  },
  logout: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 100,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeStyle;
