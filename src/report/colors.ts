import chalk from "chalk";
import { SeverityLevel } from "../types/severity";

export function severityColor(
  severity: SeverityLevel,
): (text: string) => string {
  switch (severity) {
    case SeverityLevel.HIGH:
      return chalk.red;
    case SeverityLevel.MEDIUM:
      return chalk.yellow;
    case SeverityLevel.LOW:
      return chalk.blue;
    default:
      return chalk.white;
  }
}
