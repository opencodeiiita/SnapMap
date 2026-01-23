import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ScreenProps } from "../types";
import SnapStyle from "../styles/SnapStyle";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNavigation from "../navigation/BottomNavigation";

const styles = SnapStyle;

// Mock data for Live Snaps
const LIVE_SNAPS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=300&q=80', time: '2m', user: '@jake_m', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '2', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80', time: '5m', user: '@alex_c', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { id: '3', image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=300&q=80', time: '12m', user: '@art_lvr', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: '4', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=300&q=80', time: '2m', user: '@jake_m', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '5', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=300&q=80', time: '5m', user: '@alex_c', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { id: '6', image: 'https://images.unsplash.com/photo-1549416876-b9b596e05ed0?auto=format&fit=crop&w=300&q=80', time: '12m', user: '@art_lvr', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

// ... imports kept (React, View, etc)
// Note: This replacement assumes the standard imports are present at the top or will be preserved if I target inner content.
// Since I am replacing the whole function body essentially, I will include imports just to be safe if I wanted to replace the whole file,
// but the tool asks for replacement chunks. I'll replace the COMPONENT BODY.

export default function SnapScreen({
  navigation,
  route,
}: ScreenProps<"SnapScreen">) {
  const { imageURL, caption, latitude, longitude } = route.params || {};
  
  // Normalize images to array
  const images = Array.isArray(imageURL) ? imageURL : (imageURL ? [imageURL] : []);
  // If no images, use a mock fallback
  if (images.length === 0) {
    images.push("https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80");
  }

  const [isLiked, setIsLiked] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Snap Details</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Feather name="more-horizontal" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Images Horizontal Scroll (Like UploadConfirmation) */}
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            style={{ height: 400, marginTop: 10 }}
          >
            {images.map((img, idx) => (
              <View key={idx} style={styles.imageCard}>
                <Image source={{ uri: img }} style={styles.mainImage} />
                
                {/* Location Badge Overlay */}
                <View style={styles.locationBadge}>
                  <Ionicons name="location-sharp" size={12} color="#fff" />
                  <Text style={styles.locationText}>
                     {/* Display formatted location or simple lat/long if we don't have geocoding */}
                     {latitude && longitude 
                       ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
                       : "Student Union • West Wing"}
                  </Text>
                </View>

                {/* Pagination Badge if multiple */}
                {images.length > 1 && (
                  <View style={styles.paginationBadge}>
                    <Text style={styles.paginationText}>{idx + 1}/{images.length}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Info Container */}
          <View style={styles.infoContainer}>
            {/* Title/Caption */}
             <View style={styles.captionBox}>
               <Text style={styles.titleText}>
                 {caption || "No caption provided"}
               </Text>
               <Text style={styles.locationSubtitle}>
                  {/* Additional context or date could go here */}
                  Posted just now
               </Text>
            </View>

            {/* Social Actions */}
            <View style={styles.socialActions}>
              <TouchableOpacity 
                style={styles.socialItem}
                onPress={() => setIsLiked(!isLiked)}
              >
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={28} 
                  color={isLiked ? "#EF4444" : "#1F2937"} 
                />
                <Text style={styles.socialText}>208</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialItem}>
                <Ionicons name="chatbubble-outline" size={26} color="#1F2937" />
                <Text style={styles.socialText}>12</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialItem}>
                <Feather name="send" size={26} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Live Snaps Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Snaps</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.liveSnapsGrid}>
            {LIVE_SNAPS.map((snap) => (
              <View key={snap.id} style={styles.liveSnapCard}>
                <Image source={{ uri: snap.image }} style={styles.liveSnapImage} />
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{snap.time}</Text>
                </View>
                <View style={styles.userBadge}>
                  <Image source={{ uri: snap.avatar }} style={styles.userAvatarSmall} />
                  <Text style={styles.userHandle}>{snap.user}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <BottomNavigation />
      </SafeAreaView>
    </View>
  );
};
