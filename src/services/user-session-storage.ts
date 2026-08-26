import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserProfile } from '@/types/user-profile';

const ONBOARDING_COMPLETED_KEY = 'little-lemon:onboarding-completed';
const USER_PROFILE_KEY = 'little-lemon:user-profile';

export async function readOnboardingCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
  return value === 'true';
}

export async function readUserProfile(): Promise<UserProfile | null> {
  const value = await AsyncStorage.getItem(USER_PROFILE_KEY);
  return value ? JSON.parse(value) : null;
}

export async function writeUserSession(profile: UserProfile): Promise<void> {
  await AsyncStorage.multiSet([
    [ONBOARDING_COMPLETED_KEY, 'true'],
    [USER_PROFILE_KEY, JSON.stringify(profile)],
  ]);
}

export async function clearUserSession(): Promise<void> {
  await AsyncStorage.multiRemove([ONBOARDING_COMPLETED_KEY, USER_PROFILE_KEY]);
}
