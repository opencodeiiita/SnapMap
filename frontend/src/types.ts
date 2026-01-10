import type { CameraCapturedPicture } from "expo-camera";
import type { LocationObject } from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootParamList = {
  SplashScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  HomeScreen: undefined;
  CameraPermissionScreen: undefined;
  LocationPermissionScreen: undefined;
  CameraScreen: undefined;
  MapScreen: undefined;
  UploadConfirmationScreen:
    | { photo?: CameraCapturedPicture; location?: LocationObject | null }
    | undefined;
  BubbleDetailsScreen: undefined;
  EventGalleryScreen: undefined;
  MyUploadsScreen: undefined;
  ProfileScreen: undefined;
  SettingsScreen: undefined;
  ErrorScreen: undefined;
  RegisterUserScreen: undefined;
};

export type ScreenProps<T extends keyof RootParamList> = NativeStackScreenProps<
  RootParamList,
  T
>;
