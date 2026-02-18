"use client";

import { Search, Filter, MoreVertical, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface DataTableProps<T> {
    columns: {
        header: string;
        accessorKey: keyof T;
        cell?: (item: T) => React.ReactNode;
    }[];
    data: T[];
    title: string;
    onAdd?: () => void;
    addButtonText?: string;
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    title,
    onAdd,
    addButtonText = "Add New"
}: DataTableProps<T>) {
    return (
        <div className="glass rounded-[2.5rem] shadow-premium overflow-hidden border border-white/10">
            <div className="p-10 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-12">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight font-plus-jakarta italic">{title}</h2>
                    <p className="text-[13px] text-slate-400 font-medium tracking-tight mt-1 opacity-80 italic">Precision management of {title.toLowerCase()}.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group/search">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-brand-indigo transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-brand-indigo outline-none w-full sm:w-72 transition-all"
                        />
                    </div>
                    <button className="p-3 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl text-slate-600 hover:bg-white hover:text-brand-indigo transition-all shadow-sm">
                        <Filter size={18} />
                    </button>
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 shrink-0"
                        >
                            <Plus size={18} />
                            <span>{addButtonText}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-12 py-5">{col.header}</th>
                            ))}
                            <th className="px-12 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.length > 0 ? data.map((item, index) => (
                            <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-brand-indigo/[0.02] transition-colors group"
                            >
                                {columns.map((col, idx) => (
                                    <td key={idx} className="px-12 py-6">
                                        {col.cell ? col.cell(item) : (
                                            <span className="text-[14px] font-bold text-slate-700 tracking-tight">
                                                {String(item[col.accessorKey] || "")}
                                            </span>
                                        )}
                                    </td>
                                ))}
                                <td className="px-12 py-6 text-right">
                                    <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-brand-indigo transition-all">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-12 py-20 text-center text-slate-400 font-bold italic tracking-widest text-xs uppercase opacity-50">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between px-12">
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest italic opacity-70">
                    Showing <span className="text-slate-900">{data.length}</span> records
                </p>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 bg-white uppercase tracking-widest transition-all disabled:opacity-50" disabled>Prev</button>
                    <button className="px-5 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black text-slate-900 bg-white hover:bg-slate-900 hover:text-white uppercase tracking-widest transition-all shadow-sm">Next</button>
                </div>
            </div>
        </div>
    );
}
