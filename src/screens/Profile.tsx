import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors, BrandFonts } from '@/constants/brand';

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Página de perfil</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: BrandFonts.body,
    fontSize: 18,
    color: BrandColors.primaryGreen,
  },
});
