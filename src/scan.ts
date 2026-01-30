import fg from "fast-glob";
import fs from "fs";
import path from "path";

import { loadGitignore } from "@src/gitignore";
import { reportFinding } from "@src/reporter";
import { NOISYPATHS } from "@src/types/path";
import { PATTERNS } from "@src/patterns";

import { passesEntropyCheck, passesContextChecks } from "@src/heuristics";

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

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!!line) {
        for (const pattern of PATTERNS) {
          const match = line.match(pattern.compiled);
          if (!match) continue;

          const value = match[0];

          if (!passesEntropyCheck(value, pattern)) continue;
          if (!passesContextChecks(line, pattern)) continue;

          reportFinding(file, i + 1, pattern);
        }
      }
    }
  }
}
