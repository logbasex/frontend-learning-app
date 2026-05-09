"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export interface EventLoopFrame {
  description: string;
  callStack: string[];
  macrotaskQueue: string[];
  microtaskQueue: string[];
  consoleLog?: string[];
}

export interface EventLoopVisualizerProps {
  title?: string;
  code: string;
  frames: EventLoopFrame[];
}

export function EventLoopVisualizer({ title = "Event loop trace", code, frames }: EventLoopVisualizerProps) {
  const [i, setI] = useState(0);
  const f = frames[i];

  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">Event Loop</Badge>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <CardContent className="p-4 space-y-4">
        <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{code}</pre>

        <div className="text-sm font-medium">
          Frame {i + 1} of {frames.length}: <span className="text-blue-600 dark:text-blue-400">{f.description}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <Pane label="Call stack" items={f.callStack} color="bg-blue-100 dark:bg-blue-950/40" />
          <Pane label="Microtask queue" items={f.microtaskQueue} color="bg-violet-100 dark:bg-violet-950/40" />
          <Pane label="Macrotask queue" items={f.macrotaskQueue} color="bg-amber-100 dark:bg-amber-950/40" />
        </div>

        {f.consoleLog && f.consoleLog.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-1">Console</div>
            <pre className="bg-slate-950 text-emerald-300 p-2 rounded text-xs">
              {f.consoleLog.map((line) => `> ${line}\n`).join("")}
            </pre>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <Button size="sm" variant="outline" onClick={() => setI(0)}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={() => setI((v) => Math.min(frames.length - 1, v + 1))} disabled={i === frames.length - 1}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Pane({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs font-medium mb-2">{label}</div>
      <div className={`${color} rounded min-h-[120px] p-2 space-y-1`}>
        {items.length === 0 ? (
          <div className="text-xs text-slate-500 italic">empty</div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 px-2 py-1 rounded text-xs font-mono">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
