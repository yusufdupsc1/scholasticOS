"use client";

import { DataTable } from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { FlaskConical, Library, Shapes } from "lucide-react";

interface Subject {
    id: string;
    code: string | null;
    name: string;
    type: string;
    _count: {
        classes: number;
    };
}

export function SubjectsTable({ subjects }: { subjects: Subject[] }) {
    const columns = [
        {
            header: "Curriculum Code",
            accessorKey: "code" as const,
            cell: (item: Subject) => (
                <span className="font-mono font-black text-brand-indigo text-[10px] uppercase tracking-[0.2em] bg-brand-indigo/5 border border-brand-indigo/10 px-3 py-1.5 rounded-xl shadow-sm">
                    {item.code || "N/A"}
                </span>
            ),
        },
        {
            header: "Subject Identity",
            accessorKey: "name" as const,
            cell: (item: Subject) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                        {item.type === "theory" ? (
                            <Library size={18} className="text-amber-500 fill-amber-50" />
                        ) : (
                            <FlaskConical size={18} className="text-brand-violet fill-brand-violet/5" />
                        )}
                    </div>
                    <div>
                        <p className="font-black text-slate-900 tracking-tight italic leading-tight">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 opacity-60">Academic Unit</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Classification",
            accessorKey: "type" as const,
            cell: (item: Subject) => (
                <span className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-premium backdrop-blur-md italic",
                    item.type === "theory" ? "bg-amber-50/50 text-amber-700 border-amber-100/50" :
                        item.type === "practical" ? "bg-brand-violet/5 text-brand-violet border-brand-violet/10" :
                            "bg-brand-indigo/5 text-brand-indigo border-brand-indigo/10"
                )}>
                    {item.type} Space
                </span>
            ),
        },
        {
            header: "Distribution",
            accessorKey: "_count" as const,
            cell: (item: Subject) => (
                <div className="flex items-center gap-2">
                    <Shapes size={14} className="text-brand-indigo opacity-50" />
                    <span className="text-[11px] font-black text-slate-500 italic">
                        {item._count?.classes || 0} Specializations
                    </span>
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "id" as const,
            cell: () => (
                <div className="h-1.5 w-12 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
            )
        }
    ];

    return <DataTable title="Curriculum Mastery: Subjects" columns={columns} data={subjects} />;
}
