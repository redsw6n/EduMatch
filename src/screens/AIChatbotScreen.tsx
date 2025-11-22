import { Bot, ChevronLeft, Send } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
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
import { useThemedColors } from '../hooks/useThemedColors';

interface AIChatbotScreenProps {
  navigation?: any;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatbotScreen: React.FC<AIChatbotScreenProps> = ({ navigation }) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant for EduMatch. I can help you find universities, answer questions about programs, and guide you through the application process. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim().length === 0) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(message.trim());
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerMessage.includes('university') || lowerMessage.includes('college') || lowerMessage.includes('school')) {
      return 'I can help you find universities that match your preferences! You can explore universities based on your location, budget, and program interests. Would you like me to suggest some universities based on your profile?';
    }
    
    if (lowerMessage.includes('program') || lowerMessage.includes('course') || lowerMessage.includes('major')) {
      return 'Great question about programs! Universities offer various programs like Engineering, Business, Arts, Health Sciences, and more. What field of study are you most interested in?';
    }
    
    if (lowerMessage.includes('application') || lowerMessage.includes('apply')) {
      return 'I can guide you through the application process! Most universities require transcripts, recommendation letters, and personal statements. You can track your applications right here in EduMatch. Do you need help with a specific part of the application?';
    }
    
    if (lowerMessage.includes('tuition') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
      return 'Tuition costs vary by university and program. I can help you filter universities by your budget range. What\'s your preferred tuition range? You can also explore scholarship opportunities!';
    }
    
    if (lowerMessage.includes('scholarship') || lowerMessage.includes('financial aid')) {
      return 'Scholarships are a great way to fund your education! Many universities offer merit-based and need-based scholarships. I recommend checking each university\'s financial aid page for specific opportunities.';
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! I\'m here to help you with your university search and application journey. Feel free to ask me anything about universities, programs, applications, or the EduMatch app!';
    }
    
    if (lowerMessage.includes('thank')) {
      return 'You\'re very welcome! I\'m always here to help with your educational journey. Is there anything else you\'d like to know about universities or applications?';
    }
    
    // Default response
    return 'That\'s an interesting question! While I\'m still learning, I can help you with university searches, program information, and application guidance. You can also explore the universities in the Explore tab or check your application status in the Applications section. Is there something specific about universities or applications I can help with?';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userMessageBubble : styles.aiMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={[
        styles.messageTime,
        item.isUser ? styles.userMessageTime : styles.aiMessageTime
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
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={styles.headerSubtitle}>EduMatch Chatbot</Text>
        </View>
        
        <View style={styles.headerAvatar}>
          <Bot size={20} color="#FFFFFF" />
        </View>
      </View>

      {/* Messages and Input with Keyboard Avoidance */}
      <KeyboardAvoidingView
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        {/* Input Section */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Ask me anything about universities..."
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
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
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
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
  aiMessageText: {
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
  aiMessageTime: {
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: colors.backgroundSecondary,
  },
});

export default AIChatbotScreen;