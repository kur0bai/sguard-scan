export function reportFinding(file: string, line: number, finding: any) {
  console.log(
    `[${finding.severity} | score=${finding.score}] ` +
      `${file}:${line} ${finding.description}`,
  );

  for (const reason of finding.reasons) {
    const sign = reason.value > 0 ? "+" : "";
    console.log(`  ${sign}${reason.value} → ${reason.description}`);
  }
}
