import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { MenuListItem } from '@/components/menu-list-item';
import { BrandColors } from '@/constants/brand';
import { useUserSession } from '@/context/user-session-context';
import { useMenu } from '@/hooks/use-menu';

export default function Home() {
  const { profile } = useUserSession();
  const { menu, isLoading } = useMenu();

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
          contentContainerStyle={styles.list}
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
  list: {
    paddingHorizontal: 16,
  },
});
