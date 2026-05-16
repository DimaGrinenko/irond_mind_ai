export type AiRecommendation = {
  summary: string;
  nextSession: {
    targetRpe: number;
    notes: string[];
    exercises: Array<{
      exerciseId: string;
      deltaWeight: number;
      suggestedWeight: number;
      suggestedSets: number;
      suggestedReps: number;
      reasoning: string;
    }>;
  };
};

