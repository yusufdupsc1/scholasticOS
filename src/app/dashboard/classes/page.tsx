import { prisma } from "@/lib/prisma";
import { ClassesTable } from "@/components/dashboard/classes-table";

export default async function ClassesPage() {
    const classes = await prisma.class.findMany({
        include: {
            classTeacher: true,
            _count: {
                select: { students: true }
            }
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Academic Classes</h1>
                    <p className="text-gray-500 text-sm">Manage classrooms, sections, and assigned class teachers.</p>
                </div>
            </div>

            <ClassesTable classes={classes} />
        </div>
    );
}
