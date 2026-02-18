import { prisma } from "@/lib/prisma";
import { Award, BadgeCheck, FileBadge2 } from "lucide-react";

export default async function CertificatesPage() {
    const [examResultsCount, topResults, latestExams] = await Promise.all([
        prisma.examResult.count(),
        prisma.examResult.findMany({
            orderBy: { marksObtained: "desc" },
            include: {
                student: true,
                exam: true,
                subject: true,
            },
            take: 6,
        }),
        prisma.exam.findMany({
            orderBy: { startDate: "desc" },
            include: { class: true },
            take: 4,
        }),
    ]);

    return (
        <div className="space-y-10 pb-10">
            <div className="rounded-[3rem] border border-white/5 bg-slate-900 p-12">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-fuchsia-300">
                        <Award size={14} className="fill-fuchsia-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Credentials Atelier</span>
                    </div>
                    <h2 className="font-plus-jakarta text-5xl font-black italic leading-[0.9] tracking-tight text-white">
                        Certificate & Merit <br />
                        <span className="bg-gradient-to-r from-fuchsia-300 to-violet-400 bg-clip-text text-transparent">Fabrication.</span>
                    </h2>
                    <p className="max-w-2xl text-sm font-medium tracking-tight text-slate-400">
                        Transforming assessment outcomes into verified student milestones with an audit-friendly ledger.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Result Records</p>
                    <p className="mt-4 font-plus-jakarta text-3xl font-black italic tracking-tight text-slate-900">{examResultsCount}</p>
                </div>
                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Latest Exams</p>
                    <p className="mt-4 font-plus-jakarta text-3xl font-black italic tracking-tight text-slate-900">{latestExams.length}</p>
                </div>
                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Top Performers</p>
                    <p className="mt-4 font-plus-jakarta text-3xl font-black italic tracking-tight text-slate-900">{topResults.length}</p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <BadgeCheck className="text-emerald-600" size={20} />
                        <h3 className="font-plus-jakarta text-2xl font-black italic tracking-tight text-slate-900">Merit Candidates</h3>
                    </div>
                    {topResults.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm font-medium text-slate-500">
                            No exam results available. Generate exam records to unlock merit rankings.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {topResults.map((result) => (
                                <div key={result.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-4">
                                    <p className="text-sm font-black text-slate-900">
                                        {result.student.firstName} {result.student.lastName}
                                    </p>
                                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                        {result.exam.name} - {result.subject.name}
                                    </p>
                                    <p className="mt-2 text-xs font-black text-emerald-600">
                                        Score: {result.marksObtained}/{result.totalMarks} ({result.grade || "N/A"})
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <FileBadge2 className="text-brand-indigo" size={20} />
                        <h3 className="font-plus-jakarta text-2xl font-black italic tracking-tight text-slate-900">Recent Exam Windows</h3>
                    </div>
                    {latestExams.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm font-medium text-slate-500">
                            No exam windows configured yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {latestExams.map((exam) => (
                                <div key={exam.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-4">
                                    <p className="text-sm font-black text-slate-900">{exam.name}</p>
                                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                        {exam.class.name} - {exam.type.replace("_", " ")}
                                    </p>
                                    <p className="mt-2 text-xs font-medium text-slate-500">
                                        {new Date(exam.startDate).toLocaleDateString()} to {new Date(exam.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
