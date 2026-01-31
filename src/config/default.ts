import { SguardConfig } from "../types/config";

export const DEFAULT_CONFIG: SguardConfig = {
  scoring: {
    thresholds: {
      low: 4,
      high: 7,
    },
    weights: {
      regex: 3,
      entropy: 2,
      assignment: 2,
      sensitive_name: 2,
      sensitive_file: 1,
      comment: -3,
      noisy_path: -2,
    },
  },
  entropy: {
    threshold: 3.5,
  },
  ignore: {
    paths: [],
    patterns: [],
  },
  output: {
    explain: true,
    mask_secrets: true,
  },
};
