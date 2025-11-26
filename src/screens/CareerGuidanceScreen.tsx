import { ArrowLeft, ArrowRight, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedColors } from '../hooks/useThemedColors';

interface CareerGuidanceScreenProps {
  navigation: any;
}

interface Question {
  id: number;
  type: string;
  question: string;
  options?: string[];
  sliderRange?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
}

const questions: Question[] = [
  {
    id: 1,
    type: 'Multiple Choice',
    question: 'What type of work environment appeals to you most?',
    options: [
      'Office/Corporate setting',
      'Laboratory/Research facility',
      'Outdoor/Field work',
      'Healthcare facility',
      'Creative studio/workspace',
      'Remote/Flexible location'
    ]
  },
  {
    id: 2,
    type: 'Rate Your Preference',
    question: 'How important is work-life balance to you?',
    sliderRange: {
      min: 1,
      max: 10,
      minLabel: 'Not important',
      maxLabel: 'Very important'
    }
  },
  {
    id: 3,
    type: 'Multiple Choice',
    question: 'Which best describes your preferred working style?',
    options: [
      'Working independently',
      'Leading a team',
      'Collaborating in groups',
      'Mentoring others',
      'Following clear instructions',
      'Problem-solving creatively'
    ]
  },
  {
    id: 4,
    type: 'Rate Your Preference',
    question: 'How comfortable are you with technology and digital tools?',
    sliderRange: {
      min: 1,
      max: 10,
      minLabel: 'Not comfortable',
      maxLabel: 'Very comfortable'
    }
  },
  {
    id: 5,
    type: 'Multiple Choice',
    question: 'What motivates you most in your career?',
    options: [
      'High salary and financial security',
      'Making a positive impact on society',
      'Creative expression and innovation',
      'Recognition and prestige',
      'Continuous learning and growth',
      'Job stability and security'
    ]
  },
  {
    id: 6,
    type: 'Multiple Choice',
    question: 'Which subjects did you enjoy most in school?',
    options: [
      'Mathematics and Sciences',
      'Languages and Literature',
      'History and Social Studies',
      'Arts and Creative subjects',
      'Physical Education and Sports',
      'Technology and Computing'
    ]
  },
  // Add more questions here as needed
];

const careerResults = {
  'technology': {
    title: 'Technology & Engineering',
    description: 'Your interests align with technology, problem-solving, and innovation.',
    courses: ['Computer Science', 'Software Engineering', 'Data Science', 'Cybersecurity'],
    color: '#2A71D0',
    icon: '💻'
  },
  'healthcare': {
    title: 'Healthcare & Medicine',
    description: 'You show strong interest in helping others and working in healthcare.',
    courses: ['Medicine', 'Nursing', 'Physical Therapy', 'Public Health'],
    color: '#2ECC71',
    icon: '🏥'
  },
  'business': {
    title: 'Business & Management',
    description: 'Your profile suggests leadership skills and business acumen.',
    courses: ['Business Administration', 'Marketing', 'Finance', 'Entrepreneurship'],
    color: '#FFB800',
    icon: '💼'
  },
  'creative': {
    title: 'Creative Arts & Design',
    description: 'You have a strong creative mindset and artistic interests.',
    courses: ['Graphic Design', 'Fine Arts', 'Architecture', 'Digital Media'],
    color: '#0C5441',
    icon: '🎨'
  }
};

