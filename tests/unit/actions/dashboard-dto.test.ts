import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDb = {
  teacher: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  fee: {
    findMany: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  },
  payment: {
    groupBy: vi.fn(),
  },
};

vi.mock("@/lib/db", () => ({
  db: mockDb,
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({
    user: {
      id: "user-1",
      institutionId: "inst-1",
      role: "ADMIN",
    },
  }),
}));

describe("dashboard action DTO normalization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getTeachers defaults invalid status to ACTIVE and normalizes salary/date", async () => {
    const { getTeachers } = await import("@/server/actions/teachers");

    mockDb.teacher.findMany.mockResolvedValue([
      {
        id: "t1",
        teacherId: "TCH-001",
        firstName: "Ayesha",
        lastName: "Rahman",
        email: "ayesha@example.com",
        phone: null,
        specialization: "Math",
        qualification: "MSc",
        salary: { toString: () => "55000.00" },
        status: "ACTIVE",
        joiningDate: new Date("2026-01-10T00:00:00.000Z"),
        subjects: [{ subject: { id: "s1", name: "Math", code: "MTH" } }],
        classTeacher: [{ name: "Class 8A" }],
      },
    ]);
    mockDb.teacher.count.mockResolvedValue(1);

    const result = await getTeachers({ status: "INVALID", page: 1 });

    expect(mockDb.teacher.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "ACTIVE" }),
      }),
    );
    expect(result.teachers[0].salary).toBe(55000);
    expect(result.teachers[0].joiningDate).toBe("2026-01-10T00:00:00.000Z");
  });

  it("getFees maps decimals/dates to plain values", async () => {
    const { getFees } = await import("@/server/actions/finance");

    mockDb.fee.findMany.mockResolvedValue([
      {
        id: "f1",
        title: "Tuition",
        amount: { toString: () => "2500.50" },
        dueDate: new Date("2026-03-01T00:00:00.000Z"),
        status: "UNPAID",
        feeType: "TUITION",
        term: "Term 1 2026",
        student: {
          firstName: "Karim",
          lastName: "Hasan",
          studentId: "STU-100",
        },
        payments: [
          {
            amount: { toString: () => "500.25" },
            paidAt: new Date("2026-02-20T00:00:00.000Z"),
            method: "CASH",
            receiptNumber: "R-1",
          },
        ],
      },
    ]);
    mockDb.fee.count.mockResolvedValue(1);

    const result = await getFees({ status: "BAD", page: 1 });

    expect(result.fees[0].amount).toBe(2500.5);
    expect(result.fees[0].dueDate).toBe("2026-03-01T00:00:00.000Z");
    expect(result.fees[0].payments[0].amount).toBe(500.25);
    expect(result.fees[0].payments[0].paidAt).toBe("2026-02-20T00:00:00.000Z");
    expect(mockDb.fee.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.not.objectContaining({ status: expect.anything() }),
      }),
    );
  });
});
