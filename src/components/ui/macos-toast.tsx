"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MacDeleteToastInput {
  entity: "Student" | "Teacher" | "Subject";
  name?: string;
}

export function showMacDeleteToast({ entity, name }: MacDeleteToastInput) {
  toast.custom(
    () => (
      <div className="w-[320px] rounded-2xl border border-white/30 bg-gradient-to-b from-zinc-900/90 via-zinc-900/85 to-zinc-950/90 p-3 text-zinc-50 shadow-2xl backdrop-blur-xl">
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded-xl border border-red-400/35 bg-red-500/20 p-1.5">
            <Trash2 className="h-3.5 w-3.5 text-red-300" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-zinc-200">scholaOps</p>
            <p className="text-[10px] text-zinc-400">Archive Notification</p>
          </div>
        </div>

        <p className="text-sm font-medium">
          {entity} moved to inactive
          {name ? ":" : "."}
        </p>
        {name ? <p className="truncate text-xs text-zinc-300">{name}</p> : null}

        <div className="mt-2 text-[10px] uppercase tracking-wide text-zinc-500">
          Action can be reverted via edit or status toggle
        </div>
      </div>
    ),
    {
      duration: 4200,
      position: "bottom-right",
    },
  );
}
