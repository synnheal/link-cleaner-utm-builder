"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === "en" ? "fr" : "en";
    router.replace(pathname, { locale: next });
  };

  return (
    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggle}>
      <Languages className="h-4 w-4" />
      <span className="sr-only">{locale === "en" ? "FR" : "EN"}</span>
    </Button>
  );
}
