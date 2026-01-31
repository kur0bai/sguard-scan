# sguard (Experimental)

**sguard** is an experimental security tool designed to help developers detect **hardcoded secrets** in their projects _before_ they are committed or shipped.

It combines **pattern matching**, **entropy analysis**, and **context-aware scoring** to reduce false positives while still highlighting real security risks.

> **Status: Experimental**
>
> This project is under active development. APIs, scoring rules, and outputs may change.  
> Use it as a safety net, not as your only security control.

---

## Key Features

### Secret Detection

- Scans your project files for known secret patterns:
  - AWS keys
  - Google API keys
  - GitHub tokens
  - Generic tokens and credentials
- Uses a **community-maintained JSON pattern database**

---

### Context-Aware Scoring (Not Just Regex)

sguard does not rely solely on regex matches.

Each finding is evaluated using multiple signals:

- Regex match
- Shannon entropy
- Assignment context (code vs declarative files)
- File type (code, config, manifest, CI/CD)
- Runtime exposure (client vs server)
- Path noise (tests, docs, mocks)

This produces a **risk score**, which is then mapped to:

- `LOW`
- `MEDIUM`
- `HIGH`

The same secret can have different severities depending on **where and how** it appears.

---

## Continuous Security (CI)

This project uses GitHub Actions to continuously monitor security risks:

### ✔ Dependency Security

- `npm audit` is executed on every pull request
- Builds fail on **HIGH / CRITICAL** vulnerabilities

### ✔ Code Scanning

- GitHub CodeQL analyzes the codebase for security issues
- Results are available under the repository’s **Security** tab

These checks help ensure that even as an experimental project, sguard follows
basic security best practices.

---

### Explainable Results

Every finding includes a breakdown of _why_ it was reported:
