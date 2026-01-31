import { SeverityLevel } from "./severity";

export type SecretCategory =
  | "api-key"
  | "token"
  | "credential"
  | "private-key"
  | "generic";

export interface SecretPattern {
  id: string;
  description: string;
  //old version
  severity?: SeverityLevel | string;
  confidence?: SeverityLevel | string;
  //new
  category: SecretCategory | string;
  regex: string;
  entropy?: boolean;
  expectedRuntime?: "client" | "server";
}
