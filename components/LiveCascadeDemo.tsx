"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface CascadeRule {
  selector: string;
  declaration: string;
  source: "stylesheet" | "inline" | "important";
}

function specificity(selector: string): [number, number, number, number] {
  const ids = (selector.match(/#[\w-]+/g) ?? []).length;
  const classes = (selector.match(/\.[\w-]+/g) ?? []).length;
  const attrs = (selector.match(/\[[^\]]+\]/g) ?? []).length;
  const pseudoClasses = (selector.match(/:[\w-]+(?!\()/g) ?? []).length;
  const elements = (selector.match(/(^|[\s>+~])([a-z][\w-]*)/gi) ?? []).length;
  return [0, ids, classes + attrs + pseudoClasses, elements];
}

function score([a, b, c, d]: [number, number, number, number]) {
  return a * 1000 + b * 100 + c * 10 + d;
}

export interface LiveCascadeDemoProps {
  title?: string;
  description?: string;
  rules: CascadeRule[];
}

export function LiveCascadeDemo({ title, description, rules }: LiveCascadeDemoProps) {
  const ranked = useMemo(() => {
    return rules
      .map((r, i) => {
        const sp =
          r.source === "important" ? ([1, 0, 0, 0] as [number, number, number, number]) :
          r.source === "inline" ? ([0, 1, 0, 0] as [number, number, number, number]) :
          specificity(r.selector);
        return { ...r, originalIndex: i, sp, score: score(sp) };
      })
      .sort((a, b) => b.score - a.score || b.originalIndex - a.originalIndex);
  }, [rules]);
  const winner = ranked[0];

  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">Cascade Resolver</Badge>
            {title && <h3 className="font-semibold">{title}</h3>}
          </div>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <CardContent className="p-4 space-y-2">
        {ranked.map((r, i) => {
          const isWinner = r.originalIndex === winner.originalIndex;
          return (
            <div
              key={r.originalIndex}
              className={`flex items-center gap-4 p-3 rounded-md border-2 ${
                isWinner
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <code className="font-mono text-sm flex-1">{r.selector} {`{`} {r.declaration} {`}`}</code>
              <span className="text-xs text-slate-500">
                ({r.sp.join(",")})
              </span>
              {isWinner && <Badge className="bg-emerald-500">Winner</Badge>}
              {i === 0 && r.source !== "stylesheet" && (
                <Badge variant="outline" className="text-xs">{r.source}</Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
