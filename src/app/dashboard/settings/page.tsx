import { prisma } from "@/lib/prisma";
import { Building, Mail, Phone, MapPin, Calendar, Globe } from "lucide-react";

export default async function SettingsPage() {
    const school = await prisma.schoolSettings.findFirst();

    if (!school) return <div className="p-8 text-center text-gray-500">No school settings found. Please run seed.</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
                <p className="text-gray-500 text-sm">Update your school profile, contact information, and branding.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 relative group overflow-hidden">
                            <Building size={48} className="text-blue-600 transition-transform group-hover:scale-110 duration-500" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{school.schoolName}</h2>
                        <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Location: {school.city}, {school.country}</p>

                        <div className="mt-8 w-full space-y-4">
                            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all">Upload New Logo</button>
                            <button className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition-all">Remove Branding</button>
                        </div>
                    </div>

                    <div className="bg-[#1e266d] rounded-2xl p-6 text-white shadow-lg space-y-4">
                        <div className="flex items-center gap-3">
                            <Globe size={18} className="text-blue-400" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Website</p>
                                <p className="text-sm font-semibold">{school.website || 'www.eskooly.com'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-orange-400" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Timezone</p>
                                <p className="text-sm font-semibold">{school.timezone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Settings Forms */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">School Profile Details</h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">School Name</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="text" defaultValue={school.schoolName} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tagline</label>
                                <div className="relative">
                                    <input type="text" defaultValue={school.tagline || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="email" defaultValue={school.email || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="text" defaultValue={school.phone || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Physical Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <textarea defaultValue={school.address || ''} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-md">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
