"use client";

import { motion } from "framer-motion";
import {
    Users,
    Zap,
    CheckCircle2,
    TrendingUp,
    UserRound,
    DollarSign,
    ArrowUpRight
} from "lucide-react";
import { StatCard } from "./stat-card";
import { DashboardCharts } from "./charts";
import { formatCurrency } from "@/lib/utils";

interface DashboardViewProps {
    totalStudents: number;
    totalEmployees: number;
    revenueAmount: number;
    absentStudents: { id: string; student: { firstName: string; lastName: string; admissionNo: string } }[];
    presentEmployees: { id: string; employee: { firstName: string; lastName: string; designation: string } }[];
}

export function DashboardView({
    totalStudents,
    totalEmployees,
    revenueAmount,
    absentStudents,
    presentEmployees,
}: DashboardViewProps) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
            {/* Welcome Banner - Editorial Hero */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-[3rem] p-12 shadow-premium relative overflow-hidden group border border-white/5"
            >
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-3 bg-white/5 text-brand-indigo px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
                            <Zap size={14} className="fill-brand-indigo" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">ScholasticOS 2.0 Real-time</span>
                        </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.9] font-plus-jakarta italic">
                            Redefining Institutional <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-violet">Intelligence.</span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-medium tracking-tight">
                            Your dashboard is optimized for precision. Currently managing <span className="text-white font-bold">{totalStudents} students</span> across <span className="text-white font-bold">42 active courses</span>. System health is optimal.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                                Executive Summary
                            </button>
                            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                                Institution Logs
                            </button>
                        </div>
                    </div>
                    <div className="shrink-0 relative">
                        <div className="w-64 h-64 bg-slate-800 rounded-[4rem] flex items-center justify-center p-12 backdrop-blur-2xl border border-white/5 rotate-3 hover:rotate-0 transition-transform duration-700">
                            <div className="w-full h-full bg-premium-gradient rounded-[2.5rem] flex items-center justify-center shadow-2xl relative overflow-hidden">
                                <Users className="text-white" size={64} />
                                <div className="absolute top-0 right-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-4 -top-4 p-5 glass rounded-3xl border border-white/20 shadow-premium"
                        >
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 size={24} className="text-white" />
                            </div>
                        </motion.div>
                    </div>
                </div>
                {/* Background mesh */}
                <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(circle_at_70%_0%,rgba(79,70,229,0.15),transparent)] pointer-events-none"></div>
            </motion.div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    label="Active Students"
                    value={totalStudents.toLocaleString()}
                    subValue="+8% GROWTH"
                    icon={Users}
                    variant="blue"
                />
                <StatCard
                    label="School Staff"
                    value={totalEmployees.toLocaleString()}
                    subValue="98% DUTY"
                    icon={UserRound}
                    variant="indigo"
                />
                <StatCard
                    label="Net Revenue"
                    value={formatCurrency(revenueAmount)}
                    subValue="+12K TODAY"
                    icon={TrendingUp}
                    variant="pink"
                />
                <StatCard
                    label="Profit Margin"
                    value="42.5%"
                    subValue="HEALTHY"
                    icon={DollarSign}
                    variant="emerald"
                />
            </div>

            {/* Main Bento Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left Section: Institutional Performance (8 cols) */}
                <div className="xl:col-span-8 flex flex-col gap-10">
                    <div className="glass p-12 rounded-[3rem] shadow-premium flex flex-col gap-10">
                        <div className="flex justify-between items-end">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight font-plus-jakarta italic">Institutional Performance</h3>
                                <p className="text-sm text-slate-400 font-medium tracking-tight">Real-time academic vs financial synthesis.</p>
                            </div>
                            <button className="flex items-center gap-3 text-brand-indigo font-black text-[11px] uppercase tracking-widest group px-6 py-3 bg-slate-50 rounded-2xl transition-all hover:bg-slate-100">
                                System Report <ArrowUpRight size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <DashboardCharts />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Attendance Widgets */}
                        <div className="glass rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-50 transition-all hover:shadow-xl">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center px-10">
                                <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] italic">Absentee Monitoring</h3>
                                <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center font-black">
                                    {absentStudents.length}
                                </div>
                            </div>
                            <div className="p-10">
                                {absentStudents.length > 0 ? (
                                    <div className="space-y-6">
                                        {absentStudents.slice(0, 3).map((att) => (
                                            <div key={att.id} className="flex items-center justify-between group/item">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center font-black text-[13px] shadow-sm italic ring-4 ring-white">
                                                        {att.student.firstName[0]}{att.student.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-slate-900 tracking-tighter">{att.student.firstName} {att.student.lastName}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1 italic">Class: {att.student.admissionNo}</p>
                                                    </div>
                                                </div>
                                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">All students present</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="glass rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-50 transition-all hover:shadow-xl">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center px-10">
                                <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] italic">On-Duty Registry</h3>
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center font-black animate-pulse">
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                            <div className="p-10">
                                {presentEmployees.length > 0 ? (
                                    <div className="space-y-6">
                                        {presentEmployees.slice(0, 3).map((att) => (
                                            <div key={att.id} className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-[13px] shadow-lg italic">
                                                    {att.employee.firstName[0]}{att.employee.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-slate-900 tracking-tighter">{att.employee.firstName} {att.employee.lastName}</p>
                                                    <p className="text-[10px] text-brand-indigo uppercase font-black tracking-widest mt-1 italic">{att.employee.designation}</p>
                                                </div>
                                                <div className="ml-auto flex items-center gap-2">
                                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center font-medium italic text-slate-400 text-xs">Awaiting check-ins...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Intelligence Widgets (4 cols) */}
                <div className="xl:col-span-4 space-y-10">
                    {/* Financial Intelligence Bento */}
                    <div className="glass rounded-[3rem] shadow-premium overflow-hidden group p-2">
                        <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white space-y-10 relative overflow-hidden">
                            <div className="flex justify-between items-center relative z-10">
                                <h3 className="font-black text-white text-xs uppercase tracking-[0.3em] italic">Yield Monitor</h3>
                                <TrendingUp className="text-emerald-400" size={20} />
                            </div>

                            <div className="flex flex-col items-center py-4 relative z-10">
                                <div className="text-center">
                                    <p className="text-6xl font-black tracking-tighter italic font-plus-jakarta leading-none">75.4%</p>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-4 italic">Efficiency Ratio</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-[3px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "75%" }}
                                        transition={{ duration: 2 }}
                                        className="h-full bg-premium-gradient rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                                    />
                                </div>
                                <div className="flex justify-between px-2">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">Projection Target</p>
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest italic">85%</p>
                                </div>
                            </div>

                            {/* Background Elements */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-indigo/20 blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 blur-[80px] translate-y-1/2 -translate-x-1/2 opacity-50"></div>
                        </div>
                    </div>

                    {/* Quick Scheduler Bento */}
                    <div className="glass rounded-[3rem] p-10 shadow-premium group hover:bg-slate-900 transition-all duration-700 cursor-pointer border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 bg-slate-50 group-hover:bg-white/10 rounded-[2rem] flex flex-col items-center justify-center text-slate-900 group-hover:text-white transition-all duration-700 font-plus-jakarta italic shrink-0 ring-4 ring-slate-100/50 group-hover:ring-white/5">
                                <span className="text-[11px] font-black uppercase leading-none mb-1 opacity-50 tracking-widest">Feb</span>
                                <span className="text-3xl font-black leading-none">17</span>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black text-brand-indigo group-hover:text-brand-indigo uppercase tracking-[0.2em] italic">System Scheduler</h4>
                                <p className="text-[15px] font-bold text-slate-900 group-hover:text-white tracking-tighter leading-snug transition-colors duration-700">Executive Briefing: <br />Annual Curriculum Audit</p>
                            </div>
                        </div>
                    </div>

                    {/* System Pulse Card */}
                    <div className="bg-emerald-500 rounded-[3rem] p-10 shadow-premium text-white relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <Zap size={20} className="fill-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Pulse</span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-2xl font-black tracking-tighter italic font-plus-jakarta">System Integrity</h4>
                                <p className="text-sm font-bold opacity-80 tracking-tight">All core services performing at sub-50ms latency.</p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-24 opacity-20 pointer-events-none overflow-hidden">
                            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                                <path d="M0 20 Q 25 24 50 20 T 100 20 L 100 24 L 0 24 Z" fill="white" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
