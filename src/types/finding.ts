import { SeverityLevel } from "./severity";
import { SecretPattern } from "./pattern";

export interface Finding {
  file: string;
  line: number;
  pattern: SecretPattern;
  score: number;
  severity: SeverityLevel;
}
