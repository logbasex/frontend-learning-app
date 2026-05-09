"use client";

import { ExternalLink } from "lucide-react";

export function RoadmapLink({ url, label = "View on roadmap.sh" }: { url: string; label?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      {label}
    </a>
  );
}
