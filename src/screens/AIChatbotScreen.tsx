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
import { 
  APPLICATION_REQUIREMENTS, 
  getFormattedProgramsList, 
  SCHOOL_POPULATION, 
  STUDENT_LIFE_INFO,
  searchPrograms,
  getProgramsByCategory
} from '../utils/chatbotData';

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
      text: 'Hello! I\'m your AI assistant for EduMatch. I specialize in helping you with:\n\n🎯 **My Expertise Areas:**\n• **Application Requirements** - what documents you need to apply\n• **School Population** - student counts and campus demographics  \n• **Available Programs** - complete listings of degree programs\n\nPlus university searches, program guidance, and application support. What would you like to know?',
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
    
    // Application Requirements responses
    if (lowerMessage.includes('application requirement') || 
        lowerMessage.includes('admission requirement') || 
        lowerMessage.includes('what do i need to apply') ||
        lowerMessage.includes('documents needed') ||
        lowerMessage.includes('requirements for application')) {
      let response = 'Here are the complete application requirements:\n\n📋 **Required Documents:**\n';
      
      APPLICATION_REQUIREMENTS.documents.forEach(doc => {
        response += `• ${doc.name} - ${doc.description}\n`;
      });
      
      response += '\n📝 **Personal Information Required:**\n';
      APPLICATION_REQUIREMENTS.personalInfo.forEach(info => {
        response += `• ${info}\n`;
      });
      
      response += '\n⏰ **Application Timeline:**\n';
      APPLICATION_REQUIREMENTS.deadlines.forEach(deadline => {
        response += `• ${deadline}\n`;
      });
      
      response += '\n🚀 **Process Steps:**\n';
      APPLICATION_REQUIREMENTS.process.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      
      response += '\nYou can start your application directly through EduMatch! Would you like help with any specific requirement?';
      return response;
    }

    // School Population responses  
    if (lowerMessage.includes('population') || 
        lowerMessage.includes('student count') || 
        lowerMessage.includes('how many students') ||
        lowerMessage.includes('enrollment') ||
        lowerMessage.includes('class size')) {
      let response = `👥 **School Population Information:**\n\n**${SCHOOL_POPULATION.name}:**\n`;
      response += `• Total Students: ${SCHOOL_POPULATION.totalStudents}\n`;
      response += `• Established: ${SCHOOL_POPULATION.establishedYear}\n`;
      response += `• Type: ${SCHOOL_POPULATION.type}\n`;
      response += `• Address: ${SCHOOL_POPULATION.address}\n\n`;
      
      response += 'Would you like to know more about our programs or application process?';
      return response;
    }

    // Available Programs responses
    if (lowerMessage.includes('available program') || 
        lowerMessage.includes('programs offered') || 
        lowerMessage.includes('courses available') ||
        lowerMessage.includes('what programs') ||
        lowerMessage.includes('list of programs') ||
        lowerMessage.includes('degree programs') ||
        (lowerMessage.includes('program') && (lowerMessage.includes('list') || lowerMessage.includes('all')))) {
      return getFormattedProgramsList();
    }

    // Specific program category searches
    if (lowerMessage.includes('business program') || lowerMessage.includes('business course')) {
      const businessPrograms = getProgramsByCategory('Business');
      let response = '💼 **Business Programs Available:**\n\n';
      businessPrograms.forEach(program => {
        response += `• **${program.name}**\n  Duration: ${program.duration} | Degree: ${program.degree}\n\n`;
      });
      response += 'All business programs include internships and industry partnerships. Would you like details about any specific program?';
      return response;
    }

    if (lowerMessage.includes('health program') || lowerMessage.includes('medical program') || lowerMessage.includes('nursing')) {
      const healthPrograms = getProgramsByCategory('Health & Allied Sciences');
      const specializedHealth = getProgramsByCategory('Specialized Health');
      
      let response = '🏥 **Health & Medical Programs Available:**\n\n';
      response += '**Health & Allied Sciences:**\n';
      healthPrograms.forEach(program => {
        response += `• ${program.name} (${program.duration})\n`;
      });
      
      response += '\n**Specialized Health Programs:**\n';
      specializedHealth.forEach(program => {
        response += `• ${program.name} (${program.duration})\n`;
      });
      
      response += '\nAll health programs include clinical training and board exam preparation. Which health field interests you most?';
      return response;
    }

    if (lowerMessage.includes('it program') || lowerMessage.includes('engineering') || lowerMessage.includes('technology program')) {
      const itPrograms = getProgramsByCategory('IT & Engineering');
      let response = '💻 **IT & Engineering Programs:**\n\n';
      itPrograms.forEach(program => {
        response += `• **${program.name}**\n  Duration: ${program.duration} | Degree: ${program.degree}\n\n`;
      });
      response += 'These programs include hands-on labs and industry partnerships. Would you like more details about any specific program?';
      return response;
    }

    // Program search functionality
    if (lowerMessage.includes('search') && (lowerMessage.includes('program') || lowerMessage.includes('course'))) {
      return 'I can help you search for programs! Try asking:\n\n🔍 **Search Examples:**\n• "Show me business programs"\n• "What health programs are available?"\n• "IT and engineering programs"\n• "Psychology programs"\n\nOr ask about specific programs like:\n• "Tell me about nursing"\n• "Information about IT program"\n• "Architecture program details"\n\nWhat type of program are you looking for?';
    }

    // Campus information
    if (lowerMessage.includes('campus') || lowerMessage.includes('location')) {
      let response = `🏫 **Campus Information:**\n\n**${SCHOOL_POPULATION.name}** has multiple campuses:\n\n`;
      SCHOOL_POPULATION.campuses.forEach((campus, index) => {
        response += `${index + 1}. ${campus}\n`;
      });
      
      response += '\n🌟 **Campus Features:**\n';
      response += '• Modern facilities and laboratories\n';
      response += '• Library and research centers\n';
      response += '• Sports and recreational areas\n';
      response += '• Student housing options (select campuses)\n';
      response += '• Dining and commercial areas\n';
      
      response += '\nEach campus offers a full range of student services. Would you like information about a specific campus?';
      return response;
    }

    // Admission and acceptance rates
    if (lowerMessage.includes('acceptance rate') || lowerMessage.includes('admission rate') || lowerMessage.includes('how hard to get in')) {
      return `📊 **Admission Information:**\n\n**${SCHOOL_POPULATION.name}:**\n• Acceptance Rate: ${SCHOOL_POPULATION.acceptanceRate}\n• Competitive but fair admission process\n• Holistic evaluation of applicants\n\n🎯 **Admission Factors:**\n• Academic performance (GPA/grades)\n• Completeness of application documents\n• Program-specific requirements\n• Application timing (earlier is better)\n\n💡 **Tips to Improve Your Chances:**\n• Submit complete, accurate documents\n• Apply early in the application period\n• Meet all program prerequisites\n• Write a compelling academic goals statement\n\nReady to start your application? I can guide you through the requirements!`;
    }

    // Enhanced program-specific responses
    if (lowerMessage.includes('program') || lowerMessage.includes('course') || lowerMessage.includes('major')) {
      return 'I can help you explore our program offerings! We have programs in:\n\n🔹 IT & Engineering (Information Technology, Architecture, Communication)\n🔹 Health & Allied Sciences (Nursing, Medical Technology, Pharmacy, etc.)\n🔹 Specialized Health (Dental Medicine, Veterinary Medicine)\n🔹 Business & Management (Marketing, Financial Management, Accountancy, etc.)\n🔹 Arts & Sciences (Fine Arts, Psychology, Biology)\n\nType "available programs" to see the complete list, or ask about a specific field like "business programs" or "health programs". What area interests you most?';
    }
    
    // Enhanced application responses
    if (lowerMessage.includes('application') || lowerMessage.includes('apply')) {
      return 'I can guide you through the application process! 📝\n\n**Quick Start:**\n• Use EduMatch\'s built-in application system\n• All required documents can be uploaded directly\n• Real-time application tracking\n\n**Need specifics?** Ask me about:\n• "Application requirements" - for document lists\n• "How to apply" - for step-by-step guidance\n• "Application deadline" - for timing information\n\nReady to start your application journey?';
    }
    
    // Simple keyword-based responses  
    if (lowerMessage.includes('university') || lowerMessage.includes('college') || lowerMessage.includes('school')) {
      return 'I can help you find universities that match your preferences! You can explore universities based on your location, budget, and program interests. Would you like me to suggest some universities based on your profile?';
    }
    
    if (lowerMessage.includes('tuition') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
      return 'Tuition costs vary by university and program. I can help you filter universities by your budget range. What\'s your preferred tuition range? You can also explore scholarship opportunities!';
    }
    
    if (lowerMessage.includes('scholarship') || lowerMessage.includes('financial aid')) {
      return 'Scholarships are a great way to fund your education! Many universities offer merit-based and need-based scholarships. I recommend checking each university\'s financial aid page for specific opportunities.';
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! I\'m here to help you with your university search and application journey. Feel free to ask me anything about:\n\n• **Application requirements** - what documents you need\n• **Available programs** - complete list of degree programs\n• **School population** - student count and campus info\n• Universities, applications, or the EduMatch app!\n\nWhat would you like to know?';
    }
    
    if (lowerMessage.includes('thank')) {
      return 'You\'re very welcome! I\'m always here to help with your educational journey. Is there anything else you\'d like to know about universities or applications?';
    }

    // Quick help responses for specific areas
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return 'I\'m your EduMatch AI assistant! I can help with:\n\n🎯 **My Specialties:**\n• **Application Requirements** - documents & process details\n• **School Population** - student counts & campus info  \n• **Available Programs** - complete program listings\n• University searches & recommendations\n• Application guidance & tracking\n\n💬 **Try asking:**\n• "What are the application requirements?"\n• "Show me available programs"\n• "What\'s the school population?"\n\nWhat would you like to explore first?';
    }
    
    // Default response
    return 'That\'s an interesting question! I specialize in helping with:\n\n🔍 **Application Requirements** - documents needed to apply\n👥 **School Population** - student counts and campus demographics\n📚 **Available Programs** - complete list of degree programs\n\nPlus general university searches, program information, and application guidance. You can also explore universities in the Explore tab or check your application status in the Applications section.\n\nIs there something specific about applications, programs, or school information I can help with?';
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