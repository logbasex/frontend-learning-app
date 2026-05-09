"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export interface TerminalLine {
  command: string;
  output: string;
  delayMs?: number;
}

export interface TerminalPlaygroundProps {
  title?: string;
  description?: string;
  lines: TerminalLine[];
  prompt?: string;
}

export function TerminalPlayground({ title, description, lines, prompt = "$" }: TerminalPlaygroundProps) {
  const [cursor, setCursor] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!running || cursor >= lines.length) return;
    const delay = lines[cursor].delayMs ?? 700;
    timerRef.current = setTimeout(() => {
      setCursor((c) => c + 1);
      if (cursor + 1 >= lines.length) setRunning(false);
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cursor, running, lines]);

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCursor(0);
    setRunning(false);
  };

  const play = () => {
    if (cursor >= lines.length) reset();
    setRunning(true);
  };

  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">Terminal</Badge>
            {title && <h3 className="font-semibold">{title}</h3>}
          </div>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <CardContent className="p-0">
        <div className="bg-slate-950 text-slate-100 p-4 font-mono text-sm min-h-[200px]">
          {lines.slice(0, cursor).map((line, i) => (
            <div key={i} className="mb-3">
              <div>
                <span className="text-emerald-400">{prompt}</span> <span>{line.command}</span>
              </div>
              {line.output && (
                <pre className="whitespace-pre-wrap text-slate-300 mt-1">{line.output}</pre>
              )}
            </div>
          ))}
          {cursor < lines.length && running && (
            <div className="text-slate-500">
              <span className="text-emerald-400">{prompt}</span> <span className="animate-pulse">▍</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 p-3 border-t bg-slate-50 dark:bg-slate-900">
          <Button size="sm" onClick={play} disabled={running && cursor < lines.length}>
            <Play className="w-4 h-4 mr-1" />
            {cursor >= lines.length ? "Replay" : running ? "Running…" : "Play"}
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
