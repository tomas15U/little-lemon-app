import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import {
  clearUserSession,
  readOnboardingCompleted,
  readUserProfile,
  writeUserSession,
} from '@/services/user-session-storage';
import { DEFAULT_NOTIFICATION_PREFERENCES, UserProfile } from '@/types/user-profile';

type UserSessionContextValue = {
  isLoading: boolean;
  isOnboardingCompleted: boolean;
  profile: UserProfile | null;
  completeOnboarding: (details: { firstName: string; email: string }) => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  logOut: () => Promise<void>;
};

const UserSessionContext = createContext<UserSessionContextValue | undefined>(undefined);

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([readOnboardingCompleted(), readUserProfile()]).then(
      ([completed, storedProfile]) => {
        if (!isMounted) return;
        setIsOnboardingCompleted(completed && storedProfile !== null);
        setProfile(storedProfile);
        setIsLoading(false);
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<UserSessionContextValue>(
    () => ({
      isLoading,
      isOnboardingCompleted,
      profile,
      completeOnboarding: async ({ firstName, email }) => {
        const initialProfile: UserProfile = {
          firstName,
          lastName: '',
          email,
          phone: '',
          avatarUri: null,
          notifications: DEFAULT_NOTIFICATION_PREFERENCES,
        };
        await writeUserSession(initialProfile);
        setProfile(initialProfile);
        setIsOnboardingCompleted(true);
      },
      saveProfile: async (nextProfile: UserProfile) => {
        await writeUserSession(nextProfile);
        setProfile(nextProfile);
      },
      logOut: async () => {
        await clearUserSession();
        setProfile(null);
        setIsOnboardingCompleted(false);
      },
    }),
    [isLoading, isOnboardingCompleted, profile]
  );

  return <UserSessionContext.Provider value={value}>{children}</UserSessionContext.Provider>;
}

export function useUserSession(): UserSessionContextValue {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error('useUserSession must be used within a UserSessionProvider');
  }
  return context;
}
