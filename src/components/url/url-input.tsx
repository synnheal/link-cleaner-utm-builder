"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { wasProtocolAdded } from "@/lib/url/parse";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function UrlInput({ value, onChange, placeholder, label }: UrlInputProps) {
  const t = useTranslations("common");
  const showHint = value.trim().length > 0 && wasProtocolAdded(value);

  return (
    <div className="space-y-2">
      {label && <Label>{label || t("urlInput")}</Label>}
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t("urlPlaceholder")}
          className="pr-4 font-mono text-sm"
        />
      </div>
      {showHint && (
        <Badge variant="secondary" className="text-xs">
          {t("assumedHttps")}
        </Badge>
      )}
    </div>
  );
}
