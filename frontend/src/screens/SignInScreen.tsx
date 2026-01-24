import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSignIn, useOAuth, useAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import type { ScreenProps } from "../types";
import SignInStyle from "../styles/SignInStyle";
import { Ionicons } from "@expo/vector-icons";
import Toast from "../components/Toast";

const styles = SignInStyle;

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = ({ navigation }: ScreenProps<"SignInScreen">) => {
  const { isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const [loading, setLoading] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Redirect when signed in
  useEffect(() => {
    if (isSignedIn) {
      navigation.replace("HomeScreen");
    }
  }, [isSignedIn, navigation]);

  const onSignInWithGoogle = useCallback(async () => {
    if (!isLoaded || loading) return;

    try {
      setLoading(true);

      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        // navigation handled by useEffect
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, loading, startOAuthFlow]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name="location-outline" size={28} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>SnapMap</Text>

        <Text style={styles.subtitle}>
          See what's happening on campus
        </Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={onSignInWithGoogle}
          disabled={!isLoaded || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.googleButtonText}>
              Continue with Google
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Error toast */}
      <Toast
        visible={showErrorToast}
        message="Sign in failed. Please try again."
        success={false}
        onHide={() => setShowErrorToast(false)}
      />
    </View>
  );
};

export default SignInScreen;
