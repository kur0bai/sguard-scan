import fg from "fast-glob";
import fs from "fs";
import path from "path";
import { loadGitignore } from "@src/gitignore";
import patterns from "@patterns/secrets.json";
import { reportFinding } from "@src/reporter";
import { shannonEntropy } from "@src/entropy";
import { SeverityLevel } from "@types/severity";

export function scanProject(root: string) {
  const ig = loadGitignore(root);

  const files = fg.sync(["**/*"], {
    cwd: root,
    onlyFiles: true,
    dot: true,
  });

  files.forEach((file) => {
    if (ig.ignores(file)) return;

    const fullPath = path.join(root, file);
    const content = fs.readFileSync(fullPath, "utf8");

    content.split("\n").forEach((line, index) => {
      patterns.forEach((pattern) => {
        const regex = new RegExp(pattern.regex);

        // Aditional entropy
        if (pattern.entropy) {
          const value = line.match(regex)?.[0] || "";
          if (shannonEntropy(value) < 3.5) return;
        }

        const isComment =
          line.trim().startsWith("//") ||
          line.trim().startsWith("#") ||
          line.trim().startsWith("/*");

        if (isComment && pattern.confidence !== SeverityLevel.HIGH) return;

        if (regex.test(line)) {
          reportFinding(file, index + 1, pattern);
        }
      });
    });
  });
}
