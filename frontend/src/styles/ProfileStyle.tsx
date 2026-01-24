import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const imageSize = (width - 60) / 3;

const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FF6B8A",
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FF6B8A",
    backgroundColor: "#FFE5E8",
    justifyContent: "center",
    alignItems: "center",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6B8A",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF5F7",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    maxWidth: "90%",   //  constrain the whole row
  },

  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    maxWidth: "45%",   //  critical for ellipsis
  },

  separator: {
    fontSize: 24,
    fontWeight: "300",
    color: "#FF6B8A",
    marginHorizontal: 8,
  },

  collegeName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF6B8A",
    maxWidth: "45%",   //  critical for ellipsis
  },

  bio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  bioSubtext: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 12,
  },
  classBadge: {
    backgroundColor: "#FF6B8A",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  classBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  editProfileButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFF5F7",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#A87D7D",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  statHighlight: {
    color: "#FF6B8A",
  },
  galleryContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  galleryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B8A",
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  galleryImageContainer: {
    width: imageSize,
    height: imageSize,
    margin: 5,
    borderRadius: 12,
    overflow: "hidden",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  emptyGalleryText: {
    width: "100%",
    textAlign: "center",
    color: "#999",
    paddingVertical: 12,
  },
  // Edit Profile Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  saveButton: {
    backgroundColor: "#FF6B8A",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: "#FFB3C1",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F7",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});

export default ProfileStyle;
