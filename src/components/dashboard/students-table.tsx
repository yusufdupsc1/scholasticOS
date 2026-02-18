"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/shared/modal";
import { StudentForm } from "@/components/dashboard/student-form";
import { useRouter } from "next/navigation";
import { Phone, BookOpen, Fingerprint } from "lucide-react";

interface Student {
    id: string;
    admissionNo: string;
    firstName: string;
    lastName: string;
    gender: string;
    rollNo: string;
    class: { name: string };
    guardianName: string;
    guardianRelation: string;
    phone: string | null;
    status: string;
}

interface StudentsTableProps {
    students: Student[];
    classes: { id: string; name: string }[];
}

export function StudentsTable({ students, classes }: StudentsTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const columns = [
        {
            header: "Identity ID",
            accessorKey: "admissionNo" as const,
            cell: (item: Student) => (
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-brand-indigo/5 text-brand-indigo rounded-xl border border-brand-indigo/10 font-mono font-black text-[10px] tracking-widest shadow-sm">
                    <Fingerprint size={12} />
                    {item.admissionNo}
                </div>
            ),
        },
        {
            header: "Academic Entity",
            accessorKey: "firstName" as const,
            cell: (item: Student) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-violet text-white flex items-center justify-center font-black text-xs uppercase shadow-premium group-hover:scale-105 transition-all">
                        {item.firstName[0]}{item.lastName[0]}
                    </div>
                    <div>
                        <p className="text-[15px] font-black text-slate-900 tracking-tight leading-tight italic">{item.firstName} {item.lastName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-0.5 opacity-70 italic">{item.gender} Enrollee</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Placement",
            accessorKey: "rollNo" as const,
            cell: (item: Student) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <BookOpen size={16} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[13px] font-black text-slate-700 leading-tight uppercase tracking-tight">{item.class.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 opacity-60">Roll: {item.rollNo}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Legal Guardian",
            accessorKey: "guardianName" as const,
            cell: (item: Student) => (
                <div>
                    <p className="text-[13px] font-black text-slate-700 tracking-tight italic">{item.guardianName}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 opacity-60 italic">{item.guardianRelation} Auth</p>
                </div>
            ),
        },
        {
            header: "Contact Uplink",
            accessorKey: "phone" as const,
            cell: (item: Student) => (
                <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={14} className="opacity-40" />
                    <span className="text-[12px] font-bold tracking-tight italic">{item.phone || "Link Unavailable"}</span>
                </div>
            ),
        },
        {
            header: "System Status",
            accessorKey: "status" as const,
            cell: (item: Student) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        item.status === "active" ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
                    )}></div>
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.15em] italic",
                        item.status === "active" ? "text-emerald-600" : "text-slate-400"
                    )}>
                        {item.status} Status
                    </span>
                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable
                title="Institutional Records: Student Directory"
                columns={columns}
                data={students}
                onAdd={() => setIsModalOpen(true)}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Register New Student Entity"
                maxWidth="max-w-4xl"
            >
                <div className="relative p-2">
                    <StudentForm
                        classes={classes}
                        onSuccess={() => {
                            setIsModalOpen(false);
                            router.refresh();
                        }}
                    />
                </div>
            </Modal>
        </>
    );
}
