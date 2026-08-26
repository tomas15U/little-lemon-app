import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors, BrandFonts } from '@/constants/brand';

type AvatarProps = {
  uri: string | null;
  firstName: string;
  lastName: string;
  size: number;
};

export function Avatar({ uri, firstName, lastName, size }: AvatarProps) {
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={dimensionStyle} contentFit="cover" />;
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <View style={[styles.placeholder, dimensionStyle]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: BrandColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: BrandFonts.body,
    color: BrandColors.white,
    fontWeight: '600',
  },
});
