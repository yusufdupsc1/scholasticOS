"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    Users,
    GraduationCap,
    BookOpen,
    CreditCard,
    Banknote,
    ClipboardCheck,
    Calendar,
    Home,
    UserRound,
    MessageSquare,
    Smartphone,
    Video,
    FileQuestion,
    FileText,
    FileBadge,
    PieChart,
    ShoppingBag,
    ChevronRight,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
    {
        group: "MAIN", items: [
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
            { name: "Homework", icon: Home, href: "/dashboard/homework" },
        ]
    },
    {
        group: "FINANCIAL", items: [
            { name: "Accounts", icon: CreditCard, href: "/dashboard/accounts" },
            { name: "Fees", icon: Banknote, href: "/dashboard/fees" },
            { name: "Salary", icon: ShoppingBag, href: "/dashboard/salary" },
        ]
    },
    {
        group: "COMMUNICATION", items: [
            { name: "Messaging", icon: MessageSquare, href: "/dashboard/messaging" },
            { name: "SMS Services", icon: Smartphone, href: "/dashboard/sms" },
            { name: "Live Class", icon: Video, href: "/dashboard/live-class" },
        ]
    },
    {
        group: "EXAMS & REPORTS", items: [
            { name: "Question Paper", icon: FileQuestion, href: "/dashboard/question-paper" },
            { name: "Exams", icon: FileText, href: "/dashboard/exams" },
            { name: "Reports", icon: PieChart, href: "/dashboard/reports" },
            { name: "Certificates", icon: FileBadge, href: "/dashboard/certificates" },
        ]
    },
    {
        group: "SYSTEM", items: [
            { name: "General Settings", icon: Settings, href: "/dashboard/settings" },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen bg-[#1e266d] text-white transition-all duration-300 z-50 flex flex-col",
            collapsed ? "w-20" : "w-64"
        )}>
            <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">e</div>
                        <span className="font-bold text-xl tracking-tight">eSkooly</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 hover:bg-white/10 rounded-lg"
                >
                    {collapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-6">
                {menuItems.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                        {!collapsed && (
                            <h3 className="text-xs font-semibold text-white/40 px-3 tracking-wider uppercase mb-2">
                                {group.group}
                            </h3>
                        )}
                        {group.items.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                                    pathname === item.href
                                        ? "bg-blue-600 text-white"
                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon size={20} className={cn(
                                    "shrink-0",
                                    pathname === item.href ? "text-white" : "text-white/70 group-hover:text-white"
                                )} />
                                {!collapsed && <span className="text-[14px] font-medium">{item.name}</span>}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            {!collapsed && (
                <div className="p-4 bg-white/5 m-3 rounded-xl border border-white/10 shrink-0">
                    <p className="text-xs text-white/60 text-center mb-2">Need More Advance?</p>
                    <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors">
                        Try Demo
                    </button>
                </div>
            )}
        </aside>
    );
}
