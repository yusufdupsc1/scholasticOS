import { prisma } from "@/lib/prisma";
import { FeesTable } from "@/components/dashboard/fees-table";

export default async function FeesPage() {
    const payments = await prisma.feePayment.findMany({
        include: {
            student: {
                include: { class: true }
            },
            feeStructure: true,
        },
        orderBy: {
            paymentDate: "desc",
        },
        take: 50
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
                    <p className="text-gray-500 text-sm">Monitor fee collections, pending payments, and student accounts.</p>
                </div>
            </div>

            <FeesTable payments={payments} />
        </div>
    );
}
