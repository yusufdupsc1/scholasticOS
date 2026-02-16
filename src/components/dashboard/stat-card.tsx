import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    subValue: string | number;
    icon: LucideIcon;
    variant: "blue" | "indigo" | "pink" | "orange";
}

const variants = {
    blue: "bg-[#2563eb]",
    indigo: "bg-[#4f46e5]",
    pink: "bg-[#d946ef]",
    orange: "bg-[#ea580c]"
};

export function StatCard({ label, value, subValue, icon: Icon, variant }: StatCardProps) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-[1.02]",
            variants[variant]
        )}>
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-white/80 font-medium text-sm lg:text-base tracking-wide uppercase">{label}</p>
                    <h3 className="text-3xl lg:text-4xl font-bold">{value}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                    <Icon size={28} className="text-white" />
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10 uppercase tracking-widest text-[10px] sm:text-[11px] font-bold">
                <span className="text-white/60">This Month</span>
                <span className="text-white font-mono">{subValue}</span>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>
    );
}
