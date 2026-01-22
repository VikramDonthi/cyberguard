export interface CyberCrime {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  whatIsIt: string;
  howItHappens: string;
  example: string;
  prevention: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export type Page = 'home' | 'crimes' | 'safety' | 'quiz' | 'report';