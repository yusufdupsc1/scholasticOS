"use client";

import { DataTable } from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export function ClassesTable({ classes }: { classes: any[] }) {
    const columns = [
        {
            header: "Class Name",
            accessorKey: "name" as const,
            cell: (item: any) => (
                <span className="font-bold text-gray-900">{item.name}</span>
            ),
        },
        {
            header: "Section",
            accessorKey: "section" as const,
            cell: (item: any) => (
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-bold text-gray-600 border border-gray-200">
                    Section {item.section}
                </span>
            ),
        },
        {
            header: "Class Teacher",
            accessorKey: "classTeacher" as const,
            cell: (item: any) => (
                item.classTeacher ? (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                            <User size={12} className="text-blue-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {item.classTeacher.firstName} {item.classTeacher.lastName}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400 italic">Not Assigned</span>
                )
            ),
        },
        {
            header: "Capacity",
            accessorKey: "capacity" as const,
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{item.capacity} Seats</span>
                </div>
            ),
        },
        {
            header: "Students",
            accessorKey: "_count" as const,
            cell: (item: any) => (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {item._count?.students || 0} Enrolled
                </span>
            ),
        },
    ];

    return <DataTable title="Classes & Sections" columns={columns} data={classes} />;
}
