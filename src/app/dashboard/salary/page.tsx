import { prisma } from "@/lib/prisma";
import { DollarSign, Landmark, WalletCards } from "lucide-react";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(amount);
}

export default async function SalaryPage() {
    const [employeesCount, paidAggregate, pendingAggregate, latestPayments] = await Promise.all([
        prisma.employee.count(),
        prisma.salaryPayment.aggregate({
            where: { status: "paid" },
            _sum: { netSalary: true },
        }),
        prisma.salaryPayment.aggregate({
            where: { status: "pending" },
            _sum: { netSalary: true },
        }),
        prisma.salaryPayment.findMany({
            include: { employee: true },
            orderBy: { createdAt: "desc" },
            take: 8,
        }),
    ]);

    const paidAmount = paidAggregate._sum.netSalary ?? 0;
    const pendingAmount = pendingAggregate._sum.netSalary ?? 0;

    return (
        <div className="space-y-10 pb-10">
            <div className="rounded-[3rem] border border-white/5 bg-slate-900 p-12">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-amber-300">
                        <WalletCards size={14} className="fill-amber-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Payroll Orbit</span>
                    </div>
                    <h2 className="font-plus-jakarta text-5xl font-black italic leading-[0.9] tracking-tight text-white">
                        Compensation <br />
                        <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">Control Room.</span>
                    </h2>
                    <p className="max-w-xl text-sm font-medium tracking-tight text-slate-400">
                        Monitoring liquidity for <span className="font-black text-white">{employeesCount} staff members</span> with
                        predictable payroll visibility.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { label: "Total Paid", value: formatCurrency(paidAmount), icon: DollarSign, tone: "text-emerald-600" },
                    { label: "Pending Payroll", value: formatCurrency(pendingAmount), icon: Landmark, tone: "text-amber-600" },
                    { label: "Recent Payouts", value: `${latestPayments.length}`, icon: WalletCards, tone: "text-blue-600" },
                ].map((item) => (
                    <div key={item.label} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                            <item.icon size={18} className={item.tone} />
                        </div>
                        <p className="mt-4 font-plus-jakarta text-3xl font-black italic tracking-tight text-slate-900">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                <h3 className="font-plus-jakarta text-2xl font-black italic tracking-tight text-slate-900">Latest Salary Records</h3>
                {latestPayments.length === 0 ? (
                    <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm font-medium text-slate-500">
                        No salary records yet. Add payroll entries to start tracking payout momentum.
                    </p>
                ) : (
                    <div className="mt-6 space-y-3">
                        {latestPayments.map((payment) => (
                            <div key={payment.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-4">
                                <div>
                                    <p className="text-sm font-black text-slate-900">
                                        {payment.employee.firstName} {payment.employee.lastName}
                                    </p>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                        {payment.month}/{payment.year} - {payment.employee.designation}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">{formatCurrency(payment.netSalary)}</p>
                                    <p className={`text-[11px] font-black uppercase tracking-widest ${payment.status === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                                        {payment.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
