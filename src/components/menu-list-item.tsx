import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors, BrandFonts } from '@/constants/brand';
import { getMenuItemImageUrl } from '@/services/menu-api';
import { MenuItem } from '@/types/menu-item';

type MenuListItemProps = {
  item: MenuItem;
};

export function MenuListItem({ item }: MenuListItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <Image
        style={styles.image}
        source={{ uri: getMenuItemImageUrl(item.image) }}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.highlightWhite,
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontFamily: BrandFonts.body,
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.highlightBlack,
  },
  description: {
    fontFamily: BrandFonts.body,
    fontSize: 14,
    color: BrandColors.highlightBlack + '99',
  },
  price: {
    fontFamily: BrandFonts.body,
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.highlightBlack + 'CC',
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 8,
  },
});
