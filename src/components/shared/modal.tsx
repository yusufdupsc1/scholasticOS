"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={cn(
                            "relative w-full bg-slate-900 rounded-[3rem] shadow-premium overflow-hidden flex flex-col max-h-[90vh] border border-white/10",
                            maxWidth
                        )}
                        ref={modalRef}
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 px-10">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight font-plus-jakarta italic">{title}</h2>
                                <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mt-1 italic">System Configuration Terminal</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all hover:rotate-90"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-10 overflow-y-auto no-scrollbar bg-slate-900">
                            <div className="text-slate-200">
                                {children}
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand-indigo/20 blur-[100px] pointer-events-none" />
                        <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-violet/20 blur-[100px] pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
