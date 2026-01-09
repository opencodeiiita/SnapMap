import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
} from "react-native";
import RegisterUserStyle from "../styles/RegisterUserStyle";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { ScreenProps } from "../types";
import Constants from "expo-constants";

// Enum values - Gender from backend model
const GENDER_OPTIONS = ["male", "female", "others"];

// Year options - frontend enum
const YEAR_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "Graduate", "Other"];

// Use API base URL from environment variable
export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? "http://localhost:5000";

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
      Alert.alert("Validation Error", "Please fill in all required fields correctly");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log("inside try");
      // Check if user is authenticated
      if (!user) {
        Alert.alert("Error", "User not authenticated. Please sign in again.");
        setIsSubmitting(false);
        return;
      }
      console.log("before get token");

      // Get the JWT token from Clerk
      // Try without template first, then with template if needed
      let token = await getToken();
      console.log("after get token ", token);
      
      // If token is null, try with explicit options
      if (!token) {
        try {
          token = await getToken({ template: "default" });
        } catch (templateError) {
          console.log("Template token failed, trying without template");
        }
      }
      console.log("after !token ", token);

      if (!token) {
        Alert.alert("Error", "Authentication token not available. Please sign in again.");
        setIsSubmitting(false);
        return;
      }

      console.log("after !!token ", token);


      console.log(`Sending POST : ` + `${API_BASE_URL}/api/v1/auth/signup`);
      console.log(`Bearer ${token}`);
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

      
      let data;
      try {
        const text = await response.text();
        data = text
        // data = text ? JSON.parse(text) : {};
      } 
      catch (parseError) {
        console.error("Failed to parse response:", parseError);
        data = { message: "Failed to parse server response" };
      }
      
      console.log("Response data:", data);

      if (!response.ok) {
        const errorMessage = data.message || `Registration failed with status ${response.status} ${data}`;
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);
      }

      // Reload user to get updated metadata from backend
      if (user) {
        try {
          await user.reload();
        } catch (err) {
          console.error("Failed to reload user:", err);
          // Continue anyway since backend registration succeeded
        }
      }

      Alert.alert("Success", "Registration completed successfully!", [
        {
          text: "OK",
          onPress: () => navigation.replace("HomeScreen"),
        },
      ]);
    } 
    catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        error.message || "An error occurred during registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Registration</Text>
        <Text style={styles.subtitle}>Please fill in your details to continue</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            editable={!isSubmitting}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSubmitting}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            College Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.collegeName && styles.inputError]}
            value={formData.collegeName}
            onChangeText={(value) => updateField("collegeName", value)}
            placeholder="Enter your college name"
            placeholderTextColor="#999"
            editable={!isSubmitting}
          />
          {errors.collegeName && (
            <Text style={styles.errorText}>{errors.collegeName}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => !isSubmitting && setGenderDropdownVisible(true)}
            disabled={isSubmitting}
          >
            <Text style={[styles.dropdownText, !formData.gender && styles.dropdownPlaceholder]}>
              {formData.gender || "Select your gender"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          <Modal
            visible={genderDropdownVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setGenderDropdownVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setGenderDropdownVisible(false)}
            >
              <View style={styles.dropdownModal}>
                {GENDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      formData.gender === option && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => {
                      updateField("gender", option);
                      setGenderDropdownVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        formData.gender === option && styles.dropdownOptionTextSelected,
                      ]}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                    {formData.gender === option && (
                      <Ionicons name="checkmark" size={20} color="#FF4444" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(value) => updateField("phoneNumber", value)}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Year</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => !isSubmitting && setYearDropdownVisible(true)}
            disabled={isSubmitting}
          >
            <Text style={[styles.dropdownText, !formData.year && styles.dropdownPlaceholder]}>
              {formData.year || "Select your year"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
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
              <View style={styles.dropdownModal}>
                {YEAR_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      formData.year === option && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => {
                      updateField("year", option);
                      setYearDropdownVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        formData.year === option && styles.dropdownOptionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                    {formData.year === option && (
                      <Ionicons name="checkmark" size={20} color="#FF4444" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Complete Registration</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterUserScreen;
