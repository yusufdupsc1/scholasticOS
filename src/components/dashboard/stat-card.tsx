"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
    label: string;
    value: string | number;
    subValue?: string | number;
    icon: LucideIcon;
    variant: "blue" | "indigo" | "pink" | "orange" | "emerald";
}

const variants = {
    blue: {
        bg: "bg-blue-500/10",
        icon: "text-blue-600",
        glow: "shadow-blue-500/10"
    },
    indigo: {
        bg: "bg-brand-indigo/10",
        icon: "text-brand-indigo",
        glow: "shadow-brand-indigo/10"
    },
    pink: {
        bg: "bg-rose-500/10",
        icon: "text-rose-600",
        glow: "shadow-rose-500/10"
    },
    orange: {
        bg: "bg-orange-500/10",
        icon: "text-orange-600",
        glow: "shadow-orange-500/10"
    },
    emerald: {
        bg: "bg-emerald-500/10",
        icon: "text-emerald-600",
        glow: "shadow-emerald-500/10"
    }
};

export function StatCard({ label, value, subValue, icon: Icon, variant }: StatCardProps) {
    const style = variants[variant];

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className={cn(
                "glass p-8 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500",
                style.glow
            )}
        >
            <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div className={cn("p-4 rounded-2xl transition-all duration-500 group-hover:rotate-6", style.bg)}>
                        <Icon className={cn("w-6 h-6", style.icon)} />
                    </div>
                    {subValue && (
                        <div className="px-3 py-1 bg-slate-900 rounded-full">
                            <span className="text-[10px] font-black text-white italic tracking-wider">{subValue}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight font-plus-jakarta italic">{value}</h3>
                </div>
            </div>

            {/* Decorative Element */}
            <div className={cn("absolute -right-6 -bottom-6 w-24 h-24 blur-[64px] rounded-full transition-all duration-1000 group-hover:scale-150", style.bg)} />
        </motion.div>
    );
}
