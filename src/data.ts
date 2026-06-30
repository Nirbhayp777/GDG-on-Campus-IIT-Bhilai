import { TeamMember, TechItem, GDGEvent, FAQItem, StatCard, GalleryPhoto } from './types';

export const statsData: StatCard[] = [
  {
    id: 'members',
    count: '600+',
    label: 'Community Members',
    iconName: 'Users',
    colorClass: 'text-brand-blue'
  },
  {
    id: 'workshops',
    count: '35+',
    label: 'Sessions & Workshops',
    iconName: 'BookOpen',
    colorClass: 'text-brand-red'
  },
  {
    id: 'speakers',
    count: '18+',
    label: 'Expert Speakers',
    iconName: 'Sparkles',
    colorClass: 'text-brand-yellow'
  },
  {
    id: 'events',
    count: '1500+',
    label: 'Total RSVP Registrants',
    iconName: 'Code',
    colorClass: 'text-brand-green'
  }
];

export const techStack: TechItem[] = [
  {
    id: 'android',
    name: 'Android',
    colorClass: '#3DDC84',
    iconName: 'Smartphone',
    description: 'Modern mobile engineering utilizing Kotlin and Jetpack Compose to build seamless, high-performance experiences.'
  },
  {
    id: 'flutter',
    name: 'Flutter & Dart',
    colorClass: '#02569B',
    iconName: 'Layers',
    description: 'Developing high-fidelity multi-platform applications for Android, Web, and Desktop from a single elegant codebase.'
  },
  {
    id: 'cloud',
    name: 'Google Cloud Platform',
    colorClass: '#4285F4',
    iconName: 'Cloud',
    description: 'Leveraging Firebase, Docker, Cloud Run, and compute instances to deploy scalable, global-ready backends.'
  },
  {
    id: 'ai-ml',
    name: 'AI & TensorFlow',
    colorClass: '#FF6F00',
    iconName: 'BrainCircuit',
    description: 'Building modern machine learning models and interacting with Gemini LLM APIs for conversational agents.'
  },
  {
    id: 'web',
    name: 'Web Technologies',
    colorClass: '#EA4335',
    iconName: 'Globe',
    description: 'Engineering responsive, lightning-fast Single Page Apps using modern frameworks and optimized Chrome APIs.'
  },
  {
    id: 'firebase',
    name: 'Firebase',
    colorClass: '#FFCA28',
    iconName: 'Database',
    description: 'Speeding up development with real-time firestore databases, secure client-side authentication, and cloud storage.'
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: 't1',
    name: 'Rahul Sharma',
    role: 'GDG on Campus Lead',
    team: 'Core',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 't2',
    name: 'Aarav Mehta',
    role: 'Technical Lead',
    team: 'Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 't3',
    name: 'Ananya Patel',
    role: 'Co-Lead & PR Head',
    team: 'Core',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 't4',
    name: 'Priya Verma',
    role: 'UX/UI & Design Lead',
    team: 'Design',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 't5',
    name: 'Nirbhay Pratap',
    role: 'Co-Lead & Operations Head',
    team: 'Operations',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 't6',
    name: 'Sneha Iyer',
    role: 'AI/ML Track Head',
    team: 'Tech',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400'
  }
];

