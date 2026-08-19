export type RecommendationT = {
  id: number;
  personId: number | null;
  person: string | null;
  emoji: string;
  name: string;
  amount: number;
  price: string;
  tag: string;
  reason: string;
};
