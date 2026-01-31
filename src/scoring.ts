import { shannonEntropy } from "./entropy";
import { SecretPattern } from "./types/pattern";
import { ScoreResult, ScoreReason } from "./types/scoring";
import { SguardConfig } from "./types/config";
import { detectContext } from "./context";

const SENSITIVE_NAMES = ["key", "token", "secret", "password", "auth"];

export function calculateScore(
  line: string,
  value: string,
  file: string,
  pattern: SecretPattern,
  config: SguardConfig,
): ScoreResult {
  const reasons: ScoreReason[] = [];
  let score = 0;

  const context = detectContext(file, line);
  const { weights } = config.scoring;

  score += weights.regex;
  reasons.push({ id: "regex", value: weights.regex });

  /**
   * Entropy check
   */
  if (pattern.entropy) {
    const entropy = shannonEntropy(value);
    if (entropy >= config.entropy.threshold) {
      score += weights.entropy;
      reasons.push({ id: "entropy", value: weights.entropy });
    }
  }

  /**
   * Assignment only code
   */
  if (context.assignmentStyle === "code") {
    score += weights.assignment;
    reasons.push({
      id: "assignment",
      description: "Value assigned in code",
      value: weights.assignment,
    });
  }

  /**
   * Sensitive variable name check
   */
  if (
    context.assignmentStyle === "code" &&
    SENSITIVE_NAMES.some((n) => line.toLowerCase().includes(n))
  ) {
    score += weights.sensitive_name;
    reasons.push({
      id: "sensitive-name",
      description: "Sensitive variable name",
      value: weights.sensitive_name,
    });
  }

  /**
   * Penalties
   */
  if (context.fileType === "manifest") {
    score -= 1;
    reasons.push({
      id: "manifest-file",
      description: "Manifest / declarative file",
      value: -1,
    });
  }

  if (context.runtime === "client" && pattern.category === "api-key") {
    score -= 2;
    reasons.push({
      id: "client-runtime",
      description: "Client-side API key",
      value: -2,
    });
  }

  if (context.fileType === "pipeline") {
    score += 2;
    reasons.push({
      id: "pipeline-context",
      description: "Secret in CI/CD pipeline",
      value: 2,
    });
  }

  /**
   * Comment check
   */
  const trimmed = line.trim();
  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("/*")
  ) {
    score -= weights.comment;
    reasons.push({
      id: "comment",
      description: "Detected in comment",
      value: -weights.comment,
    });
  }

  return {
    score: Math.max(score, 0),
    reasons,
  };
}
