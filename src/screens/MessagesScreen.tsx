import * as DocumentPicker from 'expo-document-picker';
import { ArrowLeft, Paperclip, Send } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useConversations, type Message } from '../context/ConversationsContext';
import { useThemedColors } from '../hooks/useThemedColors';

interface MessagesScreenProps {
  route?: {
    params?: {
      schoolData?: {
        id: string;
        name: string;
        location: string;
      };
    };
  };
  navigation?: any;
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ route, navigation }) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  
  const { 
    getConversation, 
    addMessage, 
    markAsRead, 
    createOrUpdateConversation 
  } = useConversations();
  
  const schoolData = route?.params?.schoolData;
  const schoolName = schoolData?.name || 'University Admissions';
  
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // Get conversation data
  const conversation = schoolData ? getConversation(schoolData.id) : null;
  const messages = conversation?.messages || [];

  // Create or get existing conversation on mount
  useEffect(() => {
    if (schoolData) {
      const id = createOrUpdateConversation(schoolData);
      setConversationId(id);
    }
  }, [schoolData?.id, schoolData?.name, schoolData?.location, createOrUpdateConversation]);

  // Memoized markAsRead to prevent infinite re-renders
  const memoizedMarkAsRead = useCallback((id: string) => {
    markAsRead(id);
  }, [markAsRead]);

  // Mark conversation as read when screen is focused
  useEffect(() => {
    if (conversationId) {
      memoizedMarkAsRead(conversationId);
    }
  }, [conversationId, memoizedMarkAsRead]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim().length === 0 || !schoolData) return;

    // Add user message
    addMessage(schoolData.id, {
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    });

    setMessage('');

    // Simulate school response after a delay
    setTimeout(() => {
      const responses = [
        "Thank you for your message! I'll get back to you with more information shortly.",
        "That's a great question! Let me connect you with the right department for detailed information.",
        "I'd be happy to help you with that. Would you like to schedule a call with our admissions counselor?",
        "Thanks for reaching out! For specific program details, I recommend checking our website or scheduling a campus visit.",
        "I appreciate your interest in our university. Is there anything specific about our programs you'd like to know more about?",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      addMessage(schoolData.id, {
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      });
    }, 1500);
  };

  const handleFileUpload = async () => {
    if (!schoolData) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Add file message
        addMessage(schoolData.id, {
          text: `Document: ${file.name}`,
          isUser: true,
          timestamp: new Date(),
          type: 'file',
          fileName: file.name,
          fileUri: file.uri,
        });

        // Simulate school response
        setTimeout(() => {
          addMessage(schoolData.id, {
            text: `Thank you for sharing "${file.name}"! I'll review it and get back to you soon.`,
            isUser: false,
            timestamp: new Date(),
            type: 'text',
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.schoolMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userMessageBubble : styles.schoolMessageBubble,
        item.type === 'file' && styles.fileBubble
      ]}>
        {item.type === 'file' ? (
          <View style={styles.fileContainer}>
            <Paperclip size={16} color={item.isUser ? '#FFFFFF' : colors.text} />
            <Text style={[
              styles.messageText,
              item.isUser ? styles.userMessageText : styles.schoolMessageText,
              styles.fileName
            ]}>
              {item.fileName || 'Document'}
            </Text>
          </View>
        ) : (
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.schoolMessageText
          ]}>
            {item.text}
          </Text>
        )}
      </View>
      <Text style={[
        styles.messageTime,
        item.isUser ? styles.userMessageTime : styles.schoolMessageTime
      ]}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{schoolName}</Text>
          <Text style={styles.headerSubtitle}>
            {schoolData?.location || 'Admissions Office'}
          </Text>
        </View>
        
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>
            {schoolName.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.fileUploadButton}
              onPress={handleFileUpload}
              accessibilityRole="button"
              accessibilityLabel="Upload file"
            >
              <Paperclip size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
              accessibilityLabel="Message input"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                message.trim().length === 0 && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={message.trim().length === 0}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Send 
                size={20} 
                color={message.trim().length === 0 ? colors.textSecondary : '#FFFFFF'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Arimo',
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Arimo',
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A71D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  schoolMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  userMessageBubble: {
    backgroundColor: '#2A71D0',
    borderBottomRightRadius: 4,
  },
  schoolMessageBubble: {
    backgroundColor: colors.backgroundSecondary,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '400',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  schoolMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Arimo',
    fontWeight: '400',
    lineHeight: 16,
  },
  userMessageTime: {
    color: colors.textSecondary,
    textAlign: 'right',
    marginRight: 4,
  },
  schoolMessageTime: {
    color: colors.textSecondary,
    textAlign: 'left',
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  fileUploadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '400',
    color: colors.text,
    lineHeight: 20,
    maxHeight: 100,
    marginRight: 8,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2A71D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: colors.backgroundSecondary,
  },
  fileBubble: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default MessagesScreen;