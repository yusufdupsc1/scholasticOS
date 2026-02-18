"use client";

import { DataTable } from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { User, ShieldCheck } from "lucide-react";

interface ClassTeacher {
    firstName: string;
    lastName: string;
}

interface Class {
    id: string;
    name: string;
    section: string | null;
    capacity: number;
    classTeacher: ClassTeacher | null;
    _count: {
        students: number;
    };
}

export function ClassesTable({ classes }: { classes: Class[] }) {
    const columns = [
        {
            header: "Class Name",
            accessorKey: "name" as const,
            cell: (item: Class) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-brand-indigo/5 text-brand-indigo flex items-center justify-center border border-brand-indigo/10 shadow-sm backdrop-blur-md">
                        <ShieldCheck size={22} className="fill-brand-indigo/20" />
                    </div>
                    <div>
                        <p className="text-[15px] font-black text-slate-900 tracking-tight leading-tight italic">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-0.5 opacity-70">Academic Tier</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Section",
            accessorKey: "section" as const,
            cell: (item: Class) => (
                <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 shadow-premium">
                    Dept {item.section}
                </span>
            ),
        },
        {
            header: "Class Teacher",
            accessorKey: "classTeacher" as const,
            cell: (item: Class) => (
                item.classTeacher ? (
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-violet/5 flex items-center justify-center border border-brand-violet/10 group-hover:scale-110 transition-transform">
                            <User size={16} className="text-brand-violet" />
                        </div>
                        <div>
                            <p className="text-[13px] font-black text-slate-700 leading-none tracking-tight">
                                {item.classTeacher.firstName} {item.classTeacher.lastName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 opacity-60">Lead Mentor</p>
                        </div>
                    </div>
                ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Unassigned</span>
                )
            ),
        },
        {
            header: "Allocation",
            accessorKey: "_count" as const,
            cell: (item: Class) => {
                const enrollment = item._count?.students || 0;
                const percentage = Math.round((enrollment / item.capacity) * 100);
                return (
                    <div className="space-y-3 w-40">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{enrollment} Capacity</span>
                            <span className="text-[10px] font-black text-brand-indigo italic">{percentage}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-[2px] border border-slate-200">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]",
                                    percentage > 90 ? "bg-rose-500" : "bg-gradient-to-r from-brand-indigo to-brand-violet"
                                )}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Status",
            accessorKey: "id" as const,
            cell: () => (
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Live Status</span>
                </div>
            )
        }
    ];

    return <DataTable title="Campus Architecture: Academic Classes" columns={columns} data={classes} />;
}
