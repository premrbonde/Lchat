import { StyleSheet } from 'react-native';

import { ThemedText, ThemedView } from '@/components/Themed';

export default function FriendsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Friends</ThemedText>
      <ThemedView style={styles.separator} />
      <ThemedText>Your friends and friend requests will appear here.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee'
  },
});
