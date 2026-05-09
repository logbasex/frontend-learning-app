"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface FlowStage {
  label: string;
  detail?: string;
  color?: "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";
}

export interface LayeredFlowProps {
  title?: string;
  description?: string;
  stages: FlowStage[];
  direction?: "horizontal" | "vertical";
}

const COLOR_MAP: Record<NonNullable<FlowStage["color"]>, string> = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  slate: "bg-slate-500",
};

export function LayeredFlow({ title, description, stages, direction = "horizontal" }: LayeredFlowProps) {
  const isHorizontal = direction === "horizontal";
  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">Flow</Badge>
            {title && <h3 className="font-semibold">{title}</h3>}
          </div>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <CardContent className="p-6">
        <ol className={isHorizontal ? "flex items-stretch gap-2 overflow-x-auto" : "flex flex-col gap-2"}>
          {stages.map((stage, i) => (
            <li key={i} className={isHorizontal ? "flex items-center gap-2" : "flex flex-col items-center gap-2"}>
              <div className={`${COLOR_MAP[stage.color ?? "blue"]} text-white rounded-lg px-4 py-3 min-w-[140px] shadow-sm`}>
                <div className="font-semibold text-sm">{stage.label}</div>
                {stage.detail && <div className="text-xs opacity-90 mt-1">{stage.detail}</div>}
              </div>
              {i < stages.length - 1 && (
                <span aria-hidden className={`text-slate-400 ${isHorizontal ? "" : "rotate-90"}`}>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
