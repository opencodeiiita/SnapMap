import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";

export interface UserProfile {
  name: string;
  collegeName: string;
  phoneNumber: string;
  year: string;
  profileImage: string | null;
  bio?: string;
}

interface ProfileContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    collegeName: "",
    phoneNumber: "",
    year: "",
    profileImage: null,
    bio: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      setIsLoading(true);

      // Initialize profile with Clerk data as fallback
      // This ensures new users have a profile image (defaulting to Clerk's user.imageUrl)
      const clerkImage = user.imageUrl;
      const metadata = user.publicMetadata;

      setProfile({
        name: user.fullName || user.firstName || user.username || "",
        collegeName: (metadata?.collegeName as string) || "",
        phoneNumber:
          (metadata?.phoneNumber as string) ||
          user.primaryPhoneNumber?.phoneNumber ||
          "",
        year: (metadata?.year as string) || "",
        // Priority: Custom upload -> Clerk default -> null
        profileImage: (metadata?.profileImage as string) || clerkImage || null,
        bio: (metadata?.bio as string) || "",
      });

      setIsLoading(false);
    }
  }, [user, isLoaded]);

  const refreshProfile = async () => {
    if (user) {
      setIsLoading(true);
      await user.reload();
      setIsLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, isLoading, refreshProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
