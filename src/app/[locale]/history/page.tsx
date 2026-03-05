"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useHistoryStore } from "@/stores/history-store";
import { useUrlStore } from "@/stores/url-store";
import { CopyButton } from "@/components/shared/copy-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { Star, Trash2, ExternalLink, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HistoryItemType } from "@/types/url";

const typeColors: Record<HistoryItemType, string> = {
  clean: "bg-green-500/10 text-green-700 dark:text-green-400",
  utm: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  encode: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  decode: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
};

const toolRoute: Record<HistoryItemType, string> = {
  clean: "/cleaner",
  utm: "/utm",
  encode: "/encoder",
  decode: "/encoder",
};

export default function HistoryPage() {
  const t = useTranslations("history");
  const { items, searchQuery, setSearchQuery, toggleStar, removeItem, clearAll } = useHistoryStore();
  const setInputUrl = useUrlStore((s) => s.setInputUrl);
  const [filter, setFilter] = useState<"all" | "starred">("all");
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    let list = items;
    if (filter === "starred") {
      list = list.filter((i) => i.starred);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.input.toLowerCase().includes(q) ||
          i.output.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filter, searchQuery]);

  const handleReopen = (item: (typeof items)[0]) => {
    setInputUrl(item.input);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        {items.length > 0 && (
          <div>
            {confirmClear ? (
              <div className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground">{t("confirmClear")}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    clearAll();
                    setConfirmClear(false);
                  }}
                >
                  {t("clearAll")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setConfirmClear(true)}>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                {t("clearAll")}
              </Button>
            )}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search")}
              className="pl-9"
            />
          </div>
          <div className="flex rounded-md border overflow-hidden">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-3 py-1.5 text-sm transition-colors",
                filter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              {t("all")}
            </button>
            <button
              onClick={() => setFilter("starred")}
              className={cn(
                "px-3 py-1.5 text-sm transition-colors",
                filter === "starred" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              {t("starred")}
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">{t("empty")}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">{t("noResults")}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <Card key={item.id} className="group">
              <CardContent className="flex items-start gap-3 py-3">
                <button
                  onClick={() => toggleStar(item.id)}
                  className="mt-0.5 shrink-0"
                >
                  <Star
                    className={cn(
                      "h-4 w-4 transition-colors",
                      item.starred
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground hover:text-yellow-400"
                    )}
                  />
                </button>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn("text-xs", typeColors[item.type])}>
                      {item.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-mono text-xs truncate text-muted-foreground">{item.input}</p>
                  <p className="font-mono text-xs truncate">{item.output}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={item.output} size="icon" variant="ghost" />
                  <Button variant="ghost" size="icon" asChild onClick={() => handleReopen(item)}>
                    <Link href={toolRoute[item.type]}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
