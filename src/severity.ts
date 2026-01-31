import { SeverityLevel } from "@src/types/severity";

export function scoreToSeverity(score: number): SeverityLevel {
  if (score >= 7) return SeverityLevel.HIGH;
  if (score >= 4) return SeverityLevel.MEDIUM;
  return SeverityLevel.LOW;
}
