import { prisma } from "@/lib/prisma";
import { AttendanceTable } from "@/components/dashboard/attendance-table";

export default async function AttendancePage() {
    const attendance = await prisma.attendance.findMany({
        include: {
            student: {
                include: { class: true }
            },
        },
        orderBy: {
            date: "desc",
        },
        take: 100
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Register</h1>
                    <p className="text-gray-500 text-sm">View and track student attendance records and participation.</p>
                </div>
            </div>

            <AttendanceTable attendance={attendance} />
        </div>
    );
}
