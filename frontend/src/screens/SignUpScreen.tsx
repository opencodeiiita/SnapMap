import React, { useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import type { ScreenProps } from "../types";
import SignUpStyle from "../styles/SignUpStyle";

const styles = SignUpStyle;

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = ({ navigation }: ScreenProps<"SignUpScreen">) => {
  const { isLoaded } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignUpWithGoogle = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        // Navigation handled by useAuth() in Navigation.js
      }
    } catch (err) {
      console.error("Sign up error:", JSON.stringify(err, null, 2));
    }
  }, [isLoaded, startOAuthFlow]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join SnapMap today</Text>

      <TouchableOpacity style={styles.button} onPress={onSignUpWithGoogle}>
        <Text style={styles.buttonText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("SignInScreen")}
      >
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
