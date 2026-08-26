import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { CheckboxRow } from '@/components/checkbox-row';
import { BrandColors, BrandFonts } from '@/constants/brand';
import { useUserSession } from '@/context/user-session-context';
import { NotificationPreferences, UserProfile } from '@/types/user-profile';
import { formatUSPhone } from '@/utils/phone';

const NOTIFICATION_OPTIONS: { key: keyof NotificationPreferences; label: string }[] = [
  { key: 'orderStatuses', label: 'Order statuses' },
  { key: 'passwordChanges', label: 'Password changes' },
  { key: 'specialOffers', label: 'Special offers' },
  { key: 'newsletter', label: 'Newsletter' },
];

export default function Profile() {
  const { profile, saveProfile, logOut } = useUserSession();
  const [draft, setDraft] = useState<UserProfile>(profile as UserProfile);

  useEffect(() => {
    if (profile) setDraft(profile);
  }, [profile]);

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
    saveProfile(draft);
  }

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
        <Avatar uri={draft.avatarUri} firstName={draft.firstName} lastName={draft.lastName} size={36} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Personal information</Text>

        <Text style={styles.label}>Avatar</Text>
        <View style={styles.avatarRow}>
          <Avatar uri={draft.avatarUri} firstName={draft.firstName} lastName={draft.lastName} size={64} />
          <Pressable style={styles.changeButton} onPress={handleChangeAvatar}>
            <Text style={styles.changeButtonText}>Change</Text>
          </Pressable>
          <Pressable
            style={styles.removeButton}
            onPress={handleRemoveAvatar}
            disabled={!draft.avatarUri}>
            <Text
              style={[styles.removeButtonText, !draft.avatarUri && styles.removeButtonTextDisabled]}>
              Remove
            </Text>
          </Pressable>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            value={draft.firstName}
            onChangeText={(text) => setDraft((current) => ({ ...current, firstName: text }))}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            value={draft.lastName}
            onChangeText={(text) => setDraft((current) => ({ ...current, lastName: text }))}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={draft.email}
            onChangeText={(text) => setDraft((current) => ({ ...current, email: text }))}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={draft.phone}
            onChangeText={(text) =>
              setDraft((current) => ({ ...current, phone: formatUSPhone(text) }))
            }
            placeholder="(217) 555-0113"
            placeholderTextColor={BrandColors.highlightBlack + '80'}
            keyboardType="phone-pad"
            maxLength={14}
          />
        </View>

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
          <Pressable style={styles.discardButton} onPress={handleDiscard}>
            <Text style={styles.discardButtonText}>Discard changes</Text>
          </Pressable>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.white,
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
    padding: 24,
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
  field: {
    gap: 6,
  },
  input: {
    fontFamily: BrandFonts.body,
    fontSize: 16,
    color: BrandColors.highlightBlack,
    borderWidth: 1,
    borderColor: BrandColors.primaryGreen,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BrandColors.white,
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
  saveButton: {
    flex: 1,
    backgroundColor: BrandColors.primaryGreen,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: BrandFonts.body,
    fontSize: 15,
    color: BrandColors.white,
  },
});
