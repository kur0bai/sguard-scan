import { SecretPattern } from "./pattern";

export interface RuntimeSecretPattern extends SecretPattern {
  compiled: RegExp;
}
