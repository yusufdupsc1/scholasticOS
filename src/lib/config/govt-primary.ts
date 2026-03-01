export const PRIMARY_GRADES = ["1", "2", "3", "4", "5"] as const;

export function isGovtPrimaryModeEnabled(): boolean {
  const raw =
    process.env.GOVT_PRIMARY_MODE ??
    process.env.NEXT_PUBLIC_GOVT_PRIMARY_MODE ??
    "true";

  return raw === "true";
}

export function isPrimaryGrade(value?: string | null): boolean {
  if (typeof value !== "string") return false;
  return PRIMARY_GRADES.includes(value.trim() as (typeof PRIMARY_GRADES)[number]);
}

export function assertPrimaryGrade(value?: string | null): void {
  if (!isPrimaryGrade(value)) {
    throw new Error("Only Class 1 to Class 5 is supported in Govt Primary mode.");
  }
}

export function getPrimaryGradeOptions() {
  return PRIMARY_GRADES.map((grade) => ({
    grade,
    labelBn: `শ্রেণি ${grade}`,
    labelEn: `Class ${grade}`,
  }));
}
