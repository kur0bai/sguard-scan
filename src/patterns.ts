import rawPatterns from "../patterns/secrets.json";
import { RawSecretPattern } from "./types/pattern-raw";
import { RuntimeSecretPattern } from "./types/pattern-runtime";

function compilePattern(pattern: RawSecretPattern): RuntimeSecretPattern {
  let compiled: RegExp;

  try {
    compiled = new RegExp(pattern.regex);
  } catch {
    throw new Error(
      `Invalid regex in pattern "${pattern.id}": ${pattern.regex}`,
    );
  }

  return {
    id: pattern.id,
    description: pattern.description,
    regex: pattern.regex,

    category: pattern.category ?? "generic",
    entropy: pattern.entropy ?? false,
    ...(pattern.severity !== undefined && { severity: pattern.severity }),
    ...(pattern.confidence !== undefined && { confidence: pattern.confidence }),

    compiled,
  };
}

export const PATTERNS: RuntimeSecretPattern[] = (
  rawPatterns as RawSecretPattern[]
).map(compilePattern);
