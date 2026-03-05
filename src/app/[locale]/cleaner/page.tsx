"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useUrlStore } from "@/stores/url-store";
import { useHistoryStore } from "@/stores/history-store";
import { UrlInput } from "@/components/url/url-input";
import { ParamTable } from "@/components/url/param-table";
import { CopyButton } from "@/components/shared/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cleanUrl } from "@/lib/url/clean";
import { tryParseUrl, extractParams } from "@/lib/url/parse";
import { normalizeUrl } from "@/lib/url/parse";

export default function CleanerPage() {
  const t = useTranslations("cleaner");
  const { inputUrl, setInputUrl, cleanOptions, setCleanOptions } = useUrlStore();
  const addItem = useHistoryStore((s) => s.addItem);

  const normalized = normalizeUrl(inputUrl);

  const result = useMemo(() => {
    if (!normalized) return null;
    return cleanUrl(normalized, cleanOptions);
  }, [normalized, cleanOptions]);

  const parsedBefore = useMemo(() => {
    const url = tryParseUrl(inputUrl);
    return url ? extractParams(url) : [];
  }, [inputUrl]);

  const parsedAfter = useMemo(() => {
    if (!result) return [];
    const url = tryParseUrl(result.cleanedUrl);
    return url ? extractParams(url) : [];
  }, [result]);

  const handleSave = () => {
    if (result && inputUrl) {
      addItem("clean", normalized, result.cleanedUrl);
    }
  };

  const options: { key: keyof typeof cleanOptions; label: string }[] = [
    { key: "removeUtm", label: t("removeUtm") },
    { key: "removeAdIds", label: t("removeAdIds") },
    { key: "sortParams", label: t("sortParams") },
    { key: "removeFragments", label: t("removeFragments") },
    { key: "decodeBeforeClean", label: t("decodeFirst") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <UrlInput value={inputUrl} onChange={setInputUrl} label={t("title")} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("options")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {options.map((opt) => (
            <div key={opt.key} className="flex items-center gap-2">
              <Switch
                id={opt.key}
                checked={cleanOptions[opt.key]}
                onCheckedChange={(val) => setCleanOptions({ [opt.key]: val })}
              />
              <Label htmlFor={opt.key} className="text-sm cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {result && inputUrl.trim() && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t("result")}</CardTitle>
                <div className="flex gap-2">
                  <CopyButton text={result.cleanedUrl} />
                  <button
                    onClick={handleSave}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Save
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{t("before")}</p>
                <p className="font-mono text-xs break-all bg-muted/50 px-3 py-2 rounded-md">
                  {normalized}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{t("after")}</p>
                <p className="font-mono text-xs break-all bg-muted/50 px-3 py-2 rounded-md">
                  {result.cleanedUrl}
                </p>
              </div>
            </CardContent>
          </Card>

          {result.removedParams.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t("removed")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {result.removedParams.map((p, i) => (
                    <Badge key={i} variant="destructive" className="font-mono text-xs">
                      {p.key}={p.value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">{t("before")} ({parsedBefore.length} params)</p>
              <ParamTable params={parsedBefore} highlightKeys={["utm_", "fbclid", "gclid", "msclkid"]} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">{t("after")} ({parsedAfter.length} params)</p>
              <ParamTable params={parsedAfter} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
