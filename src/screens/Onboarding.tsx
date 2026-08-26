import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors, BrandFonts } from '@/constants/brand';
import { useUserSession } from '@/context/user-session-context';
import { isValidEmail, isValidName } from '@/utils/validation';

export default function Onboarding() {
  const { completeOnboarding } = useUserSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const nameValid = useMemo(() => isValidName(name), [name]);
  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const canSubmit = nameValid && emailValid;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('@/assets/images/little-lemon-logo.png')}
            contentFit="contain"
          />
        </View>

        <View style={styles.banner}>
          <Text style={styles.title}>Let us get to know you</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.field}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="John"
              placeholderTextColor={BrandColors.highlightBlack + '80'}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              placeholderTextColor={BrandColors.highlightBlack + '80'}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            disabled={!canSubmit}
            onPress={() => completeOnboarding({ firstName: name.trim(), email: email.trim() })}
            style={[styles.button, !canSubmit && styles.buttonDisabled]}>
            <Text style={[styles.buttonText, !canSubmit && styles.buttonTextDisabled]}>
              Next
            </Text>
          </Pressable>
        </View>
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
    backgroundColor: BrandColors.white,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 40,
  },
  banner: {
    backgroundColor: BrandColors.primaryGreen,
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: BrandFonts.headline,
    fontSize: 24,
    color: BrandColors.white,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
    gap: 32,
  },
  field: {
    gap: 8,
  },
  label: {
    fontFamily: BrandFonts.body,
    fontSize: 16,
    color: BrandColors.primaryGreen,
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
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: BrandColors.primaryGreen,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: BrandColors.highlightWhite,
  },
  buttonText: {
    fontFamily: BrandFonts.body,
    fontSize: 16,
    color: BrandColors.white,
  },
  buttonTextDisabled: {
    color: BrandColors.highlightBlack + '80',
  },
});
