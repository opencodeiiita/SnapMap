import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { myUploadsStyles } from "../styles/MyUploadsStyle";
import { useProfile } from "../context/ProfileContext";
import {
  formatTimestamp,
  normalizeUserUploads,
  UserUpload,
} from "../utils/photoHelpers";
import Toast from "../components/Toast";

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
  const navigation = useNavigation<any>();
  const { profile } = useProfile();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("All");

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    success: boolean;
  }>({
    visible: false,
    message: "",
    success: true,
  });


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

  // ---------------- DELETE LOGIC ----------------

  const confirmDelete = (upload: UserUpload) => {
    Alert.alert("Delete photo?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDelete(upload),
      },
    ]);
  };

  const handleDelete = async (upload: UserUpload) => {
    try {
      const token = await getToken();

      const res = await fetch(`${API_BASE_URL}/api/v1/photos/deletePhoto`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: upload.uri }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setUploads((prev) => prev.filter((u) => u.uri !== upload.uri));

      if (filteredUploads.length <= 1) {
        setIsSliderVisible(false);
      }

      setToast({
        visible: true,
        message: "Photo deleted successfully",
        success: true,
      });
    } catch (err) {
      console.error("Delete failed:", err);

      setToast({
        visible: true,
        message: "Failed to delete photo",
        success: false,
      });
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
    return list;
  }, [uploads, selectedFilter]);

  const groupedUploads = useMemo(() => {
    return filteredUploads.reduce((acc, upload) => {
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

  // ---------------- SLIDER ----------------

  const openSlider = (uploadId: string) => {
    const index = filteredUploads.findIndex((item) => item.id === uploadId);
    setActiveIndex(index >= 0 ? index : 0);
    setIsSliderVisible(true);
  };

  const closeSlider = () => setIsSliderVisible(false);

  const goPrev = () => {
    if (filteredUploads.length <= 1) return;
    setActiveIndex((prev) =>
      prev === 0 ? filteredUploads.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    if (filteredUploads.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % filteredUploads.length);
  };


  const currentUpload = filteredUploads[activeIndex] || filteredUploads[0];
  const sliderCaption =
    currentUpload?.caption || currentUpload?.location || "Shared snap";
  const sliderTimestamp = formatTimestamp(currentUpload?.timestamp);

  const renderBadge = (badge?: UserUpload["badge"]) => {
    if (!badge) return null;
    const label =
      badge === "live" ? "LIVE" : badge === "ended" ? "ENDED" : "FEATURED";
    const background =
      badge === "live"
        ? "#FFEDEE"
        : badge === "ended"
          ? "#1A1A1A"
          : "#FFF7E0";
    const color =
      badge === "ended" ? "#fff" : badge === "live" ? "#FF4D6D" : "#A87D2D";

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
          <Text style={myUploadsStyles.subtitle}>
            Photos you've shared on campus
          </Text>
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
      <ScrollView
        style={myUploadsStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#FF6B8A"
            style={{ marginTop: 12 }}
          />
        ) : uploads.length === 0 ? (
          <Text style={myUploadsStyles.emptyState}>
            No uploads yet. Tap the camera to start sharing!
          </Text>
        ) : (
          Object.entries(groupedUploads).map(([section, items]) => (
            <View key={section} style={myUploadsStyles.section}>
              <View style={myUploadsStyles.sectionHeader}>
                <Text style={myUploadsStyles.sectionTitle}>{section}</Text>
              </View>

              <View style={myUploadsStyles.uploadsGrid}>
                {items.map((upload) => (
                  <View key={upload.id} style={myUploadsStyles.uploadCard}>
                    {/* DELETE BUTTON */}
                    <TouchableOpacity
                      style={myUploadsStyles.deleteBtn}
                      onPress={() => confirmDelete(upload)}
                    >
                      <Ionicons name="trash-outline" size={18} color="red" />
                    </TouchableOpacity>

                    {/* IMAGE PRESS OPENS SLIDER */}
                    <TouchableOpacity
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
                        <View
                          style={
                            myUploadsStyles.uploadLocationContainer
                          }
                        >
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color="#FF4757"
                          />
                          <Text style={myUploadsStyles.uploadLocation}>
                            {upload.location || "Shared snap"}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
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
            {/* DELETE FROM SLIDER */}
            <TouchableOpacity
              style={myUploadsStyles.sliderDeleteButton}
              onPress={() => currentUpload && confirmDelete(currentUpload)}
            >
              <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
            </TouchableOpacity>

            <TouchableOpacity
              style={myUploadsStyles.closeButton}
              onPress={closeSlider}
            >
              <Ionicons name="close" size={22} color="#1A1A1A" />
            </TouchableOpacity>

            <View style={myUploadsStyles.sliderBody}>
              <TouchableOpacity
                style={[
                  myUploadsStyles.navButton,
                  myUploadsStyles.navButtonLeft,
                ]}
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
                style={[
                  myUploadsStyles.navButton,
                  myUploadsStyles.navButtonRight,
                ]}
                onPress={goNext}
              >
                <Ionicons name="chevron-forward" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <View style={myUploadsStyles.sliderMeta}>
              <Text style={myUploadsStyles.sliderCaption}>
                {sliderCaption}
              </Text>
              <Text style={myUploadsStyles.sliderTimestamp}>
                {sliderTimestamp}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Toast
        visible={toast.visible}
        message={toast.message}
        success={toast.success}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

export default MyUploadsScreen;
