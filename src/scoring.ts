import { shannonEntropy } from "./entropy";
import { SecretPattern } from "./types/pattern";
import { ScoreResult, ScoreReason } from "./types/scoring";
import { SguardConfig } from "./types/config";

const SENSITIVE_NAMES = ["key", "token", "secret", "password", "auth"];

export function calculateScore(
  line: string,
  value: string,
  file: string,
  pattern: SecretPattern,
  config: SguardConfig,
): ScoreResult {
  const { weights } = config.scoring;
  const reasons = [];
  let score = 0;

  score += weights.regex;
  reasons.push({
    id: "regex",
    description: "Pattern matched",
    value: weights.regex,
  });

  // entropy
  if (pattern.entropy) {
    const entropy = shannonEntropy(value);
    if (entropy >= config.entropy.threshold) {
      score += weights.entropy;
      reasons.push({
        id: "entropy",
        description: "High entropy detected",
        value: weights.entropy,
      });
    }
  }

  // if asigned
  if (["=", ":", "=>"].some((op) => line.includes(op))) {
    score += 2;
    reasons.push({
      id: "assignment",
      description: "Assigned value detected",
      value: 2,
    });
  }

  // sensitive name
  if (SENSITIVE_NAMES.some((n) => line.toLowerCase().includes(n))) {
    score += 2;
    reasons.push({
      id: "sensitive-name",
      description: "Sensitive variable name",
      value: 2,
    });
  }

  // sensitive file
  if (file.includes(".env") || file.toLowerCase().includes("config")) {
    score += 1;
    reasons.push({
      id: "sensitive-file",
      description: "Sensitive file",
      value: 1,
    });
  }

  // penalties
  const trimmed = line.trim();

  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("/*")
  ) {
    score -= 3;
    reasons.push({
      id: "comment",
      description: "Detected a comment line",
      value: -3,
    });
  }

  if (
    file.includes("test") ||
    file.includes("docs") ||
    file.includes("__mocks__")
  ) {
    score -= 2;
    reasons.push({
      id: "noisy-path",
      description: "Noisy path (tests/docs)",
      value: -2,
    });
  }

  return {
    score: Math.max(score, 0),
    reasons,
  };
}
