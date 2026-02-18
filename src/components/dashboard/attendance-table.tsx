"use client";

import { DataTable } from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { UserCheck, UserX, Clock } from "lucide-react";

interface AttendanceRecord {
    id: string;
    date: Date;
    status: string;
    remarks: string | null;
    student: {
        firstName: string;
        lastName: string;
        admissionNo: string;
        class: { name: string };
    };
}

export function AttendanceTable({ attendance }: { attendance: AttendanceRecord[] }) {
    const columns = [
        {
            header: "Date",
            accessorKey: "date" as const,
            cell: (item: AttendanceRecord) => (
                <span className="text-xs font-medium text-gray-600">
                    {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
            ),
        },
        {
            header: "Student",
            accessorKey: "student" as const,
            cell: (item: AttendanceRecord) => (
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
            header: "Status",
            accessorKey: "status" as const,
            cell: (item: AttendanceRecord) => (
                <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit border",
                    item.status === "present" ? "bg-green-50 text-green-700 border-green-100" :
                        item.status === "absent" ? "bg-red-50 text-red-700 border-red-100" :
                            "bg-amber-50 text-amber-700 border-amber-100"
                )}>
                    {item.status === "present" ? <UserCheck size={10} /> : item.status === "absent" ? <UserX size={10} /> : <Clock size={10} />}
                    {item.status}
                </span>
            ),
        },
        {
            header: "Remarks",
            accessorKey: "remarks" as const,
            cell: (item: AttendanceRecord) => (
                <span className="text-xs text-gray-500 italic max-w-[150px] truncate block">
                    {item.remarks || '--'}
                </span>
            ),
        },
    ];

    return (
        <DataTable
            title="Daily Attendance Log"
            columns={columns}
            data={attendance}
            onAdd={() => alert("Attendance marking module coming soon!")}
            addButtonText="Mark Attendance"
        />
    );
}
