"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { useTranslations } from "next-intl";

interface CopyButtonProps {
  text: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CopyButton({ text, variant = "outline", size = "sm", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("common");

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleCopy} className={className} disabled={!text}>
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 mr-1.5" />
          {t("copied")}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 mr-1.5" />
          {t("copy")}
        </>
      )}
    </Button>
  );
}
