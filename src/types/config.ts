export interface SguardConfig {
  scoring: {
    thresholds: {
      low: number;
      high: number;
    };
    weights: {
      regex: number;
      entropy: number;
      assignment: number;
      sensitive_name: number;
      sensitive_file: number;
      comment: number;
      noisy_path: number;
    };
  };

  entropy: {
    threshold: number;
  };

  ignore: {
    paths: string[];
    patterns: string[];
  };

  output: {
    explain: boolean;
    mask_secrets: boolean;
  };
}
