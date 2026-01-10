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

   /* ---------- TOP CONTROLS ---------- */
  topControls: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  topButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  topButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  /* ---------- BOTTOM CONTROLS ---------- */
  bottomControls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  galleryButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
  },

  galleryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  /* ---------- CAPTURE BUTTON ---------- */
  captureOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#fff",
  },
  bottomPill: {
  position: "absolute",
  bottom: 36,
  alignSelf: "center",
  width: 300,
  height: 72,
  backgroundColor: "#D9D9DD",
  borderRadius: 36,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 18,
},

galleryPreview: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#BFC3C9",
  alignItems: "center",
  justifyContent: "center",
},

previewText: {
  fontSize: 18,
},

captureButton: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: "#EDEDED",
  alignItems: "center",
  justifyContent: "center",
},

captureIcon: {
  fontSize: 24,
},

settingsButton: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#EDEDED",
  alignItems: "center",
  justifyContent: "center",
},

settingsIcon: {
  fontSize: 20,
},


});

export default CameraStyle;