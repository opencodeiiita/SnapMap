import { StyleSheet } from "react-native";

const BubbleDetailsStyle = StyleSheet.create({
  root: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingTop: 8,
},

headerTitle: {
  fontSize: 18,
  fontWeight: "600",
},

profileButton: {
  padding: 4,
},

profileAvatar: {
  width: 32,
  height: 32,
  borderRadius: 16,
},

content: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
},

});

export default BubbleDetailsStyle;
