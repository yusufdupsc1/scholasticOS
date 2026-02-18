"use client";

import { Activity, Database, Globe, Network, Server, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function SystemHealth() {
    // Simulated metrics
    const [metrics, setMetrics] = useState({
        dbLatency: 12,
        apiResponse: 45,
        uptime: 99.98,
        cacheHit: 82,
        memoryUsage: 45,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                dbLatency: Math.max(5, prev.dbLatency + (Math.random() > 0.5 ? 2 : -2)),
                apiResponse: Math.max(20, prev.apiResponse + (Math.random() > 0.5 ? 5 : -5)),
                uptime: 99.99,
                cacheHit: Math.min(99, Math.max(70, prev.cacheHit + (Math.random() > 0.5 ? 3 : -3))),
                memoryUsage: Math.min(90, Math.max(30, prev.memoryUsage + (Math.random() > 0.5 ? 4 : -4))),
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0f172a] rounded-[2rem] p-6 text-white shadow-xl border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 z-10 relative">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                        <Activity size={16} /> System Telemetry
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono mt-1">Live monitoring of infrastructure vitals.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase font-bold text-green-500 tracking-wider">Operational</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-10 relative">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <Database size={16} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                        <span className="text-[10px] text-gray-500 font-mono">ms</span>
                    </div>
                    <p className="text-2xl font-mono font-bold">{metrics.dbLatency}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">DB Latency</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <Server size={16} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                        <span className="text-[10px] text-gray-500 font-mono">%</span>
                    </div>
                    <p className="text-2xl font-mono font-bold">{metrics.memoryUsage}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Mem Usage</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <Zap size={16} className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
                        <span className="text-[10px] text-gray-500 font-mono">%</span>
                    </div>
                    <p className="text-2xl font-mono font-bold">{metrics.cacheHit}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Cache Hit</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <Network size={16} className="text-gray-400 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-[10px] text-gray-500 font-mono">ms</span>
                    </div>
                    <p className="text-2xl font-mono font-bold">{metrics.apiResponse}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">API RT</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <Globe size={12} className="text-blue-500" />
                        Region: <span className="text-white">sfo1</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-green-500" />
                        End-to-End Encrypted
                    </span>
                </div>
                <span>v0.1.0-beta</span>
            </div>

            {/* Background Effects */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute left-0 bottom-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
}
