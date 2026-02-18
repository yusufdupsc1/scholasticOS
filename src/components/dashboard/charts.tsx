"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

const performanceData = [
    { name: "Sep", income: 4000, expenses: 2400 },
    { name: "Oct", income: 3200, expenses: 1800 },
    { name: "Nov", income: 4500, expenses: 2800 },
    { name: "Dec", income: 5200, expenses: 3100 },
    { name: "Jan", income: 4800, expenses: 2600 },
    { name: "Feb", income: 6100, expenses: 2900 },
];

const studentData = [
    { name: "Class 1", students: 45 },
    { name: "Class 2", students: 52 },
    { name: "Class 3", students: 48 },
    { name: "Class 4", students: 61 },
    { name: "Class 5", students: 55 },
    { name: "Class 6", students: 42 },
];

export function DashboardCharts() {
    return (
        <div className="space-y-12">
            <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                    <div>
                        <h3 className="text-slate-900 font-black uppercase tracking-[0.25em] text-[10px] italic">Strategic Growth</h3>
                        <p className="text-[11px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Revenue Synthesis 2024</p>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-brand-indigo rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Revenue</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-brand-violet rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]"></div>
                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Burn Rate</span>
                        </div>
                    </div>
                </div>
                <div className="h-80 w-full px-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.5} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }}
                            />
                            <Tooltip
                                cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                                contentStyle={{
                                    borderRadius: '1.5rem',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '1.5rem',
                                    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(20px)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#4f46e5"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5 shadow-xl' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke="#7c3aed"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorExpenses)"
                                dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#7c3aed' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-8 pt-12 border-t border-slate-50">
                <div className="flex justify-between items-center px-4">
                    <div>
                        <h3 className="text-slate-900 font-black uppercase tracking-[0.25em] text-[10px] italic">Enrollment Pulse</h3>
                        <p className="text-[11px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Demographic Distribution</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] uppercase font-black text-slate-900 tracking-widest italic">Live Monitor</span>
                    </div>
                </div>
                <div className="h-72 w-full px-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={studentData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.5} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }}
                                dy={15}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: '#f8fafc', radius: 12 }}
                                contentStyle={{
                                    borderRadius: '1.25rem',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                    background: 'rgba(15, 23, 42, 0.95)',
                                    color: '#fff'
                                }}
                            />
                            <Bar
                                dataKey="students"
                                fill="#0f172a"
                                radius={[12, 12, 0, 0]}
                                barSize={48}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
