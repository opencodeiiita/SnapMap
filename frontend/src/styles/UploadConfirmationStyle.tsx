import { StyleSheet } from "react-native";

const UploadConfirmationStyle = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: "#fff",
    textAlign: "center",
  },
  preview: {
    width: "100%",
    flex: 1,
    borderRadius: 12,
  },
  actions: {
    width: "100%",
    gap: 12,

    marginBottom: 10,
  },
});

export default UploadConfirmationStyle;
