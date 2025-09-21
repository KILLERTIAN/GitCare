export interface Bounty {
    id: number;
    title: string;
    description: string;
    reward: number;
    creator: string;
    isCompleted: boolean;
    deadline: number;
    completedBy: string;
    createdAt: number;
    tags: string[];
  }
