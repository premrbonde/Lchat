import { StyleSheet, Image } from 'react-native';

import { ThemedText, ThemedView, ThemedButton } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder
        style={styles.avatar}
      />
      <ThemedText type="title">Jules Verne</ThemedText>
      <ThemedText type="subtitle" style={styles.username}>@jules</ThemedText>

      <ThemedView style={styles.separator} />

      <ThemedButton
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        onPress={toggleTheme}
      />

      {/* Add logout button later */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  username: {
    marginBottom: 20,
    color: '#687076',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee'
  },
});
