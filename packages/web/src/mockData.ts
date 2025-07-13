import { type Request } from './store/useStore';

export const mockRequests: Request[] = [
  {
    id: '1',
    title: 'Design Portfolio Review',
    description:
      'Looking for feedback on my UI/UX portfolio for job applications',
    audioUrl: '',
    questions: [
      "Does the portfolio effectively showcase the designer's skills and experience?",
      'How well are the case studies structured and communicated?',
      'What specific improvements would make this portfolio more compelling for senior positions?',
    ],
    creator: 'alice',
    reward: 5,
    responses: [],
    status: 'active',
  },
  {
    id: '2',
    title: 'Code Review',
    description: 'Need feedback on my React component architecture',
    audioUrl: '',
    questions: [
      'Is the component structure maintainable and scalable?',
      'Are there any performance bottlenecks?',
      'How can state management be improved?',
    ],
    creator: 'bob',
    reward: 8,
    responses: [],
    status: 'active',
  },
  {
    id: '3',
    title: 'Business Plan Feedback',
    description: 'Seeking input on my startup pitch deck and business model',
    audioUrl: '',
    questions: [
      'Is the value proposition clear and compelling?',
      'What are the main risks or concerns?',
      'How can the business model be strengthened?',
    ],
    creator: 'charlie',
    reward: 10,
    responses: [],
    status: 'active',
  },
  {
    id: '4',
    title: 'Landing Page Copy Review',
    description:
      'Feedback needed on landing page copy for conversion optimization',
    audioUrl: '',
    questions: [
      'Is the messaging clear and persuasive?',
      'What improvements would increase signups?',
      'Are there any confusing sections?',
    ],
    creator: 'dana',
    reward: 4,
    responses: [],
    status: 'active',
  },
  {
    id: '5',
    title: 'User Onboarding Flow',
    description:
      'Looking for feedback on the onboarding experience for new users',
    audioUrl: '',
    questions: [
      'Is the onboarding flow intuitive?',
      'Where do users get stuck or confused?',
      'What would make the experience smoother?',
    ],
    creator: 'eve',
    reward: 6,
    responses: [],
    status: 'active',
  },
];
