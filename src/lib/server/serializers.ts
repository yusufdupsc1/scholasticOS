export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  if (typeof value === "bigint") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  if (value && typeof value === "object" && "toString" in value) {
    const parsed = Number((value as { toString: () => string }).toString());
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function toNullableNumber(value: unknown): number | null {
  if (value == null) return null;
  return toNumber(value, 0);
}

export function toIsoDate(
  value: Date | string | null | undefined,
): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function normalizeGroupCount(value: unknown): number {
  if (typeof value === "number") return value;

  if (
    value &&
    typeof value === "object" &&
    "_all" in value &&
    typeof (value as { _all?: unknown })._all !== "undefined"
  ) {
    return toNumber((value as { _all: unknown })._all, 0);
  }

  return 0;
}

export function asPlainArray<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
