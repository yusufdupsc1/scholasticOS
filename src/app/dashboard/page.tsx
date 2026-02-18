import { prisma } from "@/lib/prisma";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
    const [
        totalStudents,
        totalEmployees,
        totalRevenue,
        absentStudents,
        presentEmployees,
    ] = await Promise.all([
        prisma.student.count(),
        prisma.employee.count(),
        prisma.feePayment.aggregate({
            _sum: { amount: true },
            where: { status: "paid" }
        }),
        prisma.attendance.findMany({
            where: {
                date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                status: "absent"
            },
            include: { student: true }
        }),
        prisma.employeeAttendance.findMany({
            where: {
                date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                status: "present"
            },
            include: { employee: true }
        }),
    ]);

    const revenueAmount = totalRevenue._sum.amount || 0;

    return (
        <DashboardView
            totalStudents={totalStudents}
            totalEmployees={totalEmployees}
            revenueAmount={revenueAmount}
            absentStudents={absentStudents}
            presentEmployees={presentEmployees}
        />
    );
}
