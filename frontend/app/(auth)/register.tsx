import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedView, ThemedText, ThemedTextInput, ThemedButton } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
// import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  // const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !nickname || !email || !password) {
        Alert.alert('Error', 'Please fill all fields.');
        return;
    }
    setLoading(true);
    // const success = await register(username, nickname, email, password);
    const success = true; // Mock success
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Registration Failed', 'An error occurred.');
    }
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
      <ThemedTextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      <ThemedTextInput
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
        style={styles.input}
      />
      <ThemedTextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <ThemedTextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <ThemedButton
        title={loading ? 'Creating Account...' : 'Register'}
        onPress={handleRegister}
        disabled={loading}
        style={styles.button}
      />
      <View style={styles.linkContainer}>
        <ThemedText>Already have an account? </ThemedText>
        <Link href="/(auth)/login" asChild>
          <ThemedText type="link">Log In</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});
