import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-inter">
            <Sidebar />
            <div className="lg:pl-[21rem] flex flex-col min-h-screen transition-all">
                <Header />
                <main className="flex-1 mt-24 p-6 lg:p-12">
                    {children}
                </main>
            </div>
        </div>
    );
}
