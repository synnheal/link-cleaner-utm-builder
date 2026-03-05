"use client";

import type { ParsedParam } from "@/lib/url/parse";
import { cn } from "@/lib/utils";

interface ParamTableProps {
  params: ParsedParam[];
  highlightKeys?: string[];
  className?: string;
}

export function ParamTable({ params, highlightKeys = [], className }: ParamTableProps) {
  if (params.length === 0) return null;

  return (
    <div className={cn("rounded-md border overflow-hidden", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Key</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Value</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p, i) => {
            const isHighlighted = highlightKeys.some(
              (k) => p.key.toLowerCase().startsWith(k.toLowerCase())
            );
            return (
              <tr
                key={`${p.key}-${i}`}
                className={cn(
                  "border-b last:border-0",
                  isHighlighted && "bg-primary/5"
                )}
              >
                <td className="px-3 py-1.5 font-mono text-xs">
                  {isHighlighted && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                  )}
                  {p.key}
                </td>
                <td className="px-3 py-1.5 font-mono text-xs text-muted-foreground break-all">
                  {p.value || <span className="italic">(empty)</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
