"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = [
  "1fr 1fr 1fr",
  "200px 1fr",
  "1fr 2fr 1fr",
  "repeat(4, 1fr)",
  "repeat(auto-fit, minmax(120px, 1fr))",
] as const;

const PLACE_OPTIONS = ["stretch", "start", "center", "end"] as const;
type Place = (typeof PLACE_OPTIONS)[number];

export interface GridControlsProps {
  title?: string;
  itemCount?: number;
}

export function GridControls({ title = "Grid playground", itemCount = 6 }: GridControlsProps) {
  const [template, setTemplate] = useState<string>(TEMPLATES[0]);
  const [gap, setGap] = useState(8);
  const [placeItems, setPlaceItems] = useState<Place>("stretch");

  const items = Array.from({ length: itemCount });

  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">Grid</Badge>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <CardContent className="p-4 grid md:grid-cols-2 gap-4">
        <div>
          <div
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-2 min-h-[220px]"
            style={{
              display: "grid",
              gridTemplateColumns: template,
              gap: `${gap}px`,
              placeItems,
            }}
          >
            {items.map((_, i) => (
              <div key={i} className="bg-violet-500 text-white px-3 py-2 rounded text-center">
                {i + 1}
              </div>
            ))}
          </div>
          <pre className="mt-3 text-xs bg-slate-900 text-slate-100 p-3 rounded">{`display: grid;
grid-template-columns: ${template};
gap: ${gap}px;
place-items: ${placeItems};`}</pre>
        </div>
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="font-mono text-xs">grid-template-columns</span>
            <select
              className="w-full border rounded px-2 py-1 mt-1 bg-white dark:bg-slate-900"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {TEMPLATES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-xs">place-items</span>
            <select
              className="w-full border rounded px-2 py-1 mt-1 bg-white dark:bg-slate-900"
              value={placeItems}
              onChange={(e) => setPlaceItems(e.target.value as Place)}
            >
              {PLACE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-xs">gap (px)</span>
            <input
              type="range"
              min={0}
              max={48}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-slate-500">{gap}px</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
