import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useUser } from "@clerk/clerk-expo";
import { myUploadsStyles } from "../styles/MyUploadsStyle";
import { useProfile } from "../context/ProfileContext";
import {
  formatTimestamp,
  normalizeUserUploads,
  UserUpload,
} from "../utils/photoHelpers";

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

type FilterKey = "All" | "Events" | "Places" | "Recent";
const filterOptions: { key: FilterKey; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Events", label: "Events" },
  { key: "Places", label: "Places" },
  { key: "Recent", label: "Recent" },
];

const MyUploadsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile } = useProfile();
  const { user } = useUser();
  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("All");

  useEffect(() => {
    if (user?.id) {
      fetchUploads(user.id);
    }
  }, [user?.id]);

  const fetchUploads = async (clerkId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/photos/get-user-photos/${clerkId}`
      );
      const rawData = await response.json();
      const normalized = normalizeUserUploads(rawData);
      setUploads(normalized);
    } catch (error) {
      console.error("Error fetching uploads:", error);
      setUploads([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUploads = useMemo(() => {
    let list = uploads;
    if (selectedFilter === "Events") {
      list = uploads.filter(
        (u) => u.badge === "live" || u.badge === "ended"
      );
    } else if (selectedFilter === "Recent") {
      list = [...uploads].sort((a, b) => {
        const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return tb - ta;
      });
    }
    // Places could be implemented when backend provides categories; for now, same as all.
    return list;
  }, [uploads, selectedFilter]);

  const groupedUploads = useMemo(() => {
    return filteredUploads.reduce((acc, upload) => {
      // Use timestamp month for grouping if no section provided
      const section =
        upload.badge === "live" || upload.badge === "ended"
          ? "THIS WEEK"
          : "RECENT";
      if (!acc[section]) acc[section] = [];
      acc[section].push(upload);
      return acc;
    }, {} as Record<string, UserUpload[]>);
  }, [filteredUploads]);

  const eventsJoined = uploads.filter(
    (upload) => upload.badge === "live" || upload.badge === "ended"
  ).length;

  const openSlider = (uploadId: string) => {
    const index = filteredUploads.findIndex((item) => item.id === uploadId);
    setActiveIndex(index >= 0 ? index : 0);
    setIsSliderVisible(true);
  };

  const closeSlider = () => setIsSliderVisible(false);

  const goPrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? filteredUploads.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredUploads.length);
  };

  const currentUpload = filteredUploads[activeIndex] || filteredUploads[0];
  const sliderCaption =
    currentUpload?.caption || currentUpload?.location || "Shared snap";
  const sliderTimestamp = formatTimestamp(currentUpload?.timestamp);

  const renderBadge = (badge?: UserUpload["badge"]) => {
    if (!badge) return null;
    const label = badge === "live" ? "LIVE" : badge === "ended" ? "ENDED" : "FEATURED";
    const background =
      badge === "live"
        ? "#FFEDEE"
        : badge === "ended"
        ? "#1A1A1A"
        : "#FFF7E0";
    const color = badge === "ended" ? "#fff" : badge === "live" ? "#FF4D6D" : "#A87D2D";

    return (
      <View style={[myUploadsStyles.badge, { backgroundColor: background }]}>
        <Text style={[myUploadsStyles.badgeText, { color }]}>{label}</Text>
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

        <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
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
          <Text style={myUploadsStyles.statNumber}>{uploads.length}</Text>
          <Text style={myUploadsStyles.statLabel}>TOTAL PHOTOS</Text>
        </View>
        <View style={myUploadsStyles.statItem}>
          <Text style={myUploadsStyles.statNumber}>{eventsJoined}</Text>
          <Text style={myUploadsStyles.statLabel}>EVENTS JOINED</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={myUploadsStyles.filtersContainer}>
        {filterOptions.map((option) => {
          const isActive = selectedFilter === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                myUploadsStyles.filterButton,
                isActive && myUploadsStyles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(option.key)}
            >
              <Text
                style={[
                  myUploadsStyles.filterButtonText,
                  isActive && myUploadsStyles.filterButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Uploads */}
      <ScrollView style={myUploadsStyles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF6B8A" style={{ marginTop: 12 }} />
        ) : uploads.length === 0 ? (
          <Text style={myUploadsStyles.emptyState}>
            No uploads yet. Tap the camera to start sharing!
          </Text>
        ) : (
          Object.entries(groupedUploads).map(([section, items]) => (
            <View key={section} style={myUploadsStyles.section}>
              <View style={myUploadsStyles.sectionHeader}>
                <Text style={myUploadsStyles.sectionTitle}>{section}</Text>
                {section === "THIS WEEK" && items.length >= 3 && (
                  <View style={myUploadsStyles.newBadge}>
                    <Text style={myUploadsStyles.newBadgeText}>NEW</Text>
                  </View>
                )}
              </View>

              <View style={myUploadsStyles.uploadsGrid}>
                {items.map((upload) => (
                  <TouchableOpacity
                    key={upload.id}
                    style={myUploadsStyles.uploadCard}
                    activeOpacity={0.9}
                    onPress={() => openSlider(upload.id)}
                  >
                    <Image
                      source={{ uri: upload.uri }}
                      style={myUploadsStyles.uploadImage}
                    />
                    {renderBadge(upload.badge)}
                    <View style={myUploadsStyles.uploadInfo}>
                      <Text style={myUploadsStyles.uploadTimestamp}>
                        {formatTimestamp(upload.timestamp)}
                      </Text>
                      <View style={myUploadsStyles.uploadLocationContainer}>
                        <Ionicons name="location-outline" size={14} color="#FF4757" />
                        <Text style={myUploadsStyles.uploadLocation}>
                          {upload.location || "Shared snap"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Slider Modal */}
      <Modal
        visible={isSliderVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSlider}
      >
        <View style={myUploadsStyles.modalOverlay}>
          <View style={myUploadsStyles.sliderFrame}>
            <TouchableOpacity style={myUploadsStyles.closeButton} onPress={closeSlider}>
              <Ionicons name="close" size={22} color="#1A1A1A" />
            </TouchableOpacity>

            <View style={myUploadsStyles.sliderBody}>
              <TouchableOpacity
                style={[myUploadsStyles.navButton, myUploadsStyles.navButtonLeft]}
                onPress={goPrev}
              >
                <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
              </TouchableOpacity>

              <View style={myUploadsStyles.sliderImageWrapper}>
                {currentUpload ? (
                  <Image
                    source={{ uri: currentUpload.uri }}
                    style={myUploadsStyles.sliderImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={myUploadsStyles.sliderPlaceholder}>
                    <Text style={myUploadsStyles.emptyState}>No image</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[myUploadsStyles.navButton, myUploadsStyles.navButtonRight]}
                onPress={goNext}
              >
                <Ionicons name="chevron-forward" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <View style={myUploadsStyles.sliderMeta}>
              <Text style={myUploadsStyles.sliderCaption}>{sliderCaption}</Text>
              <Text style={myUploadsStyles.sliderTimestamp}>{sliderTimestamp}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyUploadsScreen;
