"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useUrlStore } from "@/stores/url-store";
import { useHistoryStore } from "@/stores/history-store";
import { CopyButton } from "@/components/shared/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { codec } from "@/lib/url/codec";
import { cn } from "@/lib/utils";

export default function EncoderPage() {
  const t = useTranslations("encoder");
  const { codecInput, setCodecInput, codecMode, setCodecMode, codecDirection, setCodecDirection } =
    useUrlStore();
  const addItem = useHistoryStore((s) => s.addItem);
  const [error, setError] = useState<string | null>(null);

  const output = useMemo(() => {
    if (!codecInput.trim()) return "";
    setError(null);
    try {
      return codec(codecInput, codecMode, codecDirection);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      return "";
    }
  }, [codecInput, codecMode, codecDirection]);

  const handleSwap = () => {
    if (output) {
      setCodecInput(output);
      setCodecDirection(codecDirection === "encode" ? "decode" : "encode");
    }
  };

  const handleSave = () => {
    if (output && codecInput) {
      addItem(codecDirection === "encode" ? "encode" : "decode", codecInput, output, {
        mode: codecMode,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex rounded-md border overflow-hidden">
          <button
            onClick={() => setCodecMode("url")}
            className={cn(
              "px-4 py-2 text-sm transition-colors",
              codecMode === "url"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {t("url")}
          </button>
          <button
            onClick={() => setCodecMode("base64")}
            className={cn(
              "px-4 py-2 text-sm transition-colors",
              codecMode === "base64"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {t("base64")}
          </button>
        </div>

        <div className="flex rounded-md border overflow-hidden">
          <button
            onClick={() => setCodecDirection("encode")}
            className={cn(
              "px-4 py-2 text-sm transition-colors",
              codecDirection === "encode"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {t("encode")}
          </button>
          <button
            onClick={() => setCodecDirection("decode")}
            className={cn(
              "px-4 py-2 text-sm transition-colors",
              codecDirection === "decode"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {t("decode")}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-start">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("input")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={codecInput}
              onChange={(e) => setCodecInput(e.target.value)}
              placeholder={t("inputPlaceholder")}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <div className="flex md:flex-col items-center justify-center gap-2 py-4">
          <Button variant="outline" size="icon" onClick={handleSwap} disabled={!output}>
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("output")}</CardTitle>
              <div className="flex gap-2">
                <CopyButton text={output} />
                {output && (
                  <button
                    onClick={handleSave}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="min-h-[200px] flex items-center justify-center text-destructive text-sm">
                {error}
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                className="min-h-[200px] font-mono text-sm bg-muted/30"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
