import create from 'zustand';

export interface Response {
  id: string;
  contributor: string;
  answers: string[];
  score: number;
  selected: boolean;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  questions: string[];
  creator: string;
  reward: number;
  responses: Response[];
  status: 'active' | 'closed';
}

interface StoreState {
  requests: Request[];
  setRequests: (requests: Request[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
}));
