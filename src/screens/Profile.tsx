import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { CheckboxRow } from '@/components/checkbox-row';
import { FieldInput } from '@/components/field-input';
import { BrandColors, BrandFonts } from '@/constants/brand';
import { useUserSession } from '@/context/user-session-context';
import {
  EMPTY_USER_PROFILE,
  NotificationPreferences,
  UserProfile,
} from '@/types/user-profile';
import { formatUSPhone, isValidUSPhone } from '@/utils/phone';
import { isValidEmail, isValidName, isValidOptionalName } from '@/utils/validation';

const NOTIFICATION_OPTIONS: { key: keyof NotificationPreferences; label: string }[] = [
  { key: 'orderStatuses', label: 'Order statuses' },
  { key: 'passwordChanges', label: 'Password changes' },
  { key: 'specialOffers', label: 'Special offers' },
  { key: 'newsletter', label: 'Newsletter' },
];

export default function Profile() {
  const { profile, saveProfile, logOut } = useUserSession();
  const [draft, setDraft] = useState<UserProfile>(profile ?? EMPTY_USER_PROFILE);

  useEffect(() => {
    if (profile) setDraft(profile);
  }, [profile]);

  const errors = useMemo(
    () => ({
      firstName: isValidName(draft.firstName) ? null : 'Enter a valid first name.',
      lastName: isValidOptionalName(draft.lastName) ? null : 'Enter a valid last name.',
      email: isValidEmail(draft.email) ? null : 'Enter a valid email address.',
      phone:
        draft.phone.length === 0 || isValidUSPhone(draft.phone)
          ? null
          : 'Enter a valid US phone number.',
    }),
    [draft]
  );

  const isDirty = useMemo(
    () => (profile ? JSON.stringify(profile) !== JSON.stringify(draft) : false),
    [profile, draft]
  );
  const canSave = isDirty && Object.values(errors).every((error) => error === null);

  async function handleChangeAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setDraft((current) => ({ ...current, avatarUri: result.assets[0].uri }));
    }
  }

  function handleRemoveAvatar() {
    setDraft((current) => ({ ...current, avatarUri: null }));
  }

  function toggleNotification(key: keyof NotificationPreferences) {
    setDraft((current) => ({
      ...current,
      notifications: { ...current.notifications, [key]: !current.notifications[key] },
    }));
  }

  function handleDiscard() {
    if (profile) setDraft(profile);
  }

  function handleSave() {
    if (!canSave) return;
    saveProfile({
      ...draft,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
    });
  }

  const saved = profile ?? draft;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable disabled style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Image
          style={styles.headerLogo}
          source={require('@/assets/images/little-lemon-logo.png')}
          contentFit="contain"
        />
        <Avatar
          uri={saved.avatarUri}
          firstName={saved.firstName}
          lastName={saved.lastName}
          size={36}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Personal information</Text>

            <View style={styles.avatarSection}>
              <Text style={styles.label}>Avatar</Text>
              <View style={styles.avatarRow}>
                <Avatar
                  uri={draft.avatarUri}
                  firstName={draft.firstName}
                  lastName={draft.lastName}
                  size={64}
                />
                <Pressable style={styles.changeButton} onPress={handleChangeAvatar}>
                  <Text style={styles.changeButtonText}>Change</Text>
                </Pressable>
                <Pressable
                  style={styles.removeButton}
                  onPress={handleRemoveAvatar}
                  disabled={!draft.avatarUri}>
                  <Text
                    style={[
                      styles.removeButtonText,
                      !draft.avatarUri && styles.removeButtonTextDisabled,
                    ]}>
                    Remove
                  </Text>
                </Pressable>
              </View>
            </View>

            <FieldInput
              label="First name"
              value={draft.firstName}
              error={errors.firstName}
              onChangeText={(text) => setDraft((current) => ({ ...current, firstName: text }))}
              autoCapitalize="words"
              autoComplete="given-name"
            />

            <FieldInput
              label="Last name"
              value={draft.lastName}
              error={errors.lastName}
              onChangeText={(text) => setDraft((current) => ({ ...current, lastName: text }))}
              autoCapitalize="words"
              autoComplete="family-name"
            />

            <FieldInput
              label="Email"
              value={draft.email}
              error={errors.email}
              onChangeText={(text) => setDraft((current) => ({ ...current, email: text }))}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />

            <FieldInput
              label="Phone number"
              value={draft.phone}
              error={errors.phone}
              onChangeText={(text) =>
                setDraft((current) => ({ ...current, phone: formatUSPhone(text) }))
              }
              placeholder="(217) 555-0113"
              keyboardType="phone-pad"
              maxLength={14}
            />

            <Text style={styles.sectionTitle}>Email notifications</Text>
            {NOTIFICATION_OPTIONS.map((option) => (
              <CheckboxRow
                key={option.key}
                label={option.label}
                checked={draft.notifications[option.key]}
                onToggle={() => toggleNotification(option.key)}
              />
            ))}

            <Pressable style={styles.logoutButton} onPress={logOut}>
              <Text style={styles.logoutButtonText}>Log out</Text>
            </Pressable>

            <View style={styles.saveRow}>
              <Pressable
                style={[styles.discardButton, !isDirty && styles.buttonDisabled]}
                onPress={handleDiscard}
                disabled={!isDirty}>
                <Text
                  style={[styles.discardButtonText, !isDirty && styles.discardButtonTextDisabled]}>
                  Discard changes
                </Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!canSave}>
                <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
                  Save changes
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.highlightWhite,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: BrandColors.highlightBlack + '60',
  },
  headerLogo: {
    width: 140,
    height: 32,
  },
  content: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: BrandColors.highlightWhite,
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  title: {
    fontFamily: BrandFonts.headline,
    fontSize: 24,
    color: BrandColors.primaryGreen,
  },
  sectionTitle: {
    fontFamily: BrandFonts.headline,
    fontSize: 20,
    color: BrandColors.primaryGreen,
    marginTop: 8,
  },
  label: {
    fontFamily: BrandFonts.body,
    fontSize: 13,
    color: BrandColors.primaryGreen,
  },
  avatarSection: {
    gap: 6,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  changeButton: {
    backgroundColor: BrandColors.primaryGreen,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  changeButtonText: {
    fontFamily: BrandFonts.body,
    color: BrandColors.white,
    fontSize: 14,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: BrandColors.primaryGreen,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  removeButtonText: {
    fontFamily: BrandFonts.body,
    color: BrandColors.primaryGreen,
    fontSize: 14,
  },
  removeButtonTextDisabled: {
    color: BrandColors.highlightBlack + '40',
  },
  logoutButton: {
    backgroundColor: BrandColors.primaryYellow,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    fontFamily: BrandFonts.body,
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.highlightBlack,
  },
  saveRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  discardButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: BrandColors.primaryGreen,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  discardButtonText: {
    fontFamily: BrandFonts.body,
    fontSize: 15,
    color: BrandColors.primaryGreen,
  },
  discardButtonTextDisabled: {
    color: BrandColors.highlightBlack + '80',
  },
  saveButton: {
    flex: 1,
    backgroundColor: BrandColors.primaryGreen,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: BrandColors.highlightWhite,
  },
  saveButtonText: {
    fontFamily: BrandFonts.body,
    fontSize: 15,
    color: BrandColors.white,
  },
  saveButtonTextDisabled: {
    color: BrandColors.highlightBlack + '80',
  },
});
