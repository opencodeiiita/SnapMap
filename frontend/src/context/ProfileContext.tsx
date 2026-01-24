import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";

/**
 * Profile type
 * (Keep this flexible because backend fields may grow)
 */
export type Profile = {
  name?: string;
  collegeName?: string;
  phoneNumber?: string;
  year?: string;
  profileImage?: string | null;
  bio?: string;
  [key: string]: any;
};

type ProfileContextType = {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);

  /**
   * Fallback logic:
   * If profile is null (first-time user),
   * populate minimal profile data from Clerk
   */
  useEffect(() => {
    if (!profile && user) {
      const email = user.emailAddresses?.[0]?.emailAddress;

      setProfile({
        name: user.fullName || "",
        profileImage:
          user.imageUrl ||
          (email
            ? `https://api.dicebear.com/7.x/initials/png?seed=${email}`
            : null),
      });
    }
  }, [user, profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
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
