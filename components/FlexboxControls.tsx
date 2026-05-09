"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const JUSTIFY_OPTIONS = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"] as const;
const ALIGN_OPTIONS = ["stretch", "flex-start", "flex-end", "center", "baseline"] as const;
const WRAP_OPTIONS = ["nowrap", "wrap", "wrap-reverse"] as const;
const DIRECTION_OPTIONS = ["row", "row-reverse", "column", "column-reverse"] as const;

type Justify = (typeof JUSTIFY_OPTIONS)[number];
type Align = (typeof ALIGN_OPTIONS)[number];
type Wrap = (typeof WRAP_OPTIONS)[number];
type Direction = (typeof DIRECTION_OPTIONS)[number];

export interface FlexboxControlsProps {
  title?: string;
  itemCount?: number;
}

export function FlexboxControls({ title = "Flexbox playground", itemCount = 4 }: FlexboxControlsProps) {
  const [justify, setJustify] = useState<Justify>("flex-start");
  const [align, setAlign] = useState<Align>("stretch");
  const [wrap, setWrap] = useState<Wrap>("nowrap");
  const [direction, setDirection] = useState<Direction>("row");
  const [gap, setGap] = useState(8);

  const items = Array.from({ length: itemCount });

  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">Flexbox</Badge>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <CardContent className="p-4 grid md:grid-cols-2 gap-4">
        <div>
          <div
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-2 min-h-[200px]"
            style={{
              display: "flex",
              flexDirection: direction,
              justifyContent: justify,
              alignItems: align,
              flexWrap: wrap,
              gap: `${gap}px`,
            }}
          >
            {items.map((_, i) => (
              <div key={i} className="bg-blue-500 text-white px-3 py-2 rounded">
                {i + 1}
              </div>
            ))}
          </div>
          <pre className="mt-3 text-xs bg-slate-900 text-slate-100 p-3 rounded">{`display: flex;
flex-direction: ${direction};
justify-content: ${justify};
align-items: ${align};
flex-wrap: ${wrap};
gap: ${gap}px;`}</pre>
        </div>
        <div className="space-y-3 text-sm">
          <Selector label="flex-direction" options={DIRECTION_OPTIONS} value={direction} onChange={(v) => setDirection(v as Direction)} />
          <Selector label="justify-content" options={JUSTIFY_OPTIONS} value={justify} onChange={(v) => setJustify(v as Justify)} />
          <Selector label="align-items" options={ALIGN_OPTIONS} value={align} onChange={(v) => setAlign(v as Align)} />
          <Selector label="flex-wrap" options={WRAP_OPTIONS} value={wrap} onChange={(v) => setWrap(v as Wrap)} />
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

function Selector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs">{label}</span>
      <select
        className="w-full border rounded px-2 py-1 mt-1 bg-white dark:bg-slate-900"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
