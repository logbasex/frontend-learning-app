"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export interface Gotcha {
  title: string;
  body: ReactNode;
}

export interface GotchaListProps {
  title?: string;
  items: Gotcha[];
}

export function GotchaList({ title = "Things that surprise people", items }: GotchaListProps) {
  return (
    <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/10">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Gotchas
          </Badge>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="border-l-4 border-amber-400 pl-4">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">{item.title}</p>
              <div className="text-slate-700 dark:text-slate-300 text-sm">{item.body}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
