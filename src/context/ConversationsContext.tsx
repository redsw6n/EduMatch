import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'file';
  fileName?: string;
  fileUri?: string;
}

export interface Conversation {
  id: string;
  schoolData: {
    id: string;
    name: string;
    location: string;
  };
  messages: Message[];
  lastMessage: {
    text: string;
    timestamp: Date;
    isUser: boolean;
  };
  unreadCount: number;
  createdAt: Date;
}

interface ConversationsContextType {
  conversations: Conversation[];
  getConversation: (schoolId: string) => Conversation | undefined;
  addMessage: (schoolId: string, message: Omit<Message, 'id'>) => void;
  markAsRead: (conversationId: string) => void;
  createOrUpdateConversation: (schoolData: { id: string; name: string; location: string }) => string;
  isLoading: boolean;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

const STORAGE_KEY = '@conversations';

export const ConversationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load conversations from AsyncStorage on app start
  useEffect(() => {
    loadConversations();
  }, []);

  // Save conversations to AsyncStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveConversations();
    }
  }, [conversations, isLoading]);

  const loadConversations = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedConversations = JSON.parse(storedData).map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          lastMessage: {
            ...conv.lastMessage,
            timestamp: new Date(conv.lastMessage.timestamp),
          },
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setConversations(parsedConversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConversations = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  const getConversation = useCallback((schoolId: string): Conversation | undefined => {
    return conversations.find(conv => conv.schoolData.id === schoolId);
  }, [conversations]);

  const createOrUpdateConversation = useCallback((schoolData: { id: string; name: string; location: string }): string => {
    const existingConversation = conversations.find(conv => conv.schoolData.id === schoolData.id);
    
    if (existingConversation) {
      return existingConversation.id;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: Date.now().toString(),
      schoolData,
      messages: [
        {
          id: '1',
          text: `Hello! Welcome to ${schoolData.name}. I'm here to help answer any questions you have about our programs, admission requirements, or campus life. How can I assist you today?`,
          isUser: false,
          timestamp: new Date(),
          type: 'text',
        },
      ],
      lastMessage: {
        text: `Hello! Welcome to ${schoolData.name}. I'm here to help answer any questions you have about our programs, admission requirements, or campus life. How can I assist you today?`,
        timestamp: new Date(),
        isUser: false,
      },
      unreadCount: 1,
      createdAt: new Date(),
    };

    setConversations(prev => [newConversation, ...prev]);
    return newConversation.id;
  }, [conversations]);

  const addMessage = useCallback((schoolId: string, messageData: Omit<Message, 'id'>) => {
    const message: Message = {
      ...messageData,
      id: Date.now().toString(),
    };

    setConversations(prevConversations => {
      return prevConversations.map(conversation => {
        if (conversation.schoolData.id === schoolId) {
          const updatedMessages = [...conversation.messages, message];
          return {
            ...conversation,
            messages: updatedMessages,
            lastMessage: {
              text: message.type === 'file' ? `📎 ${message.fileName}` : message.text,
              timestamp: message.timestamp,
              isUser: message.isUser,
            },
            unreadCount: message.isUser ? conversation.unreadCount : conversation.unreadCount + 1,
          };
        }
        return conversation;
      });
    });
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prevConversations => {
      return prevConversations.map(conversation => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            unreadCount: 0,
          };
        }
        return conversation;
      });
    });
  }, []);

  const value: ConversationsContextType = {
    conversations,
    getConversation,
    addMessage,
    markAsRead,
    createOrUpdateConversation,
    isLoading,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationsProvider');
  }
  return context;
};