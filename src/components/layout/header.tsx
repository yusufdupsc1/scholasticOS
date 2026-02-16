"use client";

import {
    Bell,
    Search,
    Settings,
    HelpCircle,
    ShoppingBag,
    Maximize2,
    Smartphone,
    Mail,
    User
} from "lucide-react";

export function Header() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 left-0 transition-all z-40 ml-0 lg:ml-64 bg-opacity-80 backdrop-blur-md">
            <div className="flex items-center gap-4 w-full max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                    <Maximize2 size={18} />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1.5 mr-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors relative">
                        <Mail size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                        <ShoppingBag size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                        <Smartphone size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none">System Admin</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Administrator</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer border-2 border-white">
                        SA
                    </div>
                </div>
            </div>
        </header>
    );
}
