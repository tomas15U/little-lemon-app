import { Image } from 'expo-image';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandColors, BrandFonts } from '@/constants/brand';
import { getMenuItemImageUrl } from '@/services/menu-api';

type HeroBannerProps = {
  searchText: string;
  onSearchTextChange: (text: string) => void;
};

export function HeroBanner({ searchText, onSearchTextChange }: HeroBannerProps) {
  return (
    <View style={styles.banner}>
      <View style={styles.row}>
        <View style={styles.textColumn}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.subtitle}>Chicago</Text>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served
            with a modern twist.
          </Text>
        </View>
        <Image
          style={styles.image}
          source={{ uri: getMenuItemImageUrl('grilledFish.jpg') }}
          contentFit="cover"
        />
      </View>
      <TextInput
        style={styles.search}
        value={searchText}
        onChangeText={onSearchTextChange}
        placeholder="Search"
        placeholderTextColor={BrandColors.highlightBlack + '80'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: BrandColors.primaryGreen,
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  textColumn: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  title: {
    fontFamily: BrandFonts.headline,
    fontSize: 40,
    color: BrandColors.primaryYellow,
  },
  subtitle: {
    fontFamily: BrandFonts.headline,
    fontSize: 24,
    color: BrandColors.white,
  },
  description: {
    fontFamily: BrandFonts.body,
    fontSize: 14,
    color: BrandColors.white,
    marginTop: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  search: {
    fontFamily: BrandFonts.body,
    fontSize: 16,
    backgroundColor: BrandColors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
