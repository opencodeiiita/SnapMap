import React, { createContext, useContext, useState } from "react";

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
  const [profile, setProfile] = useState<Profile | null>(null);

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
