"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setLocaleCookie, useLocale } from "@/lib/i18n/client";
import type { SupportedLocale } from "@/lib/i18n/getDict";

export function LanguageToggle() {
  const router = useRouter();
  const locale = useLocale();

  function switchLocale(nextLocale: SupportedLocale) {
    setLocaleCookie(nextLocale);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 p-1">
      <Languages className="h-3.5 w-3.5 text-muted-foreground" />
      <Button
        type="button"
        size="sm"
        variant={locale === "bn" ? "default" : "ghost"}
        className="h-7 rounded-full px-2 text-[11px]"
        onClick={() => switchLocale("bn")}
      >
        BN
      </Button>
      <Button
        type="button"
        size="sm"
        variant={locale === "en" ? "default" : "ghost"}
        className="h-7 rounded-full px-2 text-[11px]"
        onClick={() => switchLocale("en")}
      >
        EN
      </Button>
    </div>
  );
}
