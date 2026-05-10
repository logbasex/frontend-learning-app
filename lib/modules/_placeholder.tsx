"use client";

import { Card, CardContent } from "@/components/ui/card";

export function PlaceholderModuleContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300">
            This module is being authored. Come back soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
