import { shannonEntropy } from "@src/entropy";
import { SeverityLevel } from "@src/types/severity";
import { SecretPattern } from "@src/types/pattern";

const ASSIGNMENT_INDICATORS = ["=", ":", "=>"];

export function isComment(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("/*")
  );
}

export function looksAssigned(line: string): boolean {
  return ASSIGNMENT_INDICATORS.some((op) => line.includes(op));
}

export function passesEntropyCheck(
  value: string,
  pattern: SecretPattern,
  threshold = 3.5,
): boolean {
  if (!pattern.entropy) return true;
  return shannonEntropy(value) >= threshold;
}

export function passesContextChecks(
  line: string,
  pattern: SecretPattern,
): boolean {
  if (pattern.confidence === SeverityLevel.MEDIUM && !looksAssigned(line)) {
    return false;
  }

  if (isComment(line) && pattern.confidence !== SeverityLevel.HIGH) {
    return false;
  }

  return true;
}
