import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { BrandColors, BrandFonts } from '@/constants/brand';

type CategoryListProps = {
  categories: string[];
  selectedCategories: string[];
  onToggle: (category: string) => void;
};

export function CategoryList({ categories, selectedCategories, onToggle }: CategoryListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <Pressable
            key={category}
            onPress={() => onToggle(category)}
            style={[styles.pill, isSelected && styles.pillSelected]}>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  pill: {
    backgroundColor: BrandColors.highlightWhite,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillSelected: {
    backgroundColor: BrandColors.primaryGreen,
  },
  label: {
    fontFamily: BrandFonts.body,
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.highlightBlack,
  },
  labelSelected: {
    color: BrandColors.white,
  },
});
