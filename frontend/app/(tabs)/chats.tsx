import { StyleSheet, Pressable, FlatList } from 'react-native';
import { ThemedText, ThemedView } from '@/components/Themed';
import { Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ChatsScreen() {
  const { colors } = useTheme();
  // Mock conversation list. In a real app, this would come from an API call.
  const conversations = [
    { id: '60d21b4667d0d8992e610c85', name: 'Jane Doe', lastMessage: 'See you then!' },
    { id: '60d21b4667d0d8992e610c86', name: 'John Smith', lastMessage: 'Sounds good.' },
    { id: '60d21b4667d0d8992e610c87', name: 'Alex Ray', lastMessage: 'Okay, I will check it out.' },
  ];

  const renderItem = ({ item }: { item: typeof conversations[0] }) => (
    <Link href={{ pathname: `/(chat)/${item.id}`, params: { name: item.name } }} asChild>
      <Pressable>
        <ThemedView style={[styles.chatItem, { borderBottomColor: colors.borderColor }]}>
            <ThemedText type="subtitle" style={styles.chatName}>{item.name}</ThemedText>
            <ThemedText style={{color: colors.icon}}>{item.lastMessage}</ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{width: '100%'}}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  chatName: {
    fontSize: 18,
    marginBottom: 4,
  }
});
