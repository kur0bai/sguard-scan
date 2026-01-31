import fg from "fast-glob";
import fs from "fs";
import path from "path";

import { loadGitignore } from "./gitignore";
import { reportFinding } from "./reporter";
import { NOISYPATHS } from "./types/path";
import { PATTERNS } from "./patterns";

import { calculateScore } from "./scoring";
import { scoreToSeverity } from "./severity";
import { MIN_SCORE_TO_REPORT } from "./constants/scoring";
import { SguardConfig } from "./types/config";
import { RuntimeSecretPattern } from "./types/pattern-runtime";
import { detectContext } from "./context";

export function scanProject(root: string, config: SguardConfig): void {
  const ig = loadGitignore(root);

  const files = fg.sync("**/*", {
    cwd: root,
    onlyFiles: true,
    dot: true,
  });

  for (const file of files) {
    if (ig.ignores(file)) continue;
    if (NOISYPATHS.some((p) => file.includes(p))) continue;

    scanFile(file, root, config);
  }
}

/**
 * Scan a single file
 */
function scanFile(
  relativePath: string,
  root: string,
  config: SguardConfig,
): void {
  const fullPath = path.join(root, relativePath);
  const content = fs.readFileSync(fullPath, "utf8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!!line) {
      if (!line.trim()) continue;

      scanLine(line, i + 1, relativePath, config);
    }
  }
}

/**
 * Scan a single line against all patterns
 */
function scanLine(
  line: string,
  lineNumber: number,
  file: string,
  config: SguardConfig,
): void {
  for (const pattern of PATTERNS as RuntimeSecretPattern[]) {
    const match = pattern.compiled.exec(line);
    if (!match) continue;

    const value = match[0];

    const result = calculateScore(line, value, file, pattern, config);

    if (result.score < MIN_SCORE_TO_REPORT) continue;

    /**
     * Just for debugging purposes
     */
    /* const context = detectContext(file, line);
    console.log({
      file,
      line,
      assignmentStyle: context.assignmentStyle,
      fileType: context.fileType,
      runtime: context.runtime,
    }); */

    reportFinding(file, lineNumber, {
      ...pattern,
      score: result.score,
      reasons: result.reasons,
      severity: scoreToSeverity(result.score, config),
    });
  }
}
