"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useUrlStore } from "@/stores/url-store";
import { useHistoryStore } from "@/stores/history-store";
import { UrlInput } from "@/components/url/url-input";
import { ParamTable } from "@/components/url/param-table";
import { CopyButton } from "@/components/shared/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildUtmUrl, UTM_PRESETS, slugify } from "@/lib/url/utm";
import { normalizeUrl, tryParseUrl, extractParams } from "@/lib/url/parse";

export default function UtmPage() {
  const t = useTranslations("utm");
  const { inputUrl, setInputUrl, utmParams, setUtmParams, utmOptions, setUtmOptions } = useUrlStore();
  const addItem = useHistoryStore((s) => s.addItem);

  const normalized = normalizeUrl(inputUrl);

  const result = useMemo(() => {
    if (!normalized) return "";
    const hasAnyUtm = utmParams.source || utmParams.medium || utmParams.campaign;
    if (!hasAnyUtm) return normalized;
    return buildUtmUrl(normalized, utmParams, utmOptions);
  }, [normalized, utmParams, utmOptions]);

  const parsedResult = useMemo(() => {
    const url = tryParseUrl(result);
    return url ? extractParams(url) : [];
  }, [result]);

  const handleSave = () => {
    if (result && inputUrl) {
      addItem("utm", normalized, result, { utmParams });
    }
  };

  const fields = [
    { key: "source" as const, label: t("source"), placeholder: t("sourcePlaceholder"), required: true },
    { key: "medium" as const, label: t("medium"), placeholder: t("mediumPlaceholder"), required: true },
    { key: "campaign" as const, label: t("campaign"), placeholder: t("campaignPlaceholder"), required: true },
    { key: "term" as const, label: t("term"), placeholder: t("termPlaceholder"), required: false },
    { key: "content" as const, label: t("content"), placeholder: t("contentPlaceholder"), required: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <UrlInput value={inputUrl} onChange={setInputUrl} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("presets")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {UTM_PRESETS.map((preset) => (
              <Button
                key={preset.medium}
                variant={utmParams.medium === preset.medium ? "default" : "outline"}
                size="sm"
                onClick={() => setUtmParams({ medium: preset.medium })}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.key} className="text-sm">
                {field.label}
                {field.required && <span className="text-destructive ml-0.5">*</span>}
              </Label>
              <Input
                id={field.key}
                value={utmParams[field.key]}
                onChange={(e) => setUtmParams({ [field.key]: e.target.value })}
                onBlur={() => {
                  if (field.key === "campaign" && utmParams.campaign) {
                    setUtmParams({ campaign: slugify(utmParams.campaign) });
                  }
                }}
                placeholder={field.placeholder}
                className="font-mono text-sm"
              />
            </div>
          ))}

          <div className="flex items-center gap-2 pt-2">
            <Switch
              id="replaceExisting"
              checked={utmOptions.replaceExisting}
              onCheckedChange={(val) => setUtmOptions({ replaceExisting: val })}
            />
            <Label htmlFor="replaceExisting" className="text-sm cursor-pointer">
              {t("replaceExisting")}
            </Label>
          </div>
        </CardContent>
      </Card>

      {result && inputUrl.trim() && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("result")}</CardTitle>
              <div className="flex gap-2">
                <CopyButton text={result} />
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
            <p className="font-mono text-xs break-all bg-muted/50 px-3 py-2 rounded-md">
              {result}
            </p>
            <ParamTable params={parsedResult} highlightKeys={["utm_"]} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
