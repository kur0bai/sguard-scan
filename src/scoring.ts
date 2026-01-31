import { shannonEntropy } from "@src/entropy";
import { SecretPattern } from "@src/types/pattern";
import { ScoreResult, ScoreReason } from "@src/types/scoring";

const SENSITIVE_NAMES = ["key", "token", "secret", "password", "auth"];

export function calculateScore(
  line: string,
  value: string,
  file: string,
  pattern: SecretPattern,
): ScoreResult {
  const reasons: ScoreReason[] = [];
  let score = 0;

  score += 3;
  reasons.push({
    id: "regex",
    description: "Coincide con patrón conocido",
    value: 3,
  });

  // entropy
  if (pattern.entropy) {
    const entropy = shannonEntropy(value);
    if (entropy >= 3.5) {
      score += 2;
      reasons.push({
        id: "entropy",
        description: "Alta entropía",
        value: 2,
      });
    }
  }

  // if asigned
  if (["=", ":", "=>"].some((op) => line.includes(op))) {
    score += 2;
    reasons.push({
      id: "assignment",
      description: "Valor asignado a variable",
      value: 2,
    });
  }

  // sensitive name
  if (SENSITIVE_NAMES.some((n) => line.toLowerCase().includes(n))) {
    score += 2;
    reasons.push({
      id: "sensitive-name",
      description: "Nombre de variable sensible",
      value: 2,
    });
  }

  // sensitive file
  if (file.includes(".env") || file.toLowerCase().includes("config")) {
    score += 1;
    reasons.push({
      id: "sensitive-file",
      description: "Archivo sensible",
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
      description: "Detectado en comentario",
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
      description: "Ruta ruidosa (tests/docs)",
      value: -2,
    });
  }

  return {
    score: Math.max(score, 0),
    reasons,
  };
}
