"use client";

import { LiveCascadeDemo } from "@/components/LiveCascadeDemo";

export function LiveCascadeDemoExample() {
  return (
    <LiveCascadeDemo
      title="Which rule wins?"
      description="Specificity score is shown as (inline, id, class, element)"
      rules={[
        { selector: "p", declaration: "color: black", source: "stylesheet" },
        { selector: ".lead", declaration: "color: navy", source: "stylesheet" },
        { selector: "#hero p", declaration: "color: crimson", source: "stylesheet" },
        { selector: "p", declaration: "color: orange !important", source: "important" },
      ]}
    />
  );
}
