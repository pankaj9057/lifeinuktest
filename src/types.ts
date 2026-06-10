export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multi';
  answers: Answer[];
  correctAnswers: string[];
  explanation?: string;
  category: string;
}

export interface TestSet {
  id: number;
  title: string;
  questions: Question[];
}

export type TestStatus = 'not_started' | 'in_progress' | 'passed' | 'failed';

export interface TestResult {
  testId: number;
  status: TestStatus;
  score: number;
  totalQuestions: number;
  completedAt?: string;
  accuracy?: number;
}

export type AppView = 'dashboard' | 'simulator' | 'results';
