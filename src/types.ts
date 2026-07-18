export type ExerciseType = 'multiple_choice' | 'fill_blanks' | 'word_ordering' | 'listening';

export interface RichTextConfig {
  text: string;
  bold?: boolean;
  italic?: boolean;
  color?: string; // Tailwind color class or hex, e.g. "text-red-600", "text-blue-600", "text-emerald-600"
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
}

export interface Section {
  id: string;
  name: string; // e.g. "Section 1: Present Tenses"
  grammarCategory: string; // e.g. "Present Simple vs Continuous"
  order: number;
  gradientFrom?: string; // Hex color for start of gradient
  gradientTo?: string;   // Hex color for end of gradient
  textColor?: string;    // Hex color for text
}

export interface Exercise {
  id: string;
  sectionId: string;
  type: ExerciseType;
  title: string;
  order: number;
  
  // Rich text configuration for the prompt/question
  richText: RichTextConfig;

  // Specific properties based on type:
  
  // MULTIPLE_CHOICE
  options?: string[]; // list of answers
  correctOptionIndex?: number; // index of the correct option

  // FILL_BLANKS
  // Text containing "[blank]" placeholders. Example: "I [blank] a doctor and they [blank] students."
  // For each [blank], there is a corresponding set of answers.
  blankSolutions?: string[]; // e.g. ["am", "are"]
  blankOptions?: string[][]; // Options for each blank if multiple choice for each blank, OR a general pool

  // WORD_ORDERING
  sentence?: string; // The correct sentence, e.g. "She used to play tennis every Sunday"
  scrambledWords?: string[]; // Words shuffled, e.g. ["used", "Sunday", "play", "tennis", "She", "to", "every"]

  // LISTENING
  listeningText?: string; // British English TTS text, e.g. "I fancy a cuppa tea, would you like one?"
  listeningBaseText?: string; // Context text shown to student, e.g. "Listen carefully to the British speaker."
  listeningQuestion?: string; // The question about the audio, e.g. "What does the speaker want?"
  listeningOptions?: string[]; // Options for the listening MCQ
  listeningCorrectIndex?: number; // Correct index for listening MCQ
}

// Student's response for an exercise
export interface StudentResponse {
  exerciseId: string;
  type: ExerciseType;
  
  // For multiple_choice & listening
  selectedOptionIndex?: number;
  
  // For fill_blanks
  blankAnswers?: string[]; // Answers provided for each blank
  
  // For word_ordering
  orderedWords?: string[]; // The words in the order chosen by the student

  // Time metrics
  timeSpentSeconds: number;
  
  // Self evaluation of understanding: 1 (didn't understand at all) to 5 (understood perfectly)
  understandingRating: number; 

  isLeftBlank: boolean;
}

// Full exam session metrics
export interface ExamResult {
  score: number; // Final calculated grade (e.g. 0 to 10)
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  averageTimePerQuestion: number;
  mostTimeConsumingExerciseId: string;
  mostTimeConsumingExerciseTitle: string;
  mostTimeConsumingSeconds: number;
  blankCount: number;
  sectionGrades: {
    sectionId: string;
    sectionName: string;
    grammarCategory: string;
    totalQuestions: number;
    correctCount: number;
    grade: number; // Grade on a scale of 0-10
    understandingRating?: number;
  }[];
  detailedResponses: {
    exerciseId: string;
    sectionId: string;
    sectionName: string;
    exerciseTitle: string;
    type: ExerciseType;
    isCorrect: boolean;
    studentAnswer: string;
    correctAnswer: string;
    timeSpentSeconds: number;
    understandingRating: number;
    isLeftBlank: boolean;
  }[];
}

export interface StudentAccessCode {
  id: string;
  studentName: string;
  studentCpf: string;
  accessCode: string; // The code used to enter, e.g. "LFA-123"
  timerMode: 'infinite' | 'countdown';
  countdownDurationMinutes: number;
  status: 'not_started' | 'completed';
  examResult?: ExamResult;
}

