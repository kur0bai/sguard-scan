import chalk from "chalk";

export function reportFinding(file: string, line: number, pattern: any) {
  console.log(
    `${chalk.red("[!]")} ${file}: Line ${line} - ` +
      `${chalk.bold(`[${pattern.severity}]`)} ${pattern.description}`,
  );
}
