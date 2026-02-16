"use client";

import { DataTable } from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { FileText, Calendar, Trophy, Percent } from "lucide-react";

export function ExamsTable({ exams }: { exams: any[] }) {
  const columns = [
    {
      header: "Exam Name",
      accessorKey: "name" as const,
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
            <Trophy size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{item.name}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.type}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Class",
      accessorKey: "class" as const,
      cell: (item: any) => (
        <span className="text-sm font-medium text-gray-600">{item.class.name}</span>
      ),
    },
    {
      header: "Duration",
      accessorKey: "startDate" as const,
      cell: (item: any) => (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={12} className="text-gray-400" />
          <span>
            {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: "Results",
      accessorKey: "_count" as const,
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
            {item._count?.results || 0} Recorded
          </span>
        </div>
      ),
    },
    {
      header: "Avg. Performance",
      accessorKey: "results" as const,
      cell: (item: any) => {
        const results = item.results || [];
        const avg = results.length > 0 
          ? (results.reduce((acc: number, curr: any) => acc + curr.marksObtained, 0) / (results.length * 100)) * 100 
          : 0;
        
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full",
                  avg > 70 ? "bg-green-500" : avg > 40 ? "bg-blue-500" : "bg-red-500"
                )} 
                style={{ width: `${avg}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-gray-600 font-mono">{Math.round(avg)}%</span>
          </div>
        );
      },
    },
  ];

  return <DataTable title="Examination Schedules" columns={columns} data={exams} />;
}
