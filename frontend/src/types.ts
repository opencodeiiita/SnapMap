import type { CameraCapturedPicture } from "expo-camera";
import type { LocationObject } from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type AppImage = {
  uri: string;
  width: number;
  height: number;
  format?: "jpg" | "jpeg" | "png"; // optional
  exif?: Record<string, any>;
};

export type RootParamList = {
  SplashScreen: undefined;
  SignInScreen: undefined;
  HomeScreen: undefined;
  CameraPermissionScreen: undefined;
  LocationPermissionScreen: undefined;
  CameraScreen: undefined;
  MapScreen: undefined;
  UploadConfirmationScreen:
    | { photo?: AppImage; location?: LocationObject | null }
    | undefined;
  BubbleDetailsScreen: undefined;
  EventGalleryScreen: undefined;
  MyUploadsScreen: undefined;
  ProfileScreen: undefined;
  SettingsScreen: undefined;
  ErrorScreen: undefined;
  RegisterUserScreen: undefined;
  CropScreen: 
    | { photo?: AppImage; location?: LocationObject | null }
    | undefined;
};

export type ScreenProps<T extends keyof RootParamList> = NativeStackScreenProps<
  RootParamList,
  T
>;
