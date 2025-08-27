import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText, ThemedView, ThemedTextInput } from '@/components/Themed';

export default function SearchScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Search Users</ThemedText>
      <ThemedTextInput
        placeholder="Search by username or nickname..."
        style={styles.searchBar}
      />
      {/* Search results will be displayed below */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  searchBar: {
    width: '90%',
    marginTop: 20,
  },
});
