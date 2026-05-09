"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

export interface KeyTakeawaysProps {
  points: ReactNode[];
  mentalModel?: string;
  title?: string;
}

export function KeyTakeaways({ points, mentalModel, title = "Key Takeaways" }: KeyTakeawaysProps) {
  return (
    <Card className="border-green-200 dark:border-green-900 bg-green-50/40 dark:bg-green-950/10">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-3">🎓 {title}</h3>
        <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ol>
        {mentalModel && (
          <div className="mt-4 p-3 rounded-md bg-white dark:bg-slate-900 border border-green-200 dark:border-green-900 text-sm">
            <span className="font-semibold text-green-700 dark:text-green-400">💡 Mental model: </span>
            <span className="italic text-slate-700 dark:text-slate-300">{mentalModel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
