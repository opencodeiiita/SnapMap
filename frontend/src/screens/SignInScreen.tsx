import React, { useCallback, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSignIn, useOAuth, useAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import type { ScreenProps } from "../types";
import SignInStyle from "../styles/SignInStyle";

const styles = SignInStyle;

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = ({ navigation }: ScreenProps<"SignInScreen">) => {
  const { isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // Navigate to HomeScreen when signed in
  useEffect(() => {
    if (isSignedIn) {
      navigation.replace("HomeScreen");
    }
  }, [isSignedIn, navigation]);

  const onSignInWithGoogle = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        // Navigation will happen automatically via useEffect above
      }
    } catch (err) {
      console.error("Sign in error:", JSON.stringify(err, null, 2));
    }
  }, [isLoaded, startOAuthFlow]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SnapMap</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TouchableOpacity style={styles.button} onPress={onSignInWithGoogle}>
        <Text style={styles.buttonText}>Sign In with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("SignUpScreen")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;