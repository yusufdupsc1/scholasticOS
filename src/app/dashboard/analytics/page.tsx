// src/app/dashboard/analytics/page.tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAttendanceSummary, getAttendanceTrend } from "@/server/actions/attendance";
import { getGradeDistribution } from "@/server/actions/grades";
import { getFinanceSummary } from "@/server/actions/finance";
import { AnalyticsClient } from "@/components/analytics/analytics-client";
import { ChartSkeleton } from "@/components/ui/skeletons";
import { safeLoader } from "@/lib/server/safe-loader";
import { asPlainArray, normalizeGroupCount } from "@/lib/server/serializers";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await auth();
  const institutionId = (session?.user as { institutionId?: string } | undefined)?.institutionId;
  if (!institutionId) return null;

  const today = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const attendanceSummary = await safeLoader(
    "DASHBOARD_ANALYTICS_ATTENDANCE_SUMMARY",
    () =>
      getAttendanceSummary({
        startDate: startDate.toISOString().slice(0, 10),
        endDate: today.toISOString().slice(0, 10),
      }),
    {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      presentRate: 0,
      breakdown: [],
    },
    { institutionId },
  );

  const attendanceTrend = await safeLoader(
    "DASHBOARD_ANALYTICS_ATTENDANCE_TREND",
    () => getAttendanceTrend({ days: 30 }),
    [],
    { institutionId },
  );

  const gradeDistribution = await safeLoader(
    "DASHBOARD_ANALYTICS_GRADE_DISTRIBUTION",
    () => getGradeDistribution(),
    [],
    { institutionId },
  );

  const financeSummary = await safeLoader(
    "DASHBOARD_ANALYTICS_FINANCE_SUMMARY",
    () => getFinanceSummary(),
    {
      totalFees: { amount: 0, count: 0 },
      paidFees: { amount: 0, count: 0 },
      pendingFees: { amount: 0, count: 0 },
      overdueCount: 0,
      monthlyRevenue: [],
    },
    { institutionId },
  );

  const rawStudentStats = await safeLoader(
    "DASHBOARD_ANALYTICS_STUDENT_STATS",
    () =>
      db.student.groupBy({
        by: ["status"],
        where: { institutionId },
        _count: true,
      }),
    [],
    { institutionId },
  );

  const rawTeacherStats = await safeLoader(
    "DASHBOARD_ANALYTICS_TEACHER_STATS",
    () =>
      db.teacher.groupBy({
        by: ["status"],
        where: { institutionId },
        _count: true,
      }),
    [],
    { institutionId },
  );

  const studentStats = asPlainArray(rawStudentStats).map((row) => ({
    status: row.status,
    _count: normalizeGroupCount(row._count),
  }));
  const teacherStats = asPlainArray(rawTeacherStats).map((row) => ({
    status: row.status,
    _count: normalizeGroupCount(row._count),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <Suspense fallback={<ChartSkeleton />}>
        <AnalyticsClient
          attendanceSummary={attendanceSummary}
          attendanceTrend={attendanceTrend}
          gradeDistribution={gradeDistribution}
          financeSummary={financeSummary}
          studentStats={studentStats}
          teacherStats={teacherStats}
        />
      </Suspense>
    </div>
  );
}
