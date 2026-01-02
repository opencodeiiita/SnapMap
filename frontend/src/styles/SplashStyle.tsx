import { StyleSheet } from "react-native";

const SplashStyle = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 2,
  },
});

export default SplashStyle;
