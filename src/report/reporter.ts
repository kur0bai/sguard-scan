import chalk from "chalk";
import { FindingReport } from "../types/report";
import { severityColor } from "./colors";
import { formatReason } from "./style";

export function reportFinding(
  file: string,
  line: number,
  finding: FindingReport,
): void {
  const color = severityColor(finding.severity);

  const header = chalk.bold(
    color(`[${finding.severity} | score=${finding.score}]`),
  );

  const location = chalk.gray(`${file}:${line}`);

  console.log(`${header} ${location}  ${chalk.bold(finding.description)}`);

  for (const reason of finding.reasons) {
    console.log(formatReason(reason));
  }

  console.log();
}
