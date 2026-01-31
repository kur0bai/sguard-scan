import fg from "fast-glob";
import fs from "fs";
import path from "path";

import { loadGitignore } from "@src/gitignore";
import { reportFinding } from "@src/reporter";
import { NOISYPATHS } from "@src/types/path";
import { PATTERNS } from "@src/patterns";

import { calculateScore } from "@src/scoring";
import { scoreToSeverity } from "@src/severity";
import { MIN_SCORE_TO_REPORT } from "@src/constants/scoring";

export function scanProject(root: string): void {
  const ig = loadGitignore(root);

  const files = fg.sync("**/*", {
    cwd: root,
    onlyFiles: true,
    dot: true,
  });

  for (const file of files) {
    if (ig.ignores(file)) continue;
    if (NOISYPATHS.some((p) => file.includes(p))) continue;

    const fullPath = path.join(root, file);
    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split("\n");

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber];
      if (!!line) {
        if (!line.trim()) continue;

        for (const pattern of PATTERNS) {
          const match = line.match(pattern.compiled);
          if (!match) continue;

          const value = match[0];

          const result = calculateScore(line, value, file, pattern);

          if (result.score < MIN_SCORE_TO_REPORT) continue;

          reportFinding(file, lineNumber + 1, {
            ...pattern,
            score: result.score,
            reasons: result.reasons,
            severity: scoreToSeverity(result.score),
          });
        }
      }
    }
  }
}
