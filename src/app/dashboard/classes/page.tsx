import { prisma } from "@/lib/prisma";
import { ClassesTable } from "@/components/dashboard/classes-table";
import { BookOpen } from "lucide-react";

export default async function ClassesPage() {
    const classes = await prisma.class.findMany({
        include: {
            classTeacher: true,
            _count: {
                select: { students: true }
            }
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
            {/* Editorial Header */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 border border-white/5 group">
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-3 bg-white/5 text-emerald-400 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
                        <BookOpen size={14} className="fill-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Academic Structure</span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.9] font-plus-jakarta italic">
                        Academic <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Architecture.</span>
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-medium tracking-tight">
                        Orchestrating <span className="text-white font-bold">{classes.length} active classrooms</span> across the institution.
                    </p>
                </div>
                <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.1),transparent)] pointer-events-none" />
            </div>

            <ClassesTable classes={classes} />
        </div>
    );
}
