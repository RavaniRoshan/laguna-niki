export type ThemeMode = 'light' | 'dark' | 'system';

export interface LevelData {
  id: number;
  name: string;
  tint: 'sand' | 'slate' | 'mist' | 'clay' | 'sage' | 'blush' | 'moss' | 'ink';
  map: string; // 36 lines of 20 chars each
  gemTarget?: number;
}

export interface CommentItem {
  id: string;
  author: string;
  avatarText: string;
  avatarBg?: string;
  timeAgo: string;
  content: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  isPinned?: boolean;
  isEdited?: boolean;
  replies?: CommentItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricingPlan {
  id: string;
  number: string;
  name: string;
  price: string;
  period?: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
  ctaLink?: string;
  isComingSoon?: boolean;
}
