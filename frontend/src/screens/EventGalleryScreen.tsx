
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { ScreenProps } from "../types";
import EventGalleryStyle from "../styles/EventGalleryStyle";
import BottomNavigation from "../navigation/BottomNavigation";
import { useProfile } from "../context/ProfileContext";

const styles = EventGalleryStyle;

type EventPhoto = {
  id: string;
  uri: string;
  user: string;
};

type EventItem = {
  id: string;
  title: string;
  location: string;
  distance: string;
  tags: string[];
  contributors: string[];
  contributorCount: number;
  photos: EventPhoto[];
};

const filterOptions = [
  { key: "all", label: "All Events" },
  { key: "popular", label: "Popular" },
  { key: "live", label: "Live Now" },
  { key: "nearby", label: "Nearby" },
];

const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "Chords",
    location: "Main Audi",
    distance: "0.2 mi",
    tags: ["all", "popular"],
    contributors: [
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
    ],
    contributorCount: 42,
    photos: [
      {
        id: "1a",
        uri: "https://images.unsplash.com/photo-1507878866276-a947ef722fee?auto=format&fit=crop&w=400&q=80",
        user: "alex",
      },
    ],
  },
  {
    id: "2",
    title: "Rangtarangini Play",
    location: "Main Audi",
    distance: "0.2 mi",
    tags: ["all", "popular"],
    contributors: [
      "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1455218873509-8097305ee378?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    ],
    contributorCount: 42,
    photos: [
      {
        id: "2a",
        uri: "https://images.unsplash.com/photo-1515165562835-c3b8c1f0d79a?auto=format&fit=crop&w=400&q=80",
        user: "alex",
      },
    ],
  },
  {
    id: "3",
    title: "Prayas",
    location: "BH2",
    distance: "0.3 mi",
    tags: ["all", "live"],
    contributors: [
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
    ],
    contributorCount: 42,
    photos: [
      {
        id: "3a",
        uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
        user: "alex",
      },
    ],
  },
];

const EventGalleryScreen = ({
  navigation,
}: ScreenProps<"EventGalleryScreen">) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { profile } = useProfile();

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return mockEvents;
    return mockEvents.filter((event) => event.tags.includes(activeFilter));
  }, [activeFilter]);

  const handleAddSnap = () => navigation.navigate("CameraScreen");
  const handleProfile = () => navigation.navigate("ProfileScreen");
  const handleViewGallery = () => navigation.navigate("BubbleDetailsScreen");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Campus Events</Text>
          <TouchableOpacity
            onPress={handleProfile}
            style={styles.profileButton}
            accessibilityLabel="Open profile"
          >
            {profile?.profileImage ? (
              <Image
                source={{ uri: profile.profileImage }}
                style={styles.profileAvatar}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={28}
                color="#6b7380"
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterChip,
                  isActive ? styles.filterChipActive : styles.filterChipInactive,
                ]}
                onPress={() => setActiveFilter(option.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive
                      ? styles.filterTextActive
                      : styles.filterTextInactive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredEvents.map((event) => (
          <View key={event.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <TouchableOpacity onPress={handleViewGallery}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#f06387" />
              <Text style={styles.locationText}>{event.location}</Text>
              <View style={styles.dot} />
              <Text style={styles.distanceText}>{event.distance}</Text>
            </View>

            <View style={styles.photosRow}>
              <TouchableOpacity
                style={styles.addSnapCard}
                onPress={handleAddSnap}
                accessibilityLabel="Add a new snap"
              >
                <View style={styles.addSnapIcon}>
                  <Ionicons name="camera-outline" size={22} color="#f06387" />
                </View>
                <Text style={styles.addSnapText}>Add Snap</Text>
              </TouchableOpacity>

              {event.photos.map((photo) => (
                <View key={photo.id} style={styles.photoCard}>
                  <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                  <View style={styles.photoOverlay}>
                    <View style={styles.userBadge}>
                      <Text style={styles.userBadgeText}>@{photo.user}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.contributorRow}>
                <View style={styles.avatarStack}>
                  {event.contributors.slice(0, 3).map((avatar, index) => (
                    <Image
                      key={`${event.id}-avatar-${index}`}
                      source={{ uri: avatar }}
                      style={[
                        styles.avatar,
                        index > 0 ? styles.avatarOverlap : undefined,
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.contributorText}>
                  +{event.contributorCount} contributors
                </Text>
              </View>

              <TouchableOpacity onPress={handleViewGallery}>
                <Text style={styles.viewGalleryText}>View Gallery →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default EventGalleryScreen;
