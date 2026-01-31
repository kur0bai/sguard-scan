import { SeverityLevel } from "@src/types/severity";
import { SecretPattern } from "@src/types/pattern";

export interface Finding {
  file: string;
  line: number;
  pattern: SecretPattern;
  score: number;
  severity: SeverityLevel;
}
