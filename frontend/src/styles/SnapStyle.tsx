import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SnapStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFEFF3', // Pink background from UploadConfirmation
  },
  container: {
    flex: 1,
    backgroundColor: '#FFEFF3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  scrollContent: {
    paddingBottom: 100, 
    alignItems: 'center', // Centering content like UploadConfirmation
  },
  
  // Image Card styling from UploadConfirmation
  imageCard: {
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#FADADD",
    marginBottom: 20,
    width: width - 40, 
    height: 400, // Fixed height for consistency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  paginationBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  paginationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: '600',
  },

  // Content below image
  infoContainer: {
    width: width - 40,
    marginBottom: 20,
  },
  captionBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  captionText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
  },
  locationSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 10,
  },

  // Social Actions
  socialActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // Distributed evenly
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: width - 40,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },

  // Live Snaps
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width - 40,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllButton: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FB7185',
  },
  liveSnapsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    width: width,
  },
  liveSnapCard: {
    width: (width - 55) / 3, // Adjusted for padding
    height: 140,
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  liveSnapImage: {
    width: '100%',
    height: '100%',
  },
  timeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  timeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  userBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    paddingRight: 6,
    paddingLeft: 2,
    paddingVertical: 2,
  },
  userAvatarSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  userHandle: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default SnapStyle;
