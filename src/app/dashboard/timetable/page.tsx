import { prisma } from "@/lib/prisma";
import { CalendarClock, MapPin, Sparkles } from "lucide-react";

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function TimetablePage() {
    const slots = await prisma.timetable.findMany({
        include: {
            class: true,
            subject: true,
            teacher: true,
        },
        orderBy: [{ day: "asc" }, { startTime: "asc" }],
        take: 60,
    });

    const sortedSlots = [...slots].sort((a, b) => {
        const dayDelta = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayDelta !== 0) return dayDelta;
        return a.startTime.localeCompare(b.startTime);
    });

    const activeDays = new Set(sortedSlots.map((slot) => slot.day)).size;

    return (
        <div className="space-y-10 pb-10">
            <div className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900 p-12">
                <div className="relative z-10 space-y-5">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-cyan-300">
                        <CalendarClock size={14} className="fill-cyan-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Rhythm Engine</span>
                    </div>
                    <h2 className="font-plus-jakarta text-5xl font-black italic leading-[0.9] tracking-tight text-white">
                        Weekly Learning <br />
                        <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Cadence.</span>
                    </h2>
                    <p className="max-w-xl text-sm font-medium tracking-tight text-slate-400">
                        Coordinating <span className="font-black text-white">{sortedSlots.length} instructional slots</span> across
                        <span className="font-black text-white"> {activeDays} weekdays</span> with teacher and room visibility.
                    </p>
                </div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-full bg-[radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.15),transparent)]" />
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                {sortedSlots.length === 0 ? (
                    <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 px-8 py-16 text-center">
                        <Sparkles className="mx-auto mb-4 text-brand-indigo" size={24} />
                        <p className="font-plus-jakarta text-2xl font-black italic tracking-tight text-slate-900">No timetable slots yet</p>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Seed timetable entries to activate this planning canvas.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedSlots.map((slot) => (
                            <div
                                key={slot.id}
                                className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-6 py-5 md:grid-cols-[140px_170px_1fr_1fr]"
                            >
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Day</p>
                                    <p className="mt-1 text-sm font-black text-slate-900">{slot.day}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Window</p>
                                    <p className="mt-1 text-sm font-black text-slate-900">{slot.startTime} - {slot.endTime}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Class & Subject</p>
                                    <p className="mt-1 text-sm font-black text-slate-900">{slot.class.name} - {slot.subject.name}</p>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Instructor</p>
                                        <p className="mt-1 text-sm font-black text-slate-900">
                                            {slot.teacher.firstName} {slot.teacher.lastName}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <MapPin size={12} /> {slot.room || "Room TBD"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
