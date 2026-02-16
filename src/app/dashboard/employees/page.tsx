import { prisma } from "@/lib/prisma";
import { EmployeesTable } from "@/components/dashboard/employees-table";

export default async function EmployeesPage() {
    const employees = await prisma.employee.findMany({
        orderBy: {
            firstName: "asc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
                    <p className="text-gray-500 text-sm">Directory of all teaching and non-teaching staff members.</p>
                </div>
            </div>

            <EmployeesTable employees={employees} />
        </div>
    );
}
