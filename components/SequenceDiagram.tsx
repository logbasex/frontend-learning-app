"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface SequenceMessage {
  from: string;
  to: string;
  label: string;
  note?: string;
}

export interface SequenceDiagramProps {
  title?: string;
  description?: string;
  actors: string[];
  messages: SequenceMessage[];
}

export function SequenceDiagram({ title, description, actors, messages }: SequenceDiagramProps) {
  const actorIndex = new Map(actors.map((a, i) => [a, i]));
  const colWidth = 160;
  const rowHeight = 56;
  const headerHeight = 60;
  const sideMargin = 40;
  const totalWidth = sideMargin * 2 + (actors.length - 1) * colWidth;
  const totalHeight = headerHeight + messages.length * rowHeight + 20;

  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">Sequence Diagram</Badge>
            {title && <h3 className="font-semibold">{title}</h3>}
          </div>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <CardContent className="p-4 overflow-x-auto">
        <svg width={totalWidth} height={totalHeight} role="img" aria-label={title ?? "sequence diagram"}>
          {actors.map((actor, i) => {
            const x = sideMargin + i * colWidth;
            return (
              <g key={actor}>
                <rect x={x - 60} y={10} width={120} height={32} rx={6} className="fill-blue-500" />
                <text x={x} y={30} textAnchor="middle" className="fill-white text-sm font-semibold">
                  {actor}
                </text>
                <line x1={x} y1={headerHeight - 8} x2={x} y2={totalHeight - 10} className="stroke-slate-400 dark:stroke-slate-600" strokeDasharray="4 4" />
              </g>
            );
          })}
          {messages.map((msg, i) => {
            const fromX = sideMargin + (actorIndex.get(msg.from) ?? 0) * colWidth;
            const toX = sideMargin + (actorIndex.get(msg.to) ?? 0) * colWidth;
            const y = headerHeight + i * rowHeight + 10;
            const direction = toX > fromX ? 1 : -1;
            return (
              <g key={i}>
                <line x1={fromX} y1={y} x2={toX - 10 * direction} y2={y} className="stroke-slate-700 dark:stroke-slate-200" strokeWidth={1.5} />
                <polygon
                  points={`${toX},${y} ${toX - 10 * direction},${y - 5} ${toX - 10 * direction},${y + 5}`}
                  className="fill-slate-700 dark:fill-slate-200"
                />
                <text x={(fromX + toX) / 2} y={y - 6} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-xs">
                  {msg.label}
                </text>
                {msg.note && (
                  <text x={(fromX + toX) / 2} y={y + 14} textAnchor="middle" className="fill-slate-500 text-[10px] italic">
                    {msg.note}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}
