import { useNavigation } from '@react-navigation/native';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Mail,
  Phone
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useThemedColors } from '../hooks/useThemedColors';

// ---------------- Types ----------------
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface ContactInfo {
  type: 'email' | 'phone' | 'social';
  label: string;
  value: string;
  action: string;
  icon: React.ReactNode;
}

// ---------------- Data ----------------
const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create an account on EduMatch?',
    answer: 'To create an account, tap the "Sign Up" button on the welcome screen. Fill in your personal information, academic background, and preferences. You\'ll receive a verification email to complete your registration.'
  },
  {
    id: '2',
    question: 'How does the matching system work?',
    answer: 'EduMatch suggests universities based on your profile information including academic performance, preferences, location, program interests, and career goals. The system analyzes your profile data to recommend universities that align with your educational background and aspirations. The more complete your profile, the better your university suggestions will be.'
  },
  {
    id: '3',
    question: 'Can I apply to multiple universities through the app?',
    answer: 'Yes! EduMatch allows you to apply to multiple universities directly through the app. You can track all your applications in the Applications section and receive real-time updates on their status.'
  },
  {
    id: '5',
    question: 'What if I don\'t like my university suggestions?',
    answer: 'You can update your preferences in your profile settings. Adjust your location preferences, program interests, academic requirements, or other criteria to get better university suggestions. The system will provide new recommendations based on your updated profile information.'
  },
  {
    id: '6',
    question: 'Is my personal information secure?',
    answer: 'Yes, we take your privacy seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent. See our Privacy Policy for more details.'
  },
  {
    id: '7',
    question: 'How do I contact universities directly?',
    answer: 'You can message universities directly through the app. Go to a university\'s profile and tap the "Message" button. Some universities also provide direct contact information in their profiles.'
  },
  {
    id: '8',
    question: 'Can I save universities for later?',
    answer: 'Yes! You can add universities to your favorites by tapping the heart icon on their profile. Access your saved universities anytime from your Profile tab.'
  }
];

const contactInfo: ContactInfo[] = [
  {
    type: 'email',
    label: 'Email Support',
    value: 'support@edumatch.com',
    action: 'mailto:support@edumatch.com',
    icon: <Mail size={20} color="#2A71D0" />
  },
  {
    type: 'phone',
    label: 'Phone Support',
    value: '+1 (555) 123-4567',
    action: 'tel:+15551234567',
    icon: <Phone size={20} color="#2A71D0" />
  }
];

// ---------------- Components ----------------
const FAQItem: React.FC<{ 
  item: FAQItem; 
  isExpanded: boolean; 
  onToggle: () => void; 
  colors: any;
}> = ({ item, isExpanded, onToggle, colors }) => {
  return (
    <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
      <TouchableOpacity 
        style={styles.faqHeader} 
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`FAQ: ${item.question}`}
        accessibilityHint={isExpanded ? "Tap to collapse answer" : "Tap to expand answer"}
      >
        <Text style={[styles.faqQuestion, { color: colors.text }]}>
          {item.question}
        </Text>
        {isExpanded ? (
          <ChevronUp size={20} color={colors.textSecondary} />
        ) : (
          <ChevronDown size={20} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={[styles.faqAnswerText, { color: colors.textSecondary }]}>
            {item.answer}
          </Text>
        </View>
      )}
    </View>
  );
};

const ContactItem: React.FC<{ 
  item: ContactInfo; 
  colors: any;
}> = ({ item, colors }) => {
  const handlePress = () => {
    Linking.openURL(item.action).catch((err) => {
      console.error('Failed to open link:', err);
    });
  };

  return (
    <TouchableOpacity 
      style={[styles.contactItem, { backgroundColor: colors.surface }]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Contact via ${item.label}: ${item.value}`}
    >
      <View style={styles.contactIcon}>
        {item.icon}
      </View>
      <View style={styles.contactContent}>
        <Text style={[styles.contactLabel, { color: colors.text }]}>
          {item.label}
        </Text>
        <Text style={[styles.contactValue, { color: colors.textSecondary }]}>
          {item.value}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ---------------- Main Component ----------------
const SupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const colors = useThemedColors();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <HelpCircle size={40} color="#2A71D0" />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Help & Support
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Find answers to common questions or get in touch with our support team
        </Text>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Frequently Asked Questions
        </Text>
        
        {faqData.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isExpanded={expandedFAQ === item.id}
            onToggle={() => toggleFAQ(item.id)}
            colors={colors}
          />
        ))}
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Contact Our Support Team
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Still need help? Our support team is here to assist you.
        </Text>
        
        {contactInfo.map((item, index) => (
          <ContactItem
            key={index}
            item={item}
            colors={colors}
          />
        ))}
      </View>

      {/* App Info */}
      <View style={[styles.appInfo, { backgroundColor: colors.surface }]}>
        <Text style={[styles.appInfoTitle, { color: colors.text }]}>
          EduMatch
        </Text>
        <Text style={[styles.appInfoVersion, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.appInfoDescription, { color: colors.textSecondary }]}>
          Connecting students with their ideal universities through intelligent matching 
          and personalized recommendations.
        </Text>
        <Text style={[styles.appInfoCopyright, { color: colors.textSecondary }]}>
          © 2025 EduMatch. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
  },
  appInfo: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  appInfoDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  appInfoCopyright: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SupportScreen;