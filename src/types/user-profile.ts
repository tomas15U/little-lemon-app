export type NotificationPreferences = {
  orderStatuses: boolean;
  passwordChanges: boolean;
  specialOffers: boolean;
  newsletter: boolean;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUri: string | null;
  notifications: NotificationPreferences;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  orderStatuses: true,
  passwordChanges: true,
  specialOffers: true,
  newsletter: true,
};
