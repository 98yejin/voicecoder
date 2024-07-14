export interface ProblemSet {
  name: string;
  type: string;
  voice: boolean;
  explain: string;
}

export interface Problem {
  question: string;
  answer?: string;
}
