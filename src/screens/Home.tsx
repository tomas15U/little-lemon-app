import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { CategoryList } from '@/components/category-list';
import { HeroBanner } from '@/components/hero-banner';
import { MenuListItem } from '@/components/menu-list-item';
import { BrandColors, BrandFonts } from '@/constants/brand';
import { useUserSession } from '@/context/user-session-context';
import { useMenu } from '@/hooks/use-menu';

export default function Home() {
  const { profile } = useUserSession();
  const {
    menu,
    categories,
    selectedCategories,
    toggleCategory,
    searchText,
    setSearchText,
    isLoading,
  } = useMenu();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Image
          style={styles.headerLogo}
          source={require('@/assets/images/little-lemon-logo.png')}
          contentFit="contain"
        />
        <Pressable onPress={() => router.push('/profile')}>
          <Avatar
            uri={profile?.avatarUri ?? null}
            firstName={profile?.firstName ?? ''}
            lastName={profile?.lastName ?? ''}
            size={36}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={BrandColors.primaryGreen} />
        </View>
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <MenuListItem item={item} />}
          ListHeaderComponent={
            <>
              <HeroBanner searchText={searchText} onSearchTextChange={setSearchText} />
              <Text style={styles.sectionTitle}>Order for delivery!</Text>
              <CategoryList
                categories={categories}
                selectedCategories={selectedCategories}
                onToggle={toggleCategory}
              />
            </>
          }
        />
      )}
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
  headerSpacer: {
    width: 36,
  },
  headerLogo: {
    width: 140,
    height: 32,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: BrandFonts.body,
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.highlightBlack,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
});
