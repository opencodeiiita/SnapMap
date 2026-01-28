import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import type { ScreenProps } from "../types";
import ProfileStyle from "../styles/ProfileStyle";
import { useProfile } from "../context/ProfileContext";
import Toast from "../components/Toast";

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

const styles = ProfileStyle;

const YEAR_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "Graduate", "Other"];

const ProfileScreen = ({ navigation }: ScreenProps<"ProfileScreen">) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [totalSnaps, setTotalSnaps] = useState<number>(0);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);

  const { profile, setProfile } = useProfile();

  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    collegeName: "",
    phoneNo: "",
    year: "",
  });

  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);

  const [yearDropdownVisible, setYearDropdownVisible] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    success: boolean;
  }>({
    visible: false,
    message: "",
    success: true,
  });

  const stats = {
    snaps: totalSnaps,
    views: "14.5k",
    impact: "Top 5%",
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
      fetchUserPhotos();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        if (user) {
          setProfile((prev) => ({
            ...prev,
            name: user.firstName || user.username || "User",
            collegeName: (user.publicMetadata?.collegeName as string) || "",
            phoneNumber: (user.publicMetadata?.phoneNumber as string) || "",
            year: (user.publicMetadata?.year as string) || "",
            profileImage: user.imageUrl || null,
          }));
        }
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/get-profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawText = await response.text();
      if (!response.ok) throw new Error(rawText);
      const data = JSON.parse(rawText);

      if (data.user) {
        setProfile({
          name: data.user.name || "",
          collegeName: data.user.collegeName || "",
          phoneNumber: data.user.phoneNumber || "",
          year: data.user.year || "",
          profileImage: data.user.profileImage || null,
          bio: data.user.bio || "Chasing sunsets & finals",
        });
      }
    } catch {
      if (user) {
        setProfile((prev) => ({
          ...prev,
          name: user.firstName || user.username || "User",
          profileImage: user.imageUrl || null,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPhotos = async () => {
    if (!user?.id) return;
    try {
      setIsGalleryLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/photos/get-user-photos/${user.id}`,
      );
      const rawData: (string | string[])[] = await response.json();
      const imageUrls: string[] = rawData.flatMap((u) =>
        Array.isArray(u) ? u : [u],
      );
      setGalleryImages(imageUrls);
      setTotalSnaps(imageUrls.length);
    } catch {
      setGalleryImages([]);
      setTotalSnaps(0);
    } finally {
      setIsGalleryLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      name: profile.name,
      bio: profile.bio || "",
      collegeName: profile.collegeName,
      phoneNo: profile.phoneNumber,
      year: profile.year,
    });
    setSelectedImage(null);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedImage(null);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /(\.(\w+))$/.exec(filename);
      const type = match ? `image/${match[2]}` : "image/jpeg";
      setSelectedImage({ uri, type, name: filename });
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication required. Please sign in again.");
        return;
      }

      const formData = new FormData();
      if (editForm.name !== profile.name)
        formData.append("name", editForm.name);
      if (editForm.bio !== profile.bio) formData.append("bio", editForm.bio);
      if (editForm.collegeName !== profile.collegeName)
        formData.append("collegeName", editForm.collegeName);
      if (editForm.phoneNo !== profile.phoneNumber)
        formData.append("phoneNo", editForm.phoneNo);
      if (editForm.year !== profile.year)
        formData.append("year", editForm.year);

      if (selectedImage) {
        formData.append("profileImg", {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.name,
        } as any);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/profile-update`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const rawText = await response.text();
      const data = rawText ? JSON.parse(rawText) : {};

      if (response.ok) {
        setProfile((prev) => ({
          ...prev,
          name: editForm.name || prev.name,
          bio: editForm.bio || prev.bio,
          collegeName: editForm.collegeName || prev.collegeName,
          phoneNumber: editForm.phoneNo || prev.phoneNumber,
          year: editForm.year || prev.year,
          profileImage: data.user?.profileImage || prev.profileImage,
        }));

        closeEditModal();
        setToast({
          visible: true,
          message: "Profile updated successfully",
          success: true,
        });
      } else {
        setToast({
          visible: true,
          message: "Failed to update profile",
          success: false,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewAllUploads = () => {
    navigation.navigate("MyUploadsScreen");
  };

  if (isLoading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B8A" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const handleSettingsPress = () => {
    navigation.navigate("SettingsScreen");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {profile.profileImage ? (
              <Image
                source={{ uri: profile.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={50} color="#FF6B8A" />
              </View>
            )}
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={openEditModal}
            >
              <Ionicons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.userName} numberOfLines={1}>
              {profile.name}
            </Text>
            <Text style={styles.separator}> | </Text>
            <Text style={styles.collegeName} numberOfLines={1}>
              {profile.collegeName}
            </Text>
          </View>

          <Text style={styles.bio}>{profile.bio}</Text>
          <Text style={styles.bioSubtext}>Design Major • Photo Club Pres</Text>

          <View style={styles.classBadge}>
            <Text style={styles.classBadgeText}>
              {profile.year ? `${profile.year} Year` : "Year not set"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={openEditModal}
          >
            <Ionicons name="pencil-outline" size={18} color="#1A1A1A" />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.snaps}</Text>
            <Text style={styles.statLabel}>SNAPS</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.views}</Text>
            <Text style={styles.statLabel}>VIEWS</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, styles.statHighlight]}>
              {stats.impact}
            </Text>
            <Text style={styles.statLabel}>IMPACT</Text>
          </View>
        </View>

        <View style={styles.galleryContainer}>
          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>Recent uploads</Text>
            {galleryImages.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={handleViewAllUploads}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#FF6B8A" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.galleryGrid}>
            {isGalleryLoading ? (
              <ActivityIndicator size="large" color="#FF6B8A" />
            ) : galleryImages.slice(0, 6).length ? (
              galleryImages.slice(0, 6).map((imageUrl, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.galleryImageContainer}
                  onPress={handleViewAllUploads}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyGalleryText}>
                No uploads yet. Start capturing memories!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeEditModal}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.profileImageContainer,
                  { alignSelf: "center", marginBottom: 24 },
                ]}
                onPress={pickImage}
              >
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.profileImage}
                  />
                ) : profile.profileImage ? (
                  <Image
                    source={{ uri: profile.profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Ionicons name="person" size={50} color="#FF6B8A" />
                  </View>
                )}
                <View style={styles.editImageButton}>
                  <Ionicons name="camera" size={18} color="#fff" />
                </View>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.name}
                  onChangeText={(t) => setEditForm((p) => ({ ...p, name: t }))}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { height: 80, textAlignVertical: "top" },
                  ]}
                  value={editForm.bio}
                  onChangeText={(t) => setEditForm((p) => ({ ...p, bio: t }))}
                  placeholder="Write something about yourself"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>College Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.collegeName}
                  onChangeText={(t) =>
                    setEditForm((p) => ({ ...p, collegeName: t }))
                  }
                  placeholder="Enter college name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.phoneNo}
                  onChangeText={(t) =>
                    setEditForm((p) => ({ ...p, phoneNo: t }))
                  }
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Year</Text>
                <TouchableOpacity
                  style={styles.textInput}
                  onPress={() => setYearDropdownVisible(true)}
                >
                  <Text style={{ color: editForm.year ? "#333" : "#999" }}>
                    {editForm.year || "Select Year"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isSaving && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={yearDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setYearDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setYearDropdownVisible(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 8,
              width: "80%",
              maxHeight: 300,
            }}
          >
            <ScrollView>
              {YEAR_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f0f0f0",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setEditForm((p) => ({ ...p, year: option }));
                    setYearDropdownVisible(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: editForm.year === option ? "#FF6B8A" : "#333",
                    }}
                  >
                    {option}
                  </Text>
                  {editForm.year === option && (
                    <Ionicons name="checkmark" size={20} color="#FF6B8A" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        success={toast.success}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
};
export default ProfileScreen;
