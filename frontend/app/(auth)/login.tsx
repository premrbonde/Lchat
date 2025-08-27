import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView, ThemedText, ThemedTextInput, ThemedButton } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password.');
        return;
    }
    setLoading(true);
    const success = await login(email, password);
    if (!success) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
    // Navigation is handled automatically by the AuthContext effect
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>LChat</ThemedText>
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
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
        style={styles.button}
      />
      <View style={styles.linkContainer}>
        <ThemedText>Don't have an account? </ThemedText>
        <Link href="/(auth)/register" asChild>
          <ThemedText type="link">Register</ThemedText>
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
