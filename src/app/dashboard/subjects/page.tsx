import { prisma } from "@/lib/prisma";
import { SubjectsTable } from "@/components/dashboard/subjects-table";

export default async function SubjectsPage() {
    const subjects = await prisma.subject.findMany({
        include: {
            _count: {
                select: { classes: true }
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
                    <h1 className="text-2xl font-bold text-gray-900">Curriculum Subjects</h1>
                    <p className="text-gray-500 text-sm">Manage the subjects offered across different classes.</p>
                </div>
            </div>

            <SubjectsTable subjects={subjects} />
        </div>
    );
}
