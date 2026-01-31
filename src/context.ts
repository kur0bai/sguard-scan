import { ContextSignals } from "./types/context";

export function detectContext(file: string, line: string): ContextSignals {
  const lower = file.toLowerCase();

  const isXml = lower.endsWith(".xml");
  const isYaml = lower.endsWith(".yml") || lower.endsWith(".yaml");
  const isEnv = lower.endsWith(".env");
  const isPipeline =
    lower.includes(".github/") ||
    lower.includes("gitlab") ||
    lower.includes("ci");

  const isAndroid =
    lower.includes("android") || lower.endsWith("androidmanifest.xml");

  const isIos = lower.includes("ios/");
  const isFrontend = lower.includes("src") || lower.includes("web");

  return {
    fileType: isXml
      ? "manifest"
      : isEnv || isYaml
        ? "config"
        : isPipeline
          ? "pipeline"
          : "code",

    runtime: isAndroid || isIos || isFrontend ? "client" : "server",

    platform: isAndroid
      ? "android"
      : isIos
        ? "ios"
        : isPipeline
          ? "devops"
          : "backend",

    assignmentStyle: isXml || isYaml ? "markup" : isEnv ? "env" : "code",
  };
}
