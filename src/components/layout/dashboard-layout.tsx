import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Sidebar />
            <div className="lg:pl-64 flex flex-col min-h-screen transition-all">
                <Header />
                <main className="flex-1 mt-16 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
