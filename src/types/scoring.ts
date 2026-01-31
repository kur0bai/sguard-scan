export interface ScoreReason {
  id: string;
  description?: string;
  value: number;
}

export interface ScoreResult {
  score: number;
  reasons: ScoreReason[];
}
