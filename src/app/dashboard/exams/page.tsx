import { prisma } from "@/lib/prisma";
import { ExamsTable } from "@/components/dashboard/exams-table";

export default async function ExamsPage() {
    const exams = await prisma.exam.findMany({
        include: {
            class: true,
            _count: {
                select: { results: true }
            },
            results: {
                select: { marksObtained: true }
            }
        },
        orderBy: {
            startDate: "desc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Examinations</h1>
                    <p className="text-gray-500 text-sm">Schedule exams, record results, and track academic performance.</p>
                </div>
            </div>

            <ExamsTable exams={exams} />
        </div>
    );
}
