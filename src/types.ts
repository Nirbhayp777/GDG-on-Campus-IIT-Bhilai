export interface StatCard {
  id: string;
  count: string;
  label: string;
  iconName: string;
  colorClass: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  team: 'Core' | 'Tech' | 'Design' | 'Admins' | 'Operations';
  githubUrl?: string;
  linkedinUrl?: string;
  instaUrl?: string;
}

export interface TechItem {
  id: string;
  name: string;
  colorClass: string;
  iconName: string;
  description: string;
}

export interface GDGEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  tag: string;
  description: string;
  isUpcoming: boolean;
  speaker?: string;
  speakerRole?: string;
  rsvpCount?: number;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  date: string;
  url: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

declare global {
  interface Window {
    smootherInstance?: any;
    blockScramble?: boolean;
  }
}

