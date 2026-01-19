import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { CommonActions } from "@react-navigation/native";
import type { ScreenProps } from "../types";
import SettingsStyle from "../styles/SettingsStyle";

const styles = SettingsStyle;

const SettingsScreen = ({ navigation }: ScreenProps<"SettingsScreen">) => {
  const { signOut } = useAuth();
  const [locationVisibility, setLocationVisibility] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [eventAlerts, setEventAlerts] = useState(true);
  const [nearbyActivity, setNearbyActivity] = useState(true);
  const [uploadInteractions, setUploadInteractions] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const SettingItem = ({
    icon,
    label,
    rightComponent,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={24} color="#333" />
        <Text style={styles.settingItemText}>{label}</Text>
      </View>
      <View style={styles.settingItemRight}>
        {rightComponent}
        {onPress && <Ionicons name="chevron-forward" size={20} color="#999" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Ionicons name="person-circle-outline" size={24} color="#FF8C42" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="moon-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search settings"
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFILE Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFILE</Text>
          <View style={styles.card}>
            <SettingItem
              icon="create-outline"
              label="Edit Profile"
              onPress={() => navigation.navigate("ProfileScreen")}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="refresh-outline"
              label="Change Avatar"
              onPress={() => {
                // Navigate to change avatar
              }}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="school-outline"
              label="College Info"
              rightComponent={<Text style={styles.settingValue}>IIITV</Text>}
              onPress={() => {
                // Navigate to college info
              }}
            />
          </View>
        </View>

        {/* APPEARANCE Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPEARANCE</Text>
          <View style={styles.card}>
            <SettingItem
              icon="color-palette-outline"
              label="Theme"
              rightComponent={<Text style={styles.settingValue}>System</Text>}
              onPress={() => {
                // Navigate to theme settings
              }}
            />
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="grid-outline" size={24} color="#333" />
                <Text style={styles.settingItemText}>Compact Mode</Text>
              </View>
              <Switch
                value={compactMode}
                onValueChange={setCompactMode}
                trackColor={{ false: "#E0E0E0", true: "#FF4444" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* PRIVACY & SECURITY Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="eye-outline" size={24} color="#333" />
                <Text style={styles.settingItemText}>Location Visibility</Text>
              </View>
              <Switch
                value={locationVisibility}
                onValueChange={setLocationVisibility}
                trackColor={{ false: "#E0E0E0", true: "#FF4444" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <SettingItem
              icon="lock-closed-outline"
              label="Snap Visibility"
              rightComponent={<Text style={styles.settingValue}>Friends</Text>}
              onPress={() => {
                // Navigate to snap visibility settings
              }}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="ban-outline"
              label="Blocked Users"
              onPress={() => {
                // Navigate to blocked users
              }}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="shield-checkmark-outline"
              label="Two-step Verification"
              onPress={() => {
                // Navigate to two-step verification
              }}
            />
          </View>
        </View>

        {/* LOCATION Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCATION</Text>
          <View style={styles.card}>
            <SettingItem
              icon="compass-outline"
              label="Location Access"
              rightComponent={<Text style={styles.settingValue}>While Using</Text>}
              onPress={() => {
                // Navigate to location access settings
              }}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="business-outline"
              label="Campus Selection"
              rightComponent={<Text style={styles.settingValue}>IIITV</Text>}
              onPress={() => {
                // Navigate to campus selection
              }}
            />
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="location-outline" size={24} color="#333" />
                <Text style={styles.settingItemText}>Manual Override</Text>
              </View>
              <Switch
                value={manualOverride}
                onValueChange={setManualOverride}
                trackColor={{ false: "#E0E0E0", true: "#FF4444" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* NOTIFICATIONS Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="sparkles-outline" size={24} color="#333" />
                <Text style={styles.settingItemText}>Event Alerts</Text>
              </View>
              <Switch
                value={eventAlerts}
                onValueChange={setEventAlerts}
                trackColor={{ false: "#E0E0E0", true: "#FF4444" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="navigate-circle-outline" size={24} color="#333" />
                <Text style={styles.settingItemText}>Nearby Activity</Text>
              </View>
              <Switch
                value={nearbyActivity}
                onValueChange={setNearbyActivity}
                trackColor={{ false: "#E0E0E0", true: "#FF4444" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="heart-outline" size={24} color="#333" />
                <Text style={styles.settingItemText}>Upload Interactions</Text>
              </View>
              <Switch
                value={uploadInteractions}
                onValueChange={setUploadInteractions}
                trackColor={{ false: "#E0E0E0", true: "#FF4444" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="notifications-outline" size={24} color="#333" />
                <Text style={styles.settingItemText}>Push Notifications</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#E0E0E0", true: "#FF4444" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* APP & SUPPORT Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP & SUPPORT</Text>
          <View style={styles.card}>
            <SettingItem
              icon="help-circle-outline"
              label="Help Center"
              onPress={() => {
                // Navigate to help center
              }}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="document-text-outline"
              label="Terms & Privacy"
              onPress={() => {
                // Navigate to terms & privacy
              }}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="information-circle-outline"
              label="About SnapMap"
              onPress={() => {
                // Navigate to about
              }}
            />
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="phone-portrait-outline" size={24} color="#333" />
                <Text style={styles.settingItemText}>App Version</Text>
              </View>
              <Text style={styles.settingValue}>v2.4.0 (Build 184)</Text>
            </View>
          </View>
        </View>

        {/* Log Out Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert(
                "Log Out",
                "Are you sure you want to log out?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await signOut();
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{ name: "SplashScreen" }],
                          })
                        );
                      } catch (error) {
                        console.error("Logout failed:", error);
                        Alert.alert("Error", "Failed to log out. Please try again.");
                      }
                    },
                  },
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
