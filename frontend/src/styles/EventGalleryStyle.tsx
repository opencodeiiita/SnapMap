import { StyleSheet } from "react-native";

const EventGalleryStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffeef3",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f7dce5",
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterChipActive: {
    backgroundColor: "#ff8ca3",
  },
  filterChipInactive: {
    backgroundColor: "#e9f4ff",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  filterTextInactive: {
    color: "#6f7c91",
  },
  card: {
    backgroundColor: "#fff7fa",
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f06387",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    color: "#6d6d6d",
    fontSize: 14,
  },
  distanceText: {
    color: "#6d6d6d",
    fontSize: 14,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#c8c8c8",
  },
  photosRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  addSnapCard: {
    width: 95,
    height: 115,
    borderRadius: 18,
    borderWidth: 1.3,
    borderStyle: "dashed",
    borderColor: "#ff8ca3",
    backgroundColor: "#ffeef3",
    alignItems: "center",
    justifyContent: "center",
  },
  addSnapIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffd9e3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  addSnapText: {
    color: "#f06387",
    fontSize: 14,
    fontWeight: "700",
  },
  photoCard: {
    width: 95,
    height: 115,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#d9d9d9",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  userBadge: {
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  cardFooter: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contributorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#d9d9d9",
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  contributorText: {
    color: "#6d6d6d",
    fontSize: 13,
    fontWeight: "600",
  },
  viewGalleryText: {
    color: "#f06387",
    fontSize: 14,
    fontWeight: "700",
  },
  profileAvatar: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: "#e5e7eb",
},

});

export default EventGalleryStyle;
