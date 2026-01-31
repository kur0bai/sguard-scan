import { SeverityLevel } from "./severity";

export interface RawSecretPattern {
  id: string;
  description: string;
  regex: string;

  severity?: SeverityLevel | string;
  confidence?: SeverityLevel | string;
  entropy?: boolean;
  category?: string;
}
