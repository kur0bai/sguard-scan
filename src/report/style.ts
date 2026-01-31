import chalk from "chalk";
import { ScoreReason } from "../types/scoring";

export function formatReason(reason: ScoreReason): string {
  const sign = reason.value > 0 ? "+" : "";
  const color =
    reason.value > 0
      ? chalk.green
      : reason.value < 0
        ? chalk.gray
        : chalk.white;

  return `  ${color(`${sign}${reason.value}`)}  ${chalk.dim(
    reason.description ?? reason.id,
  )}`;
}
