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
import { useProfile } from '../context/ProfileContext';

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
  const { profile } = useProfile();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');

  const totalPhotos = mockUploads.length;
  const eventsJoined = mockUploads.filter(
    (upload) => upload.badge === 'live' || upload.badge === 'ended'
  ).length;

  const groupedUploads = mockUploads.reduce((acc, upload) => {
    if (!acc[upload.section]) {
      acc[upload.section] = [];
    }
    acc[upload.section].push(upload);
    return acc;
  }, {} as Record<string, Upload[]>);

  const handleSettingsPress = () => {
    // @ts-ignore
    navigation.navigate('SettingsScreen');
  };

  const handleProfilePress = () => {
    // @ts-ignore
    navigation.navigate('ProfileScreen');
  };

  return (
    <View style={myUploadsStyles.container}>
      {/* Header */}
      <View style={myUploadsStyles.header}>
        <View>
          <Text style={myUploadsStyles.title}>My Uploads</Text>
          <Text style={myUploadsStyles.subtitle}>Photos you've shared on campus</Text>
        </View>

        <TouchableOpacity onPress={handleProfilePress}>
          {profile.profileImage ? (
            <Image
              source={{ uri: profile.profileImage }}
              style={myUploadsStyles.profileAvatar}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={28} color="#6b7280" />
          )}
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

      {/* Uploads */}
      <ScrollView style={myUploadsStyles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedUploads).map(([section, uploads]) => (
          <View key={section} style={myUploadsStyles.section}>
            <Text style={myUploadsStyles.sectionTitle}>{section}</Text>
            <View style={myUploadsStyles.uploadsGrid}>
              {uploads.map((upload) => (
                <View key={upload.id} style={myUploadsStyles.uploadCard}>
                  <Image
                    source={{ uri: upload.imageUrl }}
                    style={myUploadsStyles.uploadImage}
                  />
                  <View style={myUploadsStyles.uploadInfo}>
                    <Text style={myUploadsStyles.uploadTimestamp}>
                      {upload.timestamp}
                    </Text>
                    <View style={myUploadsStyles.uploadLocationContainer}>
                      <Ionicons name="location-outline" size={14} color="#FF4757" />
                      <Text style={myUploadsStyles.uploadLocation}>
                        {upload.location}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MyUploadsScreen;
