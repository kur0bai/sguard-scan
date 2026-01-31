#!/usr/bin/env node

import { Command } from "commander";
import { scanProject } from "./scan";
import { loadConfig } from "@src/config/load";

function main(): void {
  const program = new Command();

  program
    .name("sguard")
    .description("Detect secrets in your code before commit")
    .version("0.1.0");

  program
    .command("scan")
    .alias("s")
    .description("Scan the current project for leaked secrets")
    .action(runScan);

  program.parse(process.argv);
}

function runScan(): void {
  try {
    const root = process.cwd();
    const config = loadConfig(root);

    scanProject(root, config);
  } catch (error) {
    console.error("❌ sguard failed:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
