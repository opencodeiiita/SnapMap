import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { myUploadsStyles } from '../styles/MyUploadsStyle';


const { width } = Dimensions.get('window');

// Mock data with image URLs
const mockUploads = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    location: 'Student Union',
    timestamp: '2h ago',
    status: 'ENDED',
    section: 'THIS WEEK',
    badge: 'ended' as const,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585',
    location: 'The Quad Lawn',
    timestamp: 'Just now',
    status: 'LIVE',
    section: 'THIS WEEK',
    badge: 'live' as const,
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
    location: 'Main Library',
    timestamp: 'Sep 28',
    status: null,
    section: 'SEPTEMBER',
    badge: null,
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
    location: 'Stadium',
    timestamp: 'Sep 22',
    status: 'FEATURED',
    section: 'SEPTEMBER',
    badge: 'featured' as const,
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926',
    location: 'Art Gallery',
    timestamp: 'Sep 15',
    status: null,
    section: 'SEPTEMBER',
    badge: null,
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    location: 'Campus Plaza',
    timestamp: 'Sep 10',
    status: null,
    section: 'SEPTEMBER',
    badge: null,
  },
];

type FilterType = 'All' | 'Events' | 'Places' | 'Recent';
type BadgeType = 'ended' | 'live' | 'featured';

interface Upload {
  id: string;
  imageUrl: string;
  location: string;
  timestamp: string;
  status: string | null;
  section: string;
  badge: BadgeType | null;
}

const MyUploadsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');

  const totalPhotos = mockUploads.length;
  const eventsJoined = mockUploads.filter(
    (upload) => upload.badge === 'live' || upload.badge === 'ended'
  ).length;

  // Group uploads by section
  const groupedUploads = mockUploads.reduce((acc, upload) => {
    if (!acc[upload.section]) {
      acc[upload.section] = [];
    }
    acc[upload.section].push(upload);
    return acc;
  }, {} as Record<string, Upload[]>);

  const handleSettingsPress = () => {
    // @ts-ignore - Navigation type definition
    navigation.navigate('SettingsScreen');
  };

  const renderFilterButton = (filter: FilterType) => (
    <TouchableOpacity
      key={filter}
      style={[
        myUploadsStyles.filterButton,
        selectedFilter === filter && myUploadsStyles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          myUploadsStyles.filterButtonText,
          selectedFilter === filter && myUploadsStyles.filterButtonTextActive,
        ]}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const renderBadge = (badge: BadgeType | null) => {
    if (!badge) return null;

    const badgeConfig: Record<BadgeType, { icon: string; color: string; backgroundColor: string }> = {
      ended: { icon: '🔴', color: '#ffffff', backgroundColor: 'rgba(17, 24, 39, 0.8)' },
      live: { icon: '⭕', color: '#FF4757', backgroundColor: 'rgb(255, 255, 255)' },
      featured: { icon: '⭐', color: '#78350F', backgroundColor: 'rgba(252, 211, 77, 0.9)' },
    };

    const config = badgeConfig[badge];

    return (
      <View style={[myUploadsStyles.badge, { backgroundColor: config.backgroundColor }]}>
        <Text style={[myUploadsStyles.badgeText, { color: config.color }]}>
          {config.icon} {badge.toUpperCase()}
        </Text>
      </View>
    );
  };

  const renderUploadCard = (upload: Upload) => (
    <React.Fragment key={upload.id}>
      <View style={myUploadsStyles.uploadCard}>
          <Image 
            source={{ uri: upload.imageUrl }} 
            style={myUploadsStyles.uploadImage}
            resizeMode="cover"
          />

        {renderBadge(upload.badge)}
        <View style={myUploadsStyles.uploadInfo}>
          <Text style={myUploadsStyles.uploadTimestamp}>{upload.timestamp}</Text>
          <View style={myUploadsStyles.uploadLocationContainer}>
            <Ionicons name="location-outline" size={14} color="#FF4757" />
            <Text style={myUploadsStyles.uploadLocation}>{upload.location}</Text>
          </View>
        </View>
      </View>
    </React.Fragment>
  );

  const renderSection = (sectionTitle: string, uploads: Upload[]) => {
    const newCount = uploads.filter((u) => u.section === 'THIS WEEK').length;

    return (
      <View key={sectionTitle} style={myUploadsStyles.section}>
        <View style={myUploadsStyles.sectionHeader}>
          <Text style={myUploadsStyles.sectionTitle}>{sectionTitle}</Text>
          {sectionTitle === 'THIS WEEK' && newCount > 0 && (
            <View style={myUploadsStyles.newBadge}>
              <Text style={myUploadsStyles.newBadgeText}>{newCount} NEW</Text>
            </View>
          )}
        </View>
        <View style={myUploadsStyles.uploadsGrid}>
          {uploads.map((upload) => renderUploadCard(upload))}
        </View>
      </View>
    );
  };

  return (
    <View style={myUploadsStyles.container}>
      {/* Header */}
      <View style={myUploadsStyles.header}>
        <View>
          <Text style={myUploadsStyles.title}>My Uploads</Text>
          <Text style={myUploadsStyles.subtitle}>Photos you've shared on campus</Text>
        </View>
        <TouchableOpacity onPress={handleSettingsPress} style={myUploadsStyles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={myUploadsStyles.statsContainer}>
        <View style={myUploadsStyles.statItem}>
          <Text style={myUploadsStyles.statNumber}>{totalPhotos}</Text>
          <Text style={myUploadsStyles.statLabel}>TOTAL PHOTOS</Text>
        </View>
        <View style={myUploadsStyles.statItem}>
          <Text style={myUploadsStyles.statNumber}>{eventsJoined}</Text>
          <Text style={myUploadsStyles.statLabel}>EVENTS JOINED</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={myUploadsStyles.filtersContainer}>
        {(['All', 'Events', 'Places', 'Recent'] as FilterType[]).map(renderFilterButton)}
      </View>

      {/* Uploads */}
      <ScrollView style={myUploadsStyles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedUploads).map(([section, uploads]) =>
          renderSection(section, uploads)
        )}
      </ScrollView>
    </View>
  );
};

export default MyUploadsScreen;
