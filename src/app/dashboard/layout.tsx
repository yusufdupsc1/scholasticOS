import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { prisma } from "@/lib/prisma";
import { canReadSchoolData } from "@/lib/session";
import { getUserIdFromAuthToken } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;
    const userId = getUserIdFromAuthToken(token);

    if (!userId) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
    });

    if (!user || !canReadSchoolData(user.role)) {
        redirect("/login");
    }

    return <DashboardLayout>{children}</DashboardLayout>;
}
