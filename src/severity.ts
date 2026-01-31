import { SeverityLevel } from "./types/severity";
import { SguardConfig } from "./types/config";

export function scoreToSeverity(score: number, config: SguardConfig) {
  if (score >= config.scoring.thresholds.high) return SeverityLevel.HIGH;
  if (score >= config.scoring.thresholds.low) return SeverityLevel.MEDIUM;
  return SeverityLevel.LOW;
}
