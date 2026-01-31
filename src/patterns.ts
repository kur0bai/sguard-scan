import rawPatterns from "../patterns/secrets.json";
import { SecretPattern } from "./types/pattern";

export const PATTERNS = rawPatterns.map((p: SecretPattern) => ({
  ...p,
  compiled: new RegExp(p.regex),
}));