export const gdgEvents: GDGEvent[] = [
  {
    id: 'e1',
    title: 'GenAI Study Jam: Hands-On with Gemini 2.5',
    date: 'June 25, 2026',
    time: '2:30 PM - 5:30 PM',
    venue: 'Academic Block 2, Seminar Room',
    tag: 'Artificial Intelligence',
    description: 'Learn the new google-genai SDK, implement prompt chaining, multimodal inputs, context windows, and deploy real-world apps with server proxy security.',
    isUpcoming: true,
    speaker: 'Dr. Amit Mishra',
    speakerRole: 'AI Researcher & Professor',
    rsvpCount: 142
  },
  {
    id: 'e2',
    title: 'Cloud Study Jam: Serverless Deployments with Cloud Run',
    date: 'July 12, 2026',
    time: '3:00 PM - 6:00 PM',
    venue: 'Lab Complex 1, CC Lab',
    tag: 'Cloud Computing',
    description: 'Package full-stack apps with Docker and run them in scale-to-zero serverless environments using Google Cloud Run. Credit badges available upon full codelab completion.',
    isUpcoming: true,
    speaker: 'Sneha Kapoor',
    speakerRole: 'Google Cloud Certified Professional',
    rsvpCount: 98
  },
  {
    id: 'e3',
    title: 'Compose Camp: Android UI Mastery with Jetpack Compose',
    date: 'May 10, 2026',
    venue: 'Lab Complex 2, ML Lab',
    tag: 'Android',
    description: 'A deep dive into declarative UI design, managing states, custom animations, and integrations with modern background services.',
    isUpcoming: false,
    speaker: 'Rahul Sharma',
    speakerRole: 'GDG on Campus Lead'
  },
  {
    id: 'e4',
    title: 'Flutter Forward: Responsive Cross-Platform Architectures',
    date: 'April 05, 2026',
    venue: 'Block A, Auditorium 1',
    tag: 'Flutter',
    description: 'Hands-on session exploring Riverpod state management, responsive grid layouts, and compilation strategies across Android, macOS, and Web platforms.',
    isUpcoming: false,
    speaker: 'Abhishek Jain',
    speakerRole: 'Software Dev at Google (Alumnus)'
  },
  {
    id: 'e5',
    title: 'Firebase Ignite: Auth, Database & Functions Crash Course',
    date: 'March 15, 2026',
    venue: 'Lab Complex 1, Software Lab',
    tag: 'Web & Firebase',
    description: 'Built a real-time multiplayer whiteboard application utilizing Firestore listeners, anonymous authorization structures, and Cloud storage buckets.',
    isUpcoming: false,
    speaker: 'Neha Gupta',
    speakerRole: 'Tech-Lead, Core Member'
  },
  {
    id: 'e6',
    title: 'Google Solution Challenge Kick-off Session',
    date: 'February 10, 2026',
    venue: 'Virtual Chapter Event',
    tag: 'General Engineering',
    description: 'Dissecting United Nations 17 Sustainable Development Goals, teaming up with peers, brainstorming features, and sketching maps of previous winning solutions.',
    isUpcoming: false,
    speaker: 'GDG Core Leadership Panel',
    speakerRole: 'IIT Bhilai'
  }
];

export const faqData: FAQItem[] = [
  {
    id: 'f1',
    question: 'Who can join GDG on Campus IIT Bhilai?',
    answer: 'Any student enrolled at IIT Bhilai regardless of their academic branch, year, or programming background. Beginners who have never written a single line of code are exceptionally welcome!',
    category: 'Membership'
  },
  {
    id: 'f2',
    question: 'Are there any registration fees or costs involved?',
    answer: 'No! All events, labs, workshops, speaker sessions, bootcamps, and resources shared by GDG on Campus IIT Bhilai are completely free of charge. Our aim is to foster accessible technical learning and growth.',
    category: 'Prerequisites'
  },
  {
    id: 'f3',
    question: 'How do I become an active contributor or core team member?',
    answer: 'At the start of every academic year, we open recruitment drives for several teams including Tech, Creative/Design, Operations, Public Relations, and Social Media curation. Stay tuned to our socials and mailing lists!',
    category: 'Recruitment'
  },
  {
    id: 'f4',
    question: 'How do I RSVP or secure a seat for upcoming workshops?',
    answer: 'You can RSVP directly by clicking "Join Our Chapter" or visiting our official GDG community portal. Once registered, you will receive calendars, codelab steps, and session URLs right in your email.',
    category: 'Events'
  },
  {
    id: 'f5',
    question: 'Do we get certificates or cloud credits?',
    answer: 'Yes! Participants of specific Google study programs, such as Android Camp and Cloud Study Jams, receive official badges, Google Cloud platform credits, and completion certificates.',
    category: 'Perks'
  }
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 'g1',
    title: 'GenAI Study Jam Launch',
    date: 'May 2026',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'g2',
    title: 'Hands-on Coding Cohort',
    date: 'April 2026',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200&h=800'
  }
];
