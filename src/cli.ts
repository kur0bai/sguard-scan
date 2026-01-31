#!/usr/bin/env node

import { Command } from "commander";
import { scanProject } from "./scan";

const program = new Command();

program
  .name("sguard")
  .description("Detect secrets in your code before commit")
  .version("0.1.0");

program
  .command("scan")
  .description("Scan your project looking for your secrets")
  .action(() => {
    scanProject(process.cwd());
  });

program.parse();
