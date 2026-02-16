"use client";

import { DataTable } from "@/components/shared/data-table";
import { cn, formatCurrency } from "@/lib/utils";
import { Banknote, Clock, CheckCircle, AlertCircle } from "lucide-react";

export function FeesTable({ payments }: { payments: any[] }) {
    const columns = [
        {
            header: "Receipt #",
            accessorKey: "receiptNo" as const,
            cell: (item: any) => (
                <span className="font-mono font-bold text-gray-500 text-xs">
                    #{item.receiptNo || 'N/A'}
                </span>
            ),
        },
        {
            header: "Student",
            accessorKey: "student" as const,
            cell: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] border border-blue-100 uppercase">
                        {item.student.firstName[0]}{item.student.lastName[0]}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{item.student.firstName} {item.student.lastName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.student.class.name}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Fee Type",
            accessorKey: "feeStructure" as const,
            cell: (item: any) => (
                <span className="text-sm font-medium text-gray-700 capitalize">
                    {item.feeStructure.name}
                </span>
            ),
        },
        {
            header: "Month/Year",
            accessorKey: "month" as const,
            cell: (item: any) => (
                <span className="text-xs font-medium text-gray-600">
                    {item.month}, {item.year}
                </span>
            ),
        },
        {
            header: "Amount",
            accessorKey: "amount" as const,
            cell: (item: any) => (
                <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(item.amount)}
                </span>
            ),
        },
        {
            header: "Status",
            accessorKey: "status" as const,
            cell: (item: any) => (
                <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit border",
                    item.status === "paid" ? "bg-green-50 text-green-700 border-green-100" :
                        item.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                            "bg-red-50 text-red-700 border-red-100"
                )}>
                    {item.status === "paid" ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                    {item.status}
                </span>
            ),
        },
    ];

    return <DataTable title="Fee Collection History" columns={columns} data={payments} />;
}
