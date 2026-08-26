import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors, BrandFonts } from '@/constants/brand';

type CheckboxRowProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export function CheckboxRow({ label, checked, onToggle }: CheckboxRowProps) {
  return (
    <Pressable style={styles.row} onPress={onToggle}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: BrandColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: BrandColors.primaryGreen,
  },
  checkmark: {
    color: BrandColors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    fontFamily: BrandFonts.body,
    fontSize: 15,
    color: BrandColors.highlightBlack,
  },
});
