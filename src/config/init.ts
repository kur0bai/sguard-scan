import fs from "fs";
import path from "path";
import { CONFIG_TEMPLATE } from "@src/config/template";

export function initProject(root: string): void {
  const configPath = path.join(root, ".sguardrc.yml");

  if (fs.existsSync(configPath)) {
    console.log("⚠ .sguardrc.yml already exists. Aborting.");
    return;
  }

  fs.writeFileSync(configPath, CONFIG_TEMPLATE, {
    encoding: "utf8",
  });

  console.log("✔ .sguardrc.yml created");
}
