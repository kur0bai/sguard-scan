#!/usr/bin/env node

import { Command } from "commander";
import { scanProject } from "./scan";

const program = new Command();

program
  .name("sguard")
  .description("Detecta secretos en tu código antes de hacer commit")
  .version("0.1.0");

program
  .command("scan")
  .description("Escanea el proyecto en busca de secretos")
  .action(() => {
    scanProject(process.cwd());
  });

program.parse();
