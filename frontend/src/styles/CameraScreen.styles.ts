import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  previewImage: {
    width: 300,
    height: 400,
    resizeMode: "contain",
    marginBottom: 20,
  },
  previewActions: {
    flexDirection: "row",
    gap: 20,
  },
});

export default styles;