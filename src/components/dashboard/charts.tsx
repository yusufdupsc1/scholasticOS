"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";

const performanceData = [
    { name: "Sep 2025", income: 4000, expenses: 2400 },
    { name: "Oct 2025", income: 3000, expenses: 1398 },
    { name: "Nov 2025", income: 2000, expenses: 9800 },
    { name: "Dec 2025", income: 2780, expenses: 3908 },
    { name: "Jan 2026", income: 1890, expenses: 4800 },
    { name: "Feb 2026", income: 2390, expenses: 3800 },
];

const studentData = [
    { name: "Class One", students: 45 },
    { name: "Class Two", students: 52 },
    { name: "Class Three", students: 48 },
    { name: "Class Four", students: 61 },
    { name: "Class Five", students: 55 },
    { name: "Class Six", students: 42 },
    { name: "Class Seven", students: 38 },
];

export function DashboardCharts() {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[11px] italic">Statistics: Expenses vs Income</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-pink-400 rounded-sm"></div>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Expenses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Income</span>
                        </div>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expenses"
                                stroke="#f472b6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#f472b6', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#60a5fa"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#60a5fa', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[11px] italic">Statistics: Students per Class</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Students</span>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={studentData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                width={80}
                            />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar
                                dataKey="students"
                                fill="#3b82f6"
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
