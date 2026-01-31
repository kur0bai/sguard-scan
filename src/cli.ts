#!/usr/bin/env node

import { Command } from "commander";
import { scanProject } from "./scan";
import { loadConfig } from "@src/config/load";
import { initProject } from "@src/config/init";

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

  program
    .command("init")
    .description("Create a default .sguardrc.yml configuration file")
    .action(runInit);

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

function runInit(): void {
  try {
    initProject(process.cwd());
  } catch (error) {
    console.error("❌ sguard init failed:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
