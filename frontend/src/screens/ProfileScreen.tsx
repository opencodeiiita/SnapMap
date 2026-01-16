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

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

const styles = ProfileStyle;

// Year options - same as RegisterUserScreen
const YEAR_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "Graduate", "Other"];

// Mock data for gallery images
const mockGalleryImages = [
  { id: "1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300" },
  { id: "2", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300" },
  { id: "3", url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300" },
  { id: "4", url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300" },
  { id: "5", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300" },
  { id: "6", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300" },
  { id: "7", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300" },
  { id: "8", url: "https://images.unsplash.com/photo-1518173946687-a4c036bc3c95?w=300" },
  { id: "9", url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300" },
];

interface UserProfile {
  name: string;
  collegeName: string;
  phoneNumber: string;
  year: string;
  profileImage: string | null;
  bio?: string;
}

const ProfileScreen = ({ navigation }: ScreenProps<"ProfileScreen">) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile data (GLOBAL via context)
  const { profile, setProfile } = useProfile();

  // Edit form data
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    collegeName: "",
    phoneNo: "",
    year: "",
  });

  // Selected image for upload
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);

  // Year dropdown visibility
  const [yearDropdownVisible, setYearDropdownVisible] = useState(false);

  // Stats (mock data for now)
  const stats = {
    snaps: 124,
    views: "14.5k",
    impact: "Top 5%",
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();

      if (!token) {
        // Fall back to Clerk user data if not authenticated
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rawText = await response.text();

      if (!response.ok) {
        throw new Error(rawText);
      }

      const data = JSON.parse(rawText);

      if (response.ok && data.user) {
        setProfile({
          name: data.user.name || "",
          collegeName: data.user.collegeName || "",
          phoneNumber: data.user.phoneNumber || "",
          year: data.user.year || "",
          profileImage: data.user.profileImage || null,
          bio: data.user.bio || "Chasing sunsets & finals",
        });
      } else {
        // Fall back to Clerk user data
        if (user) {
          setProfile((prev) => ({
            ...prev,
            name: user.firstName || user.username || "User",
            profileImage: user.imageUrl || null,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fall back to Clerk user data on error
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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please allow access to your photo library.");
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

      setSelectedImage({
        uri,
        type,
        name: filename,
      });
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

      if (editForm.name !== profile.name) {
        formData.append("name", editForm.name);
      }
      if (editForm.bio !== profile.bio) {
        formData.append("bio", editForm.bio);
      }
      if (editForm.collegeName !== profile.collegeName) {
        formData.append("collegeName", editForm.collegeName);
      }
      if (editForm.phoneNo !== profile.phoneNumber) {
        formData.append("phoneNo", editForm.phoneNo);
      }
      if (editForm.year !== profile.year) {
        formData.append("year", editForm.year);
      }

      if (selectedImage) {
        formData.append("profileImg", {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.name,
        } as any);
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const rawText = await response.text();

      let data: any = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }

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
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsPress = () => {
    navigation.navigate("SettingsScreen");
  };

  // ✅ Safety guard added
  if (isLoading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B8A" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Header with Settings */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Image */}
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
            <TouchableOpacity style={styles.editImageButton} onPress={openEditModal}>
              <Ionicons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Name and College */}
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.collegeName}>{profile.collegeName}</Text>
          </View>

          {/* Bio */}
          <Text style={styles.bio}>{profile.bio}</Text>
          <Text style={styles.bioSubtext}>Design Major • Photo Club Pres</Text>

          {/* Class Badge */}
          <View style={styles.classBadge}>
            <Text style={styles.classBadgeText}>{profile.year ? `${profile.year} Year` : "Year not set"}</Text>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.editProfileButton} onPress={openEditModal}>
            <Ionicons name="pencil-outline" size={18} color="#1A1A1A" />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
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
            <Text style={[styles.statNumber, styles.statHighlight]}>{stats.impact}</Text>
            <Text style={styles.statLabel}>IMPACT</Text>
          </View>
        </View>

        {/* Gallery Grid */}
        <View style={styles.galleryContainer}>
          <View style={styles.galleryGrid}>
            {mockGalleryImages.map((image) => (
              <TouchableOpacity key={image.id} style={styles.galleryImageContainer}>
                <Image
                  source={{ uri: image.url }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeEditModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
            {/* Profile Image Picker */}
            <TouchableOpacity
              style={[styles.profileImageContainer, { alignSelf: "center", marginBottom: 24 }]}
              onPress={pickImage}
            >
              {selectedImage ? (
                <Image source={{ uri: selectedImage.uri }} style={styles.profileImage} />
              ) : profile.profileImage ? (
                <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={50} color="#FF6B8A" />
                </View>
              )}
              <View style={styles.editImageButton}>
                <Ionicons name="camera" size={18} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.name}
                onChangeText={(text) => setEditForm((prev) => ({ ...prev, name: text }))}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />
            </View>

            {/* Bio Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, { height: 80, textAlignVertical: "top" }]}
                value={editForm.bio}
                onChangeText={(text) => setEditForm((prev) => ({ ...prev, bio: text }))}
                placeholder="Write something about yourself"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* College Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>College Name</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.collegeName}
                onChangeText={(text) => setEditForm((prev) => ({ ...prev, collegeName: text }))}
                placeholder="Enter college name"
                placeholderTextColor="#999"
              />
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.phoneNo}
                onChangeText={(text) => setEditForm((prev) => ({ ...prev, phoneNo: text }))}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            {/* Year Input */}
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

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
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

      {/* Year Dropdown Modal */}
      <Modal
        visible={yearDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setYearDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setYearDropdownVisible(false)}
        >
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 8,
            width: "80%",
            maxHeight: 300,
          }}>
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
                    setEditForm((prev) => ({ ...prev, year: option }));
                    setYearDropdownVisible(false);
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: editForm.year === option ? "#FF6B8A" : "#333",
                  }}>
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
    </SafeAreaView>
  );
};

export default ProfileScreen;
