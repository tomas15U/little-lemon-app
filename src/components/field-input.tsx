import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { BrandColors, BrandFonts } from '@/constants/brand';

type FieldInputProps = TextInputProps & {
  label: string;
  error?: string | null;
};

export function FieldInput({ label, error, style, ...inputProps }: FieldInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={BrandColors.highlightBlack + '80'}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontFamily: BrandFonts.body,
    fontSize: 13,
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
  inputError: {
    borderColor: BrandColors.secondaryOrange,
  },
  error: {
    fontFamily: BrandFonts.body,
    fontSize: 12,
    color: BrandColors.secondaryOrange,
  },
});
