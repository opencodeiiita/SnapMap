import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 68) / 2; // 2 columns with padding

export const myUploadsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF5F7',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A87D7D',
    fontWeight: '400',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 40,
  },
  statItem: {
    flex: 1,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A87D7D',
    letterSpacing: 0.5,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'white',
  },
  filterButtonActive: {
    backgroundColor: '#FF4D6D',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A87D7D',
    letterSpacing: 1,
  },
  newBadge: {
    backgroundColor: '#FFE5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF4757',
    letterSpacing: 0.5,
  },
  uploadsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  uploadCard: {
    width: cardWidth,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
    overflow: 'hidden',
  },
  uploadImage: {
    width: '100%',
    height: cardWidth * 1.2,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  uploadInfo: {
    padding: 12,
  },
  uploadTimestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  uploadLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uploadLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  profileAvatar: {
  width: 32,
  height: 32,
  borderRadius: 16,
},
  emptyState: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 16,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sliderFrame: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#F7F7F7',
  },
  sliderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 12,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  navButtonLeft: {
    marginRight: 8,
  },
  navButtonRight: {
    marginLeft: 8,
  },
  sliderImageWrapper: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fdfdfd',
  },
  sliderImage: {
    width: '100%',
    height: width * 0.9,
  },
  sliderPlaceholder: {
    width: '100%',
    height: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  sliderMeta: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  sliderCaption: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sliderTimestamp: {
    fontSize: 13,
    color: '#8c8c8c',
  },

});
