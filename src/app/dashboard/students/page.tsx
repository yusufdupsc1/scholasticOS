import { prisma } from "@/lib/prisma";
import { StudentsTable } from "@/components/dashboard/students-table";
import { Users } from "lucide-react";

export default async function StudentsPage() {
    const [students, classes] = await Promise.all([
        prisma.student.findMany({
            include: {
                class: true,
            },
            orderBy: {
                admissionDate: "desc",
            },
        }),
        prisma.class.findMany({
            orderBy: {
                name: "asc",
            },
        }),
    ]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
            {/* Editorial Header */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 border border-white/5 group">
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-3 bg-white/5 text-brand-indigo px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
                        <Users size={14} className="fill-brand-indigo" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Students Registry</span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.9] font-plus-jakarta italic">
                        Institutional <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-violet">Records.</span>
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-medium tracking-tight">
                        Managing <span className="text-white font-bold">{students.length} active enrollments</span> with real-time academic integrity.
                    </p>
                </div>
                <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.1),transparent)] pointer-events-none" />
            </div>

            <StudentsTable students={students} classes={classes} />
        </div>
    );
}
