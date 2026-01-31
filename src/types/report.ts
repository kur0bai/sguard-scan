import { SeverityLevel } from "./severity";
import { ScoreReason } from "./scoring";

export interface FindingReport {
  id: string;
  description: string;
  severity: SeverityLevel;
  score: number;
  reasons: ScoreReason[];
}
