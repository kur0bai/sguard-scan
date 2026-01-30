import fs from "fs";
import path from "path";
import ignore from "ignore";

export function loadGitignore(root: string) {
  const ig = ignore();
  const gitignorePath = path.join(root, ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    ig.add(fs.readFileSync(gitignorePath, "utf8"));
  }

  return ig;
}
