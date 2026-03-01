import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ classId?: string; date?: string }>;
}

export default async function AttendancePrintPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth();
  const currentUser = session?.user as
    | { id?: string; institutionId?: string }
    | undefined;
  const institutionId = currentUser?.institutionId;

  if (!institutionId) {
    redirect("/auth/login");
  }

  const classId = params.classId;
  const dateParam = params.date;

  if (!classId || !dateParam) {
    return (
      <main className="print-a4 p-4">
        <p className="text-sm">Missing class/date parameters.</p>
      </main>
    );
  }

  const date = new Date(dateParam);
  date.setHours(0, 0, 0, 0);

  const [institution, classroom, students, attendanceRows] = await Promise.all([
    db.institution.findUnique({
      where: { id: institutionId },
      select: { name: true, address: true },
    }),
    db.class.findFirst({
      where: { id: classId, institutionId, isActive: true },
      select: { id: true, name: true, grade: true, section: true },
    }),
    db.student.findMany({
      where: { institutionId, classId, status: "ACTIVE" },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
      },
    }),
    db.attendance.findMany({
      where: { institutionId, classId, date },
      select: { studentId: true, status: true },
    }),
  ]);

  if (!classroom) {
    return (
      <main className="print-a4 p-4">
        <p className="text-sm">Class not found.</p>
      </main>
    );
  }

  const attendanceMap = new Map(attendanceRows.map((row) => [row.studentId, row.status]));

  if (currentUser?.id) {
    try {
      await db.auditLog.create({
        data: {
          action: "PRINT_ATTENDANCE_REGISTER",
          entity: "AttendanceRegister",
          entityId: classroom.id,
          newValues: {
            classId: classId,
            date: dateParam,
          },
          userId: currentUser.id,
        },
      });
    } catch (error) {
      console.error("[ATTENDANCE_PRINT_AUDIT]", error);
    }
  }

  return (
    <main className="print-a4 text-slate-900">
      <header className="mb-4 border-b border-slate-300 pb-3 text-center">
        <h1 className="text-xl font-bold">উপস্থিতি রেজিস্টার</h1>
        <p className="text-xs text-slate-600">Attendance Register</p>
        <p className="mt-2 text-sm font-semibold">{institution?.name ?? "Dhadash School"}</p>
        <p className="text-xs text-slate-600">{institution?.address ?? "Bangladesh"}</p>
      </header>

      <section className="mb-4 grid grid-cols-2 gap-2 text-sm">
        <p>
          <span className="font-semibold">শ্রেণি:</span> {classroom.name}
        </p>
        <p>
          <span className="font-semibold">Class:</span> {classroom.grade}
        </p>
        <p>
          <span className="font-semibold">শাখা:</span> {classroom.section}
        </p>
        <p>
          <span className="font-semibold">তারিখ:</span> {dateParam}
        </p>
      </section>

      <table className="w-full border-collapse text-sm table-dense">
        <thead>
          <tr>
            <th className="border border-slate-400 px-2 py-2 text-left">ক্রমিক</th>
            <th className="border border-slate-400 px-2 py-2 text-left">শিক্ষার্থী (Student)</th>
            <th className="border border-slate-400 px-2 py-2 text-left">আইডি</th>
            <th className="border border-slate-400 px-2 py-2 text-center">উপস্থিত</th>
            <th className="border border-slate-400 px-2 py-2 text-center">অনুপস্থিত</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const status = attendanceMap.get(student.id) ?? "PRESENT";
            const present = status === "PRESENT" || status === "LATE";
            const absent = status === "ABSENT";

            return (
              <tr key={student.id}>
                <td className="border border-slate-300 px-2 py-2">{index + 1}</td>
                <td className="border border-slate-300 px-2 py-2">
                  {student.firstName} {student.lastName}
                </td>
                <td className="border border-slate-300 px-2 py-2">{student.studentId}</td>
                <td className="border border-slate-300 px-2 py-2 text-center">{present ? "✓" : ""}</td>
                <td className="border border-slate-300 px-2 py-2 text-center">{absent ? "✓" : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <footer className="mt-10 grid grid-cols-2 gap-8 text-center text-sm">
        <div>
          <p className="pt-10">....................................</p>
          <p className="font-semibold">শ্রেণি শিক্ষক</p>
          <p className="text-xs text-slate-600">Class Teacher</p>
        </div>
        <div>
          <p className="pt-10">....................................</p>
          <p className="font-semibold">প্রধান শিক্ষক</p>
          <p className="text-xs text-slate-600">Head Teacher</p>
        </div>
      </footer>
    </main>
  );
}
