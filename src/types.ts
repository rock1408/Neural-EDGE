export interface Question {
  id: number;
  category: "Mathematics" | "Logic" | "Linguistics" | "Spatial" | "Memory" | "Science" | "Patterns" | "Quantitative" | "Philosophy" | "Processing";
  categoryColor: string;
  difficulty: 1 | 2 | 3; // 1 = Hard, 2 = Harder, 3 = Hardest
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface AppState {
  userName: string;
  userEmail: string;
  currentQuestion: number;
  answers: { questionId: number; selected: "A" | "B" | "C" | "D" | null; isCorrect: boolean; timeTaken: number }[];
  startTime: number | null;
  endTime: number | null;
  selectedQuestions: Question[];
  score: number;
  iqScore: number;
  categoryScores: Record<string, { correct: number; total: number }>;
  currentScreen: "landing" | "test" | "results" | "certificate";
}
