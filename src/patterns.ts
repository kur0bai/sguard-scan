import rawPatterns from "@patterns/secrets.json";
import { SecretPattern } from "@src/types/pattern";

export const PATTERNS = rawPatterns.map((p: SecretPattern) => ({
  ...p,
  compiled: new RegExp(p.regex),
}));
