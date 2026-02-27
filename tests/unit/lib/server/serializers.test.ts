import { describe, expect, it } from "vitest";
import {
  asPlainArray,
  normalizeGroupCount,
  toIsoDate,
  toNullableNumber,
  toNumber,
} from "@/lib/server/serializers";

describe("server serializers", () => {
  it("converts decimal-like values to numbers", () => {
    expect(toNumber({ toString: () => "123.45" })).toBe(123.45);
    expect(toNullableNumber({ toString: () => "99" })).toBe(99);
    expect(toNullableNumber(null)).toBeNull();
  });

  it("normalizes group count shapes", () => {
    expect(normalizeGroupCount(7)).toBe(7);
    expect(normalizeGroupCount({ _all: 5 })).toBe(5);
    expect(normalizeGroupCount({})).toBe(0);
  });

  it("serializes dates safely", () => {
    expect(toIsoDate(new Date("2026-02-27T00:00:00.000Z"))).toBe(
      "2026-02-27T00:00:00.000Z",
    );
    expect(toIsoDate("2026-02-27T00:00:00.000Z")).toBe(
      "2026-02-27T00:00:00.000Z",
    );
    expect(toIsoDate("invalid-date")).toBeNull();
  });

  it("returns arrays and defaults to empty", () => {
    expect(asPlainArray([1, 2, 3])).toEqual([1, 2, 3]);
    expect(asPlainArray(null)).toEqual([]);
    expect(asPlainArray(undefined)).toEqual([]);
  });
});
