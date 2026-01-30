import fg from "fast-glob";
import fs from "fs";
import path from "path";
import { loadGitignore } from "./gitignore";
import patterns from "../patterns/secrets.json";
import { reportFinding } from "./reporter";

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
      patterns.forEach((p) => {
        const regex = new RegExp(p.regex);
        if (regex.test(line)) {
          reportFinding(file, index + 1, p);
        }
      });
    });
  });
}
