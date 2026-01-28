import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import RegisterUserStyle from "../styles/RegisterUserStyle";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { ScreenProps } from "../types";
import Constants from "expo-constants";
import LocationIcon from "../assets/icons/LocationIcon";
import PersonIcon from "../assets/icons/PersonIcon";
import Toast from "../components/Toast";

// Enum values - Gender from backend model
const GENDER_OPTIONS = ["male", "female", "others"];

// Year options - frontend enum
const YEAR_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "Graduate", "Other"];

// Use API base URL from environment variable
export const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

const styles = RegisterUserStyle;

const RegisterUserScreen = ({ navigation }: ScreenProps<"RegisterUserScreen">) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.fullName || user?.firstName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    collegeName: "",
    phoneNumber: user?.primaryPhoneNumber?.phoneNumber || "",
    year: "",
    gender: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [genderDropdownVisible, setGenderDropdownVisible] = useState(false);
  const [yearDropdownVisible, setYearDropdownVisible] = useState(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = "College name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly"
      );
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!user) {
        Alert.alert("Error", "User not authenticated. Please sign in again.");
        setIsSubmitting(false);
        return;
      }

      let token = await getToken();
      if (!token) {
        try {
          token = await getToken({ template: "default" });
        } catch {
          // ignore
        }
      }

      if (!token) {
        Alert.alert(
          "Error",
          "Authentication token not available. Please sign in again."
        );
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          collegeName: formData.collegeName.trim(),
          phoneNumber: formData.phoneNumber.trim() || undefined,
          year: formData.year.trim() || undefined,
          gender: formData.gender.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      if (user) {
        try {
          await user.reload();
        } catch {
          // continue even if reload fails
        }
      }

      setShowSuccessToast(true);
    } catch (error) {
      setShowErrorToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerWrapper}>
        <LocationIcon />
        <View style={styles.header}>
          <Text style={styles.title}>Join SnapMap</Text>
          <Text style={styles.subtitle}>
            Connect with your campus{"\n"}community and see what's{"\n"}trending nearby
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <PersonIcon />
          </View>
          <TextInput
            style={[
              styles.input,
              styles.inputWithLeftIcon,
              errors.name && styles.inputError,
            ]}
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            editable={!isSubmitting}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
            placeholder="College Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSubmitting}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, errors.collegeName && styles.inputError]}
            value={formData.collegeName}
            onChangeText={(value) => updateField("collegeName", value)}
            placeholder="College Name"
            placeholderTextColor="#9CA3AF"
            editable={!isSubmitting}
          />
          {errors.collegeName && (
            <Text style={styles.errorText}>{errors.collegeName}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Success toast */}
      <Toast
        visible={showSuccessToast}
        message="Registration completed successfully"
        success={true}
        onHide={() => {
          setShowSuccessToast(false);
          navigation.replace("CameraPermissionScreen");
        }}
      />

      {/* Error toast */}
      <Toast
        visible={showErrorToast}
        message="Registration failed"
        success={false}
        onHide={() => setShowErrorToast(false)}
      />

    </ScrollView>
  );
};

export default RegisterUserScreen;
