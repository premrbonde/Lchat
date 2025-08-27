import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Switch, Text, Alert } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import apiService from '@/services/apiService';

// Helper to format messages for GiftedChat
const formatMessage = (msg: any): IMessage => ({
  _id: msg._id,
  text: msg.text,
  createdAt: new Date(msg.createdAt),
  user: {
    _id: msg.sender._id,
    name: msg.sender.nickname,
    avatar: msg.sender.profilePicture,
  },
});

export default function ChatScreen() {
  const { conversationId, name } = useLocalSearchParams<{ conversationId: string; name: string }>();
  const { colors, isDark } = useTheme();
  const { user: currentUser } = useAuth();
  const { socket } = useSocket();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch historical messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/messages?conversationId=${conversationId}`);
        const formattedMessages = response.data.messages.map(formatMessage);
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        Alert.alert('Error', 'Could not load messages.');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.emit('joinConversation', conversationId);

    const handleNewMessage = (newMessage: any) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [formatMessage(newMessage)])
      );
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, conversationId]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (socket) {
      const messageData = {
        conversationId,
        text: newMessages[0].text,
      };
      socket.emit('sendMessage', messageData);
    }
  }, [socket, conversationId]);

  if (!currentUser) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerTitle: name || 'Chat' }} />
      <GiftedChat
        messages={messages}
        onSend={(msgs) => onSend(msgs)}
        user={{ _id: currentUser.userId }}
        isLoading={loading}
        // Theming
        textInputStyle={{ color: colors.text, backgroundColor: colors.inputBackground }}
        containerStyle={{ backgroundColor: colors.background }}
        renderUsernameOnMessage
      />
    </View>
  );
}
