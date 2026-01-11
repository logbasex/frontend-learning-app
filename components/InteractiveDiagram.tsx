"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface InteractiveDiagramProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  title?: string;
  description?: string;
  height?: number;
  interactive?: boolean;
}

export function InteractiveDiagram({
  initialNodes,
  initialEdges,
  title,
  description,
  height = 500,
  interactive = true,
}: InteractiveDiagramProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(() => {
    // Optional: handle connection
  }, []);

  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          {title && (
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                Interactive Diagram
              </Badge>
              <h3 className="font-semibold">{title}</h3>
            </div>
          )}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      <CardContent className="p-0">
        <div style={{ height: `${height}px`, width: "100%" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={interactive ? onNodesChange : undefined}
            onEdgesChange={interactive ? onEdgesChange : undefined}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-right"
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}

// Pre-built diagram: Browser Rendering Pipeline
export function BrowserRenderingPipeline() {
  const nodes: Node[] = [
    {
      id: "html",
      type: "input",
      data: { label: "HTML" },
      position: { x: 50, y: 50 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
      },
    },
    {
      id: "css",
      type: "input",
      data: { label: "CSS" },
      position: { x: 50, y: 150 },
      style: {
        background: "#8b5cf6",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
      },
    },
    {
      id: "dom",
      data: { label: "DOM Tree" },
      position: { x: 250, y: 50 },
      style: {
        background: "#10b981",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "cssom",
      data: { label: "CSSOM Tree" },
      position: { x: 250, y: 150 },
      style: {
        background: "#10b981",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "render-tree",
      data: { label: "Render Tree" },
      position: { x: 450, y: 100 },
      style: {
        background: "#f59e0b",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
      },
    },
    {
      id: "layout",
      data: { label: "Layout (Reflow)" },
      position: { x: 650, y: 50 },
      style: {
        background: "#ef4444",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "paint",
      data: { label: "Paint" },
      position: { x: 650, y: 150 },
      style: {
        background: "#ef4444",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "display",
      type: "output",
      data: { label: "Display on Screen" },
      position: { x: 850, y: 100 },
      style: {
        background: "#06b6d4",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
      },
    },
  ];

  const edges: Edge[] = [
    { id: "e1", source: "html", target: "dom", animated: true },
    { id: "e2", source: "css", target: "cssom", animated: true },
    { id: "e3", source: "dom", target: "render-tree", label: "Combine" },
    { id: "e4", source: "cssom", target: "render-tree", label: "Combine" },
    { id: "e5", source: "render-tree", target: "layout", animated: true },
    { id: "e6", source: "render-tree", target: "paint", animated: true },
    { id: "e7", source: "layout", target: "display" },
    { id: "e8", source: "paint", target: "display" },
  ];

  return (
    <InteractiveDiagram
      initialNodes={nodes}
      initialEdges={edges}
      title="Browser Rendering Pipeline"
      description="Quá trình browser xử lý HTML và CSS để hiển thị trang web"
      height={350}
      interactive={false}
    />
  );
}

// Pre-built diagram: Virtual DOM Flow
export function VirtualDOMFlow() {
  const nodes: Node[] = [
    {
      id: "state-change",
      type: "input",
      data: { label: "State Change" },
      position: { x: 50, y: 100 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
      },
    },
    {
      id: "create-vdom",
      data: { label: "Create New Virtual DOM" },
      position: { x: 250, y: 100 },
      style: {
        background: "#8b5cf6",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "diff",
      data: { label: "Diff Algorithm (Reconciliation)" },
      position: { x: 500, y: 100 },
      style: {
        background: "#f59e0b",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
      },
    },
    {
      id: "old-vdom",
      data: { label: "Old Virtual DOM" },
      position: { x: 500, y: 200 },
      style: {
        background: "#6b7280",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "patch",
      data: { label: "Batch DOM Updates" },
      position: { x: 750, y: 100 },
      style: {
        background: "#10b981",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "real-dom",
      type: "output",
      data: { label: "Update Real DOM" },
      position: { x: 950, y: 100 },
      style: {
        background: "#ef4444",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
      },
    },
  ];

  const edges: Edge[] = [
    { id: "e1", source: "state-change", target: "create-vdom", animated: true },
    { id: "e2", source: "create-vdom", target: "diff", label: "New VDOM" },
    { id: "e3", source: "old-vdom", target: "diff", label: "Compare" },
    {
      id: "e4",
      source: "diff",
      target: "patch",
      label: "Changes only",
      animated: true,
    },
    { id: "e5", source: "patch", target: "real-dom", animated: true },
  ];

  return (
    <InteractiveDiagram
      initialNodes={nodes}
      initialEdges={edges}
      title="Virtual DOM Reconciliation"
      description="React's Virtual DOM diffing algorithm - chỉ update những phần thay đổi"
      height={350}
      interactive={false}
    />
  );
}

// Pre-built diagram: Component Tree
export function ComponentTree() {
  const nodes: Node[] = [
    {
      id: "app",
      type: "input",
      data: { label: "<App />" },
      position: { x: 400, y: 50 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
      },
    },
    {
      id: "header",
      data: { label: "<Header />" },
      position: { x: 200, y: 150 },
      style: {
        background: "#8b5cf6",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "main",
      data: { label: "<Main />" },
      position: { x: 400, y: 150 },
      style: {
        background: "#8b5cf6",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "sidebar",
      data: { label: "<Sidebar />" },
      position: { x: 600, y: 150 },
      style: {
        background: "#8b5cf6",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    },
    {
      id: "nav",
      data: { label: "<Nav />" },
      position: { x: 150, y: 250 },
      style: {
        background: "#10b981",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
      },
    },
    {
      id: "logo",
      data: { label: "<Logo />" },
      position: { x: 250, y: 250 },
      style: {
        background: "#10b981",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
      },
    },
    {
      id: "content",
      data: { label: "<Content />" },
      position: { x: 350, y: 250 },
      style: {
        background: "#10b981",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
      },
    },
    {
      id: "footer",
      data: { label: "<Footer />" },
      position: { x: 450, y: 250 },
      style: {
        background: "#10b981",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
      },
    },
  ];

  const edges: Edge[] = [
    { id: "e1", source: "app", target: "header" },
    { id: "e2", source: "app", target: "main" },
    { id: "e3", source: "app", target: "sidebar" },
    { id: "e4", source: "header", target: "nav" },
    { id: "e5", source: "header", target: "logo" },
    { id: "e6", source: "main", target: "content" },
    { id: "e7", source: "main", target: "footer" },
  ];

  return (
    <InteractiveDiagram
      initialNodes={nodes}
      initialEdges={edges}
      title="React Component Tree"
      description="Component composition - Props flow từ trên xuống (unidirectional)"
      height={400}
      interactive={true}
    />
  );
}
