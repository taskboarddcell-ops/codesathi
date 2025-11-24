export enum TrackType {
  SCRATCH = 'SCRATCH',
  PYTHON = 'PYTHON',
  JAVASCRIPT = 'JAVASCRIPT'
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface TheoryCard {
  id: string;
  title: string;
  content: string;
  image?: string; // Emoji or URL
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  track: TrackType;
  difficulty: Difficulty;
  xpReward: number;
  
  // 5-Step Loop Content
  introText: string;
  theoryCards: TheoryCard[];
  initialCode: string;
  solutionPattern: RegExp | string; // Used for Practice Mode
  instructions: string[]; // Practice Instructions
  hints: string[]; // Practice Hints
  
  challenge?: {
    description: string;
    initialCode: string;
    solutionPattern: RegExp | string;
    successMessage: string;
  };
}

export interface UserProgress {
  xp: number;
  streak: number;
  completedLessons: string[];
  badges: string[];
  currentTrack: TrackType;
}

export interface UserProfile {
  id?: string;
  name: string;
  learnerType: 'myself' | 'child';
  ageGroup: '7-9' | '10-12' | '13-14';
  goals: string[]; // 'games', 'web', 'animations', 'automate', 'explore'
  experience: 'none' | 'scratch' | 'code';
  learningStyle: 'visual' | 'challenges' | 'step';
  devices: string[]; // 'mobile', 'laptop'
  timePerDay: number; // minutes
  parentReport: boolean;
  phoneNumber?: string;
  address?: string;
  recommendedTrack?: TrackType;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  track: TrackType;
  difficulty: Difficulty;
  xpReward: number;
  image: string; // Emoji
  locked: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export type AppView = 'auth' | 'onboarding' | 'recommendation' | 'dashboard' | 'tracks' | 'projects' | 'rewards' | 'lesson';
