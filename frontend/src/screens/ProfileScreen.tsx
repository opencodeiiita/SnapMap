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

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

const styles = ProfileStyle;

const YEAR_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "Graduate", "Other"];

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

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    collegeName: "",
    phoneNumber: "",
    year: "",
    profileImage: null,
    bio: "Chasing sunsets & finals",
  });

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

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔧 FIXED PROFILE FETCH
  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();

      if (!token) {
        if (user) {
          setProfile({
            name: user.firstName || user.username || "User",
            collegeName: (user.publicMetadata?.collegeName as string) || "",
            phoneNumber: (user.publicMetadata?.phoneNumber as string) || "",
            year: (user.publicMetadata?.year as string) || "",
            profileImage: user.imageUrl || null,
            bio: "Chasing sunsets & finals",
          });
        }
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/auth/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const userData = data?.user;

      if (res.ok && userData) {
        setProfile({
          name: userData.name ?? "",
          collegeName: userData.collegeName ?? "",
          phoneNumber: userData.phoneNumber ?? "",
          year: userData.year ?? "",
          profileImage: userData.profileImage ?? null,
          bio: userData.bio ?? "Chasing sunsets & finals",
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
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
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Allow photo access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const filename = asset.uri.split("/").pop() || "profile.jpg";
      setSelectedImage({
        uri: asset.uri,
        name: filename,
        type: "image/jpeg",
      });
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) return;

      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("bio", editForm.bio);
      formData.append("collegeName", editForm.collegeName);
      formData.append("phoneNo", editForm.phoneNo);
      formData.append("year", editForm.year);

      if (selectedImage) {
        formData.append("profileImg", selectedImage as any);
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/auth/profile-update`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setProfile({
          name: data.user.name,
          bio: data.user.bio,
          collegeName: data.user.collegeName,
          phoneNumber: data.user.phoneNumber,
          year: data.user.year,
          profileImage: data.user.profileImage,
        });
        closeEditModal();
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B8A" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.userName}>{profile.name}</Text>
    </SafeAreaView>
  );
};

export default ProfileScreen;