const CareerGuidanceScreen: React.FC<CareerGuidanceScreenProps> = ({ navigation }) => {
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [sliderValue, setSliderValue] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    primary: typeof careerResults[keyof typeof careerResults];
    secondary: (typeof careerResults[keyof typeof careerResults])[];
  } | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleOptionSelect = (option: string) => {
    setSelectedAnswer(option);
    setAnswers(prev => ({ ...prev, [currentQuestion]: option }));
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setSelectedAnswer(value);
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const calculateResults = () => {
    // Simple algorithm to determine career path based on answers
    const scores = {
      technology: 0,
      healthcare: 0,
      business: 0,
      creative: 0
    };

    // Score based on answers (simplified logic)
    Object.entries(answers).forEach(([questionId, answer]) => {
      const qId = parseInt(questionId);
      
      if (qId === 0) { // Question 1 (0-indexed)
        if (typeof answer === 'string') {
          if (answer.includes('Laboratory') || answer.includes('Office')) scores.technology += 2;
          if (answer.includes('Healthcare')) scores.healthcare += 3;
          if (answer.includes('Office/Corporate')) scores.business += 2;
          if (answer.includes('Creative studio')) scores.creative += 3;
        }
      }
      
      if (qId === 3) { // Question 4 (0-indexed)
        if (typeof answer === 'number' && answer >= 8) scores.technology += 2;
      }
      
      if (qId === 4) { // Question 5 (0-indexed)
        if (typeof answer === 'string') {
          if (answer.includes('financial security')) scores.business += 2;
          if (answer.includes('positive impact')) scores.healthcare += 2;
          if (answer.includes('Creative expression')) scores.creative += 3;
        }
      }
      
      if (qId === 5) { // Question 6 (0-indexed)
        if (typeof answer === 'string') {
          if (answer.includes('Mathematics and Sciences')) scores.technology += 3;
          if (answer.includes('Arts and Creative')) scores.creative += 3;
          if (answer.includes('Technology and Computing')) scores.technology += 2;
        }
      }
    });

    // Find the highest scoring career path
    const topCareer = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as keyof typeof careerResults;

    setResults({
      primary: careerResults[topCareer],
      secondary: Object.entries(careerResults)
        .filter(([key]) => key !== topCareer)
        .map(([, value]) => value)
        .slice(0, 2)
    });
    setShowResults(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate and show results
      calculateResults();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      const nextAnswer = answers[currentQuestion + 1];
      setSelectedAnswer(nextAnswer || null);
      // Set slider value if next question is a slider
      if (questions[currentQuestion + 1].type === 'Rate Your Preference') {
        setSliderValue(typeof nextAnswer === 'number' ? nextAnswer : 5);
      }
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers[currentQuestion - 1];
      setSelectedAnswer(prevAnswer || null);
      // Set slider value if previous question is a slider
      if (questions[currentQuestion - 1].type === 'Rate Your Preference') {
        setSliderValue(typeof prevAnswer === 'number' ? prevAnswer : 5);
      }
    }
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedAnswer(null);
    setSliderValue(5);
    setResults(null);
  };

  const handleSaveResults = () => {
    // Here you could save results to AsyncStorage or send to API
    navigation.goBack();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const currentQ = questions[currentQuestion];

  if (showResults && results) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Results Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={16} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Career Guidance Results</Text>
        </View>

        <ScrollView style={styles.resultsScrollView} showsVerticalScrollIndicator={false}>
          {/* Success Icon and Title */}
          <View style={styles.resultsHeader}>
            <View style={styles.successIcon}>
              <Target size={40} color="white" />
            </View>
            <Text style={styles.resultsTitle}>Your Career Path</Text>
            <Text style={styles.resultsSubtitle}>Based on your responses, here are our recommendations</Text>
          </View>

          {/* Primary Result Card */}
          <View style={styles.primaryResultCard}>
            <View style={[styles.primaryResultHeader, { backgroundColor: results.primary.color }]}>
              <Text style={styles.primaryResultIcon}>{results.primary.icon}</Text>
              <Text style={styles.primaryResultTitle}>{results.primary.title}</Text>
            </View>
            <View style={styles.primaryResultContent}>
              <Text style={styles.primaryResultDescription}>{results.primary.description}</Text>
              <View style={styles.coursesSection}>
                <Text style={styles.coursesTitle}>Recommended Courses:</Text>
                <View style={styles.coursesContainer}>
                  {results.primary.courses.map((course, index) => (
                    <View key={index} style={styles.courseTag}>
                      <Text style={styles.courseTagText}>{course}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Secondary Results */}
          <View style={styles.secondarySection}>
            <Text style={styles.secondarySectionTitle}>Other Career Paths to Consider</Text>
            {results.secondary.map((career, index) => (
              <View key={index} style={styles.secondaryResultCard}>
                <Text style={styles.secondaryResultIcon}>{career.icon}</Text>
                <View style={styles.secondaryResultContent}>
                  <Text style={styles.secondaryResultTitle}>{career.title}</Text>
                  <Text style={styles.secondaryResultDescription}>{career.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Next Steps */}
          <View style={styles.nextStepsSection}>
            <View style={styles.nextStepsHeader}>
              <Text style={styles.lightbulbIcon}>💡</Text>
              <View style={styles.nextStepsContent}>
                <Text style={styles.nextStepsTitle}>Next Steps</Text>
                <Text style={styles.nextStepsItem}>• Research universities offering your recommended programs</Text>
                <Text style={styles.nextStepsItem}>• Connect with professionals in your field of interest</Text>
                <Text style={styles.nextStepsItem}>• Consider internships or volunteer opportunities</Text>
                <Text style={styles.nextStepsItem}>• Review admission requirements for target programs</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={[styles.actionButtons, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={handleRetakeQuiz}
              accessibilityLabel="Retake Quiz"
              accessibilityRole="button"
            >
              <Text style={styles.retakeButtonText}>RETAKE QUIZ</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveResults}
              accessibilityLabel="Save Results"
              accessibilityRole="button"
            >
              <Text style={styles.saveButtonText}>SAVE RESULTS</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={16} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Career Guidance</Text>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.questionLabel}>Question {currentQ.id}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Question Card */}
        <View style={styles.questionCard}>
          {/* Question Header */}
          <View style={styles.questionHeader}>
            <View style={styles.questionNumberContainer}>
              <Text style={styles.questionNumber}>{currentQ.id}</Text>
            </View>
            <View style={styles.questionTypeContainer}>
              <Text style={styles.questionType}>{currentQ.type}</Text>
            </View>
          </View>

          {/* Question Text */}
          <View style={styles.questionTextContainer}>
            <Text style={styles.questionText}>{currentQ.question}</Text>
          </View>

          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            {currentQ.type === 'Multiple Choice' && currentQ.options && currentQ.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionRow}
                onPress={() => handleOptionSelect(option)}
                accessibilityLabel={`Select ${option}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedAnswer === option }}
              >
                <View style={[
                  styles.radioButton,
                  selectedAnswer === option && styles.radioButtonSelected
                ]}>
                  {selectedAnswer === option && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            
            {currentQ.type === 'Rate Your Preference' && currentQ.sliderRange && (
              <View style={styles.sliderContainer}>
                <View 
                  style={styles.sliderTrack}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={(event) => {
                    const { locationX } = event.nativeEvent;
                    const trackWidth = 295; // Approximate track width
                    const percentage = Math.max(0, Math.min(1, locationX / trackWidth));
                    const newValue = Math.round(currentQ.sliderRange!.min + percentage * (currentQ.sliderRange!.max - currentQ.sliderRange!.min));
                    handleSliderChange(newValue);
                  }}
                  onResponderMove={(event) => {
                    const { locationX } = event.nativeEvent;
                    const trackWidth = 295;
                    const percentage = Math.max(0, Math.min(1, locationX / trackWidth));
                    const newValue = Math.round(currentQ.sliderRange!.min + percentage * (currentQ.sliderRange!.max - currentQ.sliderRange!.min));
                    handleSliderChange(newValue);
                  }}
                >
                  <View style={[styles.sliderProgress, { width: `${((sliderValue - currentQ.sliderRange.min) / (currentQ.sliderRange.max - currentQ.sliderRange.min)) * 100}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${((sliderValue - currentQ.sliderRange.min) / (currentQ.sliderRange.max - currentQ.sliderRange.min)) * 100 - 8}%` }]} />
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderMinLabel}>{currentQ.sliderRange.minLabel}</Text>
                  <Text style={styles.sliderValue}>{sliderValue}/10</Text>
                  <Text style={styles.sliderMaxLabel}>{currentQ.sliderRange.maxLabel}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 17 }]}>
        <TouchableOpacity
          style={[styles.previousButton, isFirstQuestion && styles.buttonDisabled]}
          onPress={handlePrevious}
          disabled={isFirstQuestion}
          accessibilityLabel="Previous question"
          accessibilityRole="button"
        >
          <ArrowLeft size={16} color={colors.text} />
          <Text style={[styles.previousButtonText, isFirstQuestion && styles.buttonTextDisabled]}>
            PREVIOUS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, !selectedAnswer && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedAnswer}
          accessibilityLabel={isLastQuestion ? "Complete quiz" : "Next question"}
          accessibilityRole="button"
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'COMPLETE' : 'NEXT'}
          </Text>
          <ArrowRight size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 68,
    backgroundColor: '#0C5441',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 28,
  },
  progressSection: {
    backgroundColor: colors.surface,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1.26,
    borderBottomColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionLabel: {
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Arimo',
    fontWeight: '400',
    lineHeight: 20,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(42, 113, 208, 0.20)',
    borderRadius: 42152500,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2A71D0',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  questionNumberContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#0C5441',
    borderRadius: 42152500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumber: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '700',
    lineHeight: 24,
  },
  questionTypeContainer: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1.26,
    borderColor: colors.border,
  },
  questionType: {
    color: colors.text,
    fontSize: 12,
    fontFamily: 'Arimo',
    fontWeight: '400',
    lineHeight: 16,
  },
  questionTextContainer: {
    marginBottom: 24,
  },
  questionText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 16,
  },
  optionsContainer: {
    gap: 28,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 42152500,
    borderWidth: 1.26,
    borderColor: colors.textMuted || '#878787',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 6.66,
    height: 6.66,
    borderRadius: 42152500,
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 14,
    flex: 1,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1.26,
    borderTopColor: colors.border,
    paddingTop: 17,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 13,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    borderWidth: 1.26,
    borderColor: colors.border,
    gap: 8,
  },
  previousButtonText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 0.35,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0C5441',
    borderRadius: 10,
    gap: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 0.35,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
  // Slider styles
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 40,
  },
  sliderTrack: {
    width: '95%',
    height: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 42152500,
    position: 'relative',
    overflow: 'hidden',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 42152500,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    backgroundColor: colors.surface,
    borderRadius: 42152500,
    borderWidth: 1.26,
    borderColor: colors.primary,
    position: 'absolute',
    top: 0,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sliderLabels: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  sliderMinLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Arimo',
    fontWeight: '400',
    lineHeight: 20,
  },
  sliderValue: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Arimo',
    fontWeight: '700',
    lineHeight: 20,
  },
  sliderMaxLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Arimo',
    fontWeight: '400',
    lineHeight: 20,
  },
  // Results Screen Styles
  resultsScrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: colors.success || '#2ECC71',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIconText: {
    fontSize: 40,
  },
  resultsTitle: {
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  resultsSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  primaryResultCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.primaryGreen || '#0C5441',
    marginBottom: 24,
    overflow: 'hidden',
  },
  primaryResultHeader: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  primaryResultIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  primaryResultTitle: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    lineHeight: 16,
  },
  primaryResultContent: {
    padding: 24,
  },
  primaryResultDescription: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  coursesSection: {
    marginTop: 8,
  },
  coursesTitle: {
    fontSize: 14,
    fontFamily: 'Arimo',
    fontWeight: '700',
    color: colors.text,
    lineHeight: 14,
    marginBottom: 12,
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseTag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    borderWidth: 1.26,
    borderColor: colors.border,
  },
  courseTagText: {
    fontSize: 12,
    fontFamily: 'Arimo',
    fontWeight: '400',
    color: colors.text,
    lineHeight: 16,
  },
  secondarySection: {
    marginBottom: 24,
  },
  secondarySectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  secondaryResultCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondaryResultIcon: {
    fontSize: 24,
  },
  secondaryResultContent: {
    flex: 1,
  },
  secondaryResultTitle: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
    marginBottom: 4,
  },
  secondaryResultDescription: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  expandIcon: {
    width: 38,
    height: 32,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    borderWidth: 1.26,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextStepsSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1.26,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
  },
  nextStepsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  lightbulbIcon: {
    fontSize: 14,
    marginTop: 4,
  },
  nextStepsContent: {
    flex: 1,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  nextStepsItem: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  retakeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    borderWidth: 1.26,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
    color: colors.text,
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 0.35,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#0C5441',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
    color: 'white',
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 0.35,
  },
});

export default CareerGuidanceScreen;