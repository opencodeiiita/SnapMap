import { StyleSheet } from "react-native";

const ErrorStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  messageText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#000",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default ErrorStyle;
