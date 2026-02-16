"use client";

import { DataTable } from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { BookMarked, FlaskConical, Library } from "lucide-react";

export function SubjectsTable({ subjects }: { subjects: any[] }) {
    const columns = [
        {
            header: "Subject Code",
            accessorKey: "code" as const,
            cell: (item: any) => (
                <span className="font-mono font-bold text-blue-600 text-xs uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                    {item.code}
                </span>
            ),
        },
        {
            header: "Subject Name",
            accessorKey: "name" as const,
            cell: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        {item.type === 'theory' ? <Library size={16} className="text-gray-500" /> : <FlaskConical size={16} className="text-gray-500" />}
                    </div>
                    <span className="font-semibold text-gray-900">{item.name}</span>
                </div>
            ),
        },
        {
            header: "Type",
            accessorKey: "type" as const,
            cell: (item: any) => (
                <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
                    item.type === "theory" ? "bg-amber-50 text-amber-700 border-amber-100" :
                        item.type === "practical" ? "bg-purple-50 text-purple-700 border-purple-100" :
                            "bg-blue-50 text-blue-700 border-blue-100"
                )}>
                    {item.type}
                </span>
            ),
        },
        {
            header: "Classes",
            accessorKey: "_count" as const,
            cell: (item: any) => (
                <span className="text-xs font-medium text-gray-600">
                    Offered in {item._count?.classes || 0} Classes
                </span>
            ),
        },
    ];

    return <DataTable title="Curriculum Subjects" columns={columns} data={subjects} />;
}
