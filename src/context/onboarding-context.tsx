import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { readOnboardingCompleted, writeOnboardingCompleted } from '@/services/onboarding-storage';

type OnboardingContextValue = {
  isLoading: boolean;
  isOnboardingCompleted: boolean;
  completeOnboarding: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    readOnboardingCompleted().then((completed) => {
      if (!isMounted) return;
      setIsOnboardingCompleted(completed);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      isLoading,
      isOnboardingCompleted,
      completeOnboarding: async () => {
        await writeOnboardingCompleted(true);
        setIsOnboardingCompleted(true);
      },
    }),
    [isLoading, isOnboardingCompleted]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
