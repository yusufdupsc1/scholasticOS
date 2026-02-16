import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import {
    Users,
    UserRound,
    TrendingUp,
    DollarSign,
    CheckCircle2,
    XCircle,
    Clock,
    Calendar
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DashboardCharts } from "@/components/dashboard/charts";

export default async function DashboardPage() {
    // Fetch data for the dashboard
    const [
        totalStudents,
        totalEmployees,
        totalRevenue,
        totalProfit,
        newAdmissions,
        absentStudents,
        presentEmployees,
        attendanceToday
    ] = await Promise.all([
        prisma.student.count(),
        prisma.employee.count(),
        prisma.feePayment.aggregate({
            _sum: { amount: true },
            where: { status: "paid" }
        }),
        prisma.feePayment.aggregate({
            _sum: { amount: true },
            where: { status: "paid" }
        }), // Simplify profit as revenue for now
        prisma.student.findMany({
            orderBy: { admissionDate: 'desc' },
            take: 5,
            include: { class: true }
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
        prisma.attendance.count({
            where: { date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
        })
    ]);

    const revenueAmount = totalRevenue._sum.amount || 0;
    const profitAmount = totalProfit._sum.amount || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Students"
                    value={totalStudents}
                    subValue={totalStudents}
                    icon={Users}
                    variant="blue"
                />
                <StatCard
                    label="Total Employees"
                    value={totalEmployees}
                    subValue={0}
                    icon={UserRound}
                    variant="indigo"
                />
                <StatCard
                    label="Revenue"
                    value={formatCurrency(revenueAmount)}
                    subValue={formatCurrency(0)}
                    icon={TrendingUp}
                    variant="pink"
                />
                <StatCard
                    label="Total Profit"
                    value={formatCurrency(profitAmount)}
                    subValue={formatCurrency(0)}
                    icon={DollarSign}
                    variant="orange"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Welcome and Charts */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Welcome Banner */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                        <div className="z-10 flex-1">
                            <h2 className="text-2xl font-bold text-[#1e266d]">Welcome to Admin Dashboard</h2>
                            <p className="text-gray-500 mt-2 max-w-lg">
                                Your account is verified! <span className="inline-flex items-center gap-1 text-green-600 font-semibold">👍</span><br />
                                Enjoy World&apos;s No.1 Education Software. You have full access to management features.
                            </p>
                        </div>
                        <div className="z-10 shrink-0">
                            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center relative overflow-hidden ring-4 ring-blue-50/50">
                                <UserRound size={64} className="text-blue-500 mt-4" />
                            </div>
                        </div>
                        {/* Background pattern */}
                        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700 opacity-50"></div>
                    </div>

                    {/* Charts Widget */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <DashboardCharts />
                    </div>

                    {/* Bottom lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Today Absent Students */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center px-6">
                                <h3 className="font-bold text-gray-800">Today Absent Students</h3>
                                <XCircle size={18} className="text-red-500" />
                            </div>
                            <div className="p-6">
                                {absentStudents.length > 0 ? (
                                    <div className="space-y-4">
                                        {absentStudents.map((att) => (
                                            <div key={att.id} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs uppercase">
                                                    {att.student.firstName[0]}{att.student.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{att.student.firstName} {att.student.lastName}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Admission: {att.student.admissionNo}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-gray-400">
                                        <p className="text-sm italic">Attendance Not Marked Yet !</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Today Present Employees */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center px-6">
                                <h3 className="font-bold text-gray-800">Today Present Employees</h3>
                                <CheckCircle2 size={18} className="text-green-500" />
                            </div>
                            <div className="p-6">
                                {presentEmployees.length > 0 ? (
                                    <div className="space-y-4">
                                        {presentEmployees.map((att) => (
                                            <div key={att.id} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs uppercase">
                                                    {att.employee.firstName[0]}{att.employee.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{att.employee.firstName} {att.employee.lastName}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{att.employee.designation}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-gray-400">
                                        <p className="text-sm italic">Attendance Not Marked Yet !</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* New Admissions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:col-span-2">
                            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center px-6">
                                <h3 className="font-bold text-gray-800">New Admissions</h3>
                                <Clock size={18} className="text-blue-500" />
                            </div>
                            <div className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50">
                                                <th className="px-6 py-3">Admission No</th>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">Class</th>
                                                <th className="px-6 py-3">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {newAdmissions.map((student) => (
                                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-xs font-mono font-bold text-blue-600">{student.admissionNo}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.firstName} {student.lastName}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{student.class.name}</td>
                                                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(student.admissionDate).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Mini Widgets */}
                <div className="space-y-8">
                    {/* Estimated Fee Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 px-6">
                            <h3 className="font-bold text-gray-800 text-sm italic">Estimated Fee This Month</h3>
                        </div>
                        <div className="p-8 flex flex-col items-center">
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="#2563eb" strokeWidth="12" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" />
                                </svg>
                                <div className="absolute text-center">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Estimation</p>
                                    <p className="text-2xl font-bold text-gray-900">৳ 100K</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                    <p className="text-[10px] uppercase font-bold text-blue-400">Collections</p>
                                    <p className="text-lg font-bold text-blue-700">৳ 75K</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                                    <p className="text-[10px] uppercase font-bold text-orange-400">Remaining</p>
                                    <p className="text-lg font-bold text-orange-700">৳ 25K</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bars Widget */}
                    <div className="bg-[#1e266d] rounded-2xl p-8 shadow-lg text-white space-y-8">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-white/60">Today Present Students</span>
                                <span className="text-xs font-bold">85%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-white/60">Today Present Employees</span>
                                <span className="text-xs font-bold">94%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-white/60">This Month Fee Collection</span>
                                <span className="text-xs font-bold">75%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar placeholder */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-80 flex flex-col items-center justify-center text-center">
                        <Calendar size={48} className="text-blue-500 mb-4 opacity-20" />
                        <p className="font-bold text-gray-800">FEBRUARY, 2026</p>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Interactive Scheduler</p>
                        <div className="grid grid-cols-7 gap-2 mt-6 w-full opacity-40">
                            {[...Array(31)].map((_, i) => (
                                <div key={i} className="aspect-square flex items-center justify-center text-[10px] font-bold rounded-lg hover:bg-gray-100 cursor-pointer">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
