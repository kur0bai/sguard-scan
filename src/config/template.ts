export const CONFIG_TEMPLATE = `# sguard configuration

scoring:
  thresholds:
    low: 4
    high: 7

  weights:
    regex: 3
    entropy: 2
    assignment: 2
    sensitive_name: 2
    sensitive_file: 1
    comment: -3
    noisy_path: -2

entropy:
  threshold: 3.5

ignore:
  paths:
    - "docs/**"
    - "examples/**"
    - "**/*.test.*"

  patterns:
    - "example_key"
    - "test_secret"

output:
  explain: true
  mask_secrets: true
`;
