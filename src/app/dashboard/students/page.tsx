// src/app/dashboard/students/page.tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getStudents } from "@/server/actions/students";
import { db } from "@/lib/db";
import { StudentsTable } from "@/components/students/students-table";
import { StudentsHeader } from "@/components/students/students-header";
import { TableSkeleton } from "@/components/ui/skeletons";
import { safeLoader } from "@/lib/server/safe-loader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Students",
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    classId?: string;
    status?: string;
  }>;
}

export default async function StudentsPage({ searchParams }: PageProps) {
  const params = await searchParams; // Next.js 15+ — searchParams is a Promise
  const session = await auth();
  const institutionId = (session?.user as { institutionId?: string } | undefined)?.institutionId;
  if (!institutionId) {
    return null;
  }

  const page = Number(params.page) || 1;
  const search = params.search || "";
  const classId = params.classId || "";
  const status = params.status || "ACTIVE";

  const data = await safeLoader(
    "DASHBOARD_STUDENTS_DATA",
    () => getStudents({ page, search, classId, status }),
    { students: [], total: 0, pages: 1, page },
    { institutionId, page, classId, status },
  );
  const classes = await safeLoader(
    "DASHBOARD_STUDENTS_CLASSES",
    () =>
      db.class.findMany({
        where: { institutionId, isActive: true },
        select: { id: true, name: true, grade: true, section: true },
        orderBy: [{ grade: "asc" }, { section: "asc" }],
      }),
    [],
    { institutionId },
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <StudentsHeader total={data.total} />

      <Suspense fallback={<TableSkeleton />}>
        <StudentsTable
          students={data.students}
          classes={classes}
          total={data.total}
          pages={data.pages}
          currentPage={page}
        />
      </Suspense>
    </div>
  );
}
