"use client";

import { LayeredFlow } from "@/components/LayeredFlow";

export function LayeredFlowDemo() {
  return (
    <LayeredFlow
      title="Browser rendering pipeline"
      description="What turns HTML/CSS bytes into pixels"
      stages={[
        { label: "Bytes", detail: "from network", color: "slate" },
        { label: "DOM", detail: "parsed HTML tree", color: "blue" },
        { label: "CSSOM", detail: "parsed CSS tree", color: "violet" },
        { label: "Render tree", detail: "DOM ∩ CSSOM", color: "emerald" },
        { label: "Layout", detail: "geometry", color: "amber" },
        { label: "Paint", detail: "pixels per layer", color: "rose" },
        { label: "Composite", detail: "final image", color: "blue" },
      ]}
    />
  );
}
