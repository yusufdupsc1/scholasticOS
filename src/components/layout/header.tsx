"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Bell,
    Search,
    Mail,
    LogOut,
    ChevronDown
} from "lucide-react";

import { motion } from "framer-motion";

export function Header() {
    const router = useRouter();
    const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse user', e);
            }
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error('Logout error', e);
        }
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const userName = user?.name || 'System Admin';
    const userRole = user?.role || 'Super Control';
    const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <header className="h-24 px-8 fixed top-6 right-6 left-6 lg:left-[calc(18rem+3rem)] transition-all z-40">
            <div className="h-full glass shadow-premium rounded-[2.5rem] flex items-center justify-between px-10">
                <div className="flex items-center gap-8 w-full max-w-xl">
                    <div className="relative w-full group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-indigo transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search records, students, financials..."
                            className="w-full bg-transparent border-none py-4 pl-8 pr-4 text-[13px] font-bold text-slate-600 focus:ring-0 outline-none transition-all placeholder:text-slate-400 placeholder:font-bold"
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-100 bg-slate-50/50">
                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Search</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden xl:flex items-center gap-2 pr-6 border-r border-slate-100">
                        {[
                            { icon: Mail, notify: true },
                            { icon: Bell, notify: true },
                        ].map((item, i) => (
                            <button key={i} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all hover:scale-110 active:scale-95 relative group">
                                <item.icon size={18} className="group-hover:text-slate-900 transition-colors" />
                                {item.notify && (
                                    <span className="absolute top-3 right-3 w-2 h-2 bg-brand-violet rounded-full border-2 border-white shadow-sm ring-4 ring-brand-violet/10 animate-pulse"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-4 py-2 pl-2 pr-5 rounded-3xl hover:bg-slate-50 transition-all group cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white font-black text-sm shadow-xl group-hover:rotate-6 transition-transform overflow-hidden ring-4 ring-slate-50">
                                {initials}
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-[13px] font-black text-slate-900 leading-none font-plus-jakarta">{userName}</p>
                                <p className="text-[9px] text-brand-indigo mt-1.5 uppercase tracking-[0.2em] font-black">{userRole}</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-500 ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="absolute right-0 top-full mt-4 w-64 glass shadow-premium rounded-3xl p-3 z-50 overflow-hidden"
                            >
                                <div className="px-4 py-4 border-b border-slate-50 mb-2">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Account</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                                >
                                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    Sign Out Securely
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
