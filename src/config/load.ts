import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { DEFAULT_CONFIG } from "./default";
import { SguardConfig } from "../types/config";

export function loadConfig(root: string): SguardConfig {
  const configPath = path.join(root, ".sguardrc.yml");

  if (!fs.existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  const userConfig = yaml.load(
    fs.readFileSync(configPath, "utf8"),
  ) as Partial<SguardConfig>;

  return deepMerge(DEFAULT_CONFIG, userConfig);
}

function deepMerge<T>(base: T, override?: Partial<T>): T {
  if (!override) return base;

  const result: any = { ...base };

  for (const key in override) {
    if (typeof override[key] === "object" && !Array.isArray(override[key])) {
      result[key] = deepMerge((base as any)[key], override[key] as any);
    } else {
      result[key] = override[key];
    }
  }

  return result;
}
