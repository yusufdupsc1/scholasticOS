"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    GraduationCap,
    BookOpen,
    Banknote,
    ClipboardCheck,
    Calendar,
    Home,
    UserRound,
    FileText,
    FileBadge,
    PieChart,
    ShoppingBag,
    ChevronRight,
    Menu,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

const menuItems = [
    {
        group: "CORE", items: [
            { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        ]
    },
    {
        group: "ACADEMIC", items: [
            { name: "Classes", icon: Home, href: "/dashboard/classes" },
            { name: "Subjects", icon: BookOpen, href: "/dashboard/subjects" },
            { name: "Students", icon: GraduationCap, href: "/dashboard/students" },
            { name: "Employees", icon: UserRound, href: "/dashboard/employees" },
            { name: "Attendance", icon: ClipboardCheck, href: "/dashboard/attendance" },
            { name: "Timetable", icon: Calendar, href: "/dashboard/timetable" },
        ]
    },
    {
        group: "FINANCE", items: [
            { name: "Fees", icon: Banknote, href: "/dashboard/fees" },
            { name: "Salary", icon: ShoppingBag, href: "/dashboard/salary" },
        ]
    },
    {
        group: "RESULTS", items: [
            { name: "Exams", icon: FileText, href: "/dashboard/exams" },
            { name: "Reports", icon: PieChart, href: "/dashboard/reports" },
            { name: "Certificates", icon: FileBadge, href: "/dashboard/certificates" },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={cn(
            "fixed left-6 top-6 bottom-6 transition-all duration-700 z-50 flex flex-col group/sidebar",
            "glass shadow-premium rounded-[2.5rem] overflow-hidden",
            collapsed ? "w-24" : "w-72"
        )}>
            {/* Logo Section */}
            <div className="p-8 flex items-center justify-between shrink-0">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-12 h-12 bg-premium-gradient rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/30 rotate-3">S</div>
                        <div className="flex flex-col">
                            <span className="font-plus-jakarta font-black text-xl tracking-tighter text-brand-slate leading-none">Scholastic</span>
                            <span className="text-[10px] font-black text-brand-indigo tracking-[0.2em] uppercase mt-1">OS 2.0</span>
                        </div>
                    </motion.div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-brand-indigo shadow-sm"
                >
                    {collapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 space-y-10">
                {menuItems.map((group, idx) => (
                    <div key={idx} className="space-y-4">
                        {!collapsed && (
                            <h3 className="text-[10px] font-black text-slate-400 px-5 tracking-[0.25em] uppercase opacity-70">
                                {group.group}
                            </h3>
                        )}
                        <div className="space-y-1.5 px-2">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                                            isActive
                                                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <item.icon size={20} className={cn(
                                            "shrink-0 transition-all duration-500 group-hover:rotate-6",
                                            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                                        )} />
                                        {!collapsed && (
                                            <span className="text-[14px] font-bold tracking-tight font-plus-jakarta">{item.name}</span>
                                        )}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-nav-glow"
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section: Pro Badge */}
            <div className="p-6 mt-auto">
                <div className="p-6 bg-slate-900 rounded-[2rem] relative overflow-hidden group/card shadow-2xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black text-white/50 tracking-[0.2em] uppercase">Enterprise</span>
                        </div>
                        <p className="text-sm font-bold text-white mb-4 leading-relaxed font-plus-jakarta">Unlock the full power of ScholasticOS</p>
                        <button className="w-full py-3.5 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                            Get Access
                        </button>
                    </div>
                    {/* Decorative Gradients */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-indigo/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-violet/20 blur-2xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>
            </div>
        </aside>
    );
}
