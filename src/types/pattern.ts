import { SeverityLevel } from "@src/types/severity";

export interface SecretPattern {
  id: string;
  description: string;
  severity: SeverityLevel | string;
  confidence: SeverityLevel | string;
  regex: string;
  entropy?: boolean;
}
