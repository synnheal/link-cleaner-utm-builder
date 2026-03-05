"use client";

import { useTranslations } from "next-intl";
import { useUrlStore } from "@/stores/url-store";
import { UrlInput } from "@/components/url/url-input";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Sparkles, Tag, Code } from "lucide-react";

export default function HomePage() {
  const t = useTranslations("home");
  const { inputUrl, setInputUrl } = useUrlStore();

  return (
    <div className="flex flex-col items-center gap-8 pt-12 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("heading")}</h1>
        <p className="text-muted-foreground max-w-md">{t("subtitle")}</p>
      </div>

      <div className="w-full max-w-xl">
        <UrlInput value={inputUrl} onChange={setInputUrl} placeholder={t("placeholder")} />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="default" size="lg">
          <Link href="/cleaner">
            <Sparkles className="h-4 w-4 mr-2" />
            {t("cleanAction")}
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/utm">
            <Tag className="h-4 w-4 mr-2" />
            {t("utmAction")}
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/encoder">
            <Code className="h-4 w-4 mr-2" />
            {t("encodeAction")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
