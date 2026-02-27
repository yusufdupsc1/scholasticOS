// src/app/dashboard/grades/page.tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getGrades, getGradeDistribution } from "@/server/actions/grades";
import { getSubjects } from "@/server/actions/classes";
import { GradesClient } from "@/components/grades/grades-client";
import { TableSkeleton } from "@/components/ui/skeletons";
import { safeLoader } from "@/lib/server/safe-loader";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Grades" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; subjectId?: string; term?: string }>;
}

export default async function GradesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth();
  const institutionId = (session?.user as { institutionId?: string } | undefined)?.institutionId;
  if (!institutionId) return null;

  const page = Number(params.page) || 1;
  const search = params.search || "";
  const subjectId = params.subjectId || "";
  const term = params.term || "";

  const data = await safeLoader(
    "DASHBOARD_GRADES_DATA",
    () => getGrades({ page, search, subjectId, term }),
    { grades: [], total: 0, pages: 1, page },
    { institutionId, page, subjectId, term },
  );
  const subjects = await safeLoader(
    "DASHBOARD_GRADES_SUBJECTS",
    () => getSubjects(),
    [],
    { institutionId },
  );
  const distribution = await safeLoader(
    "DASHBOARD_GRADES_DISTRIBUTION",
    () => getGradeDistribution(),
    [],
    { institutionId },
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Suspense fallback={<TableSkeleton />}>
        <GradesClient
          grades={data.grades}
          subjects={subjects}
          distribution={distribution}
          total={data.total}
          pages={data.pages}
          currentPage={page}
        />
      </Suspense>
    </div>
  );
}
