"use client";

import { Sandpack, SandpackTheme } from "@codesandbox/sandpack-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface CodePlaygroundProps {
  files: Record<string, string>;
  template?: "vanilla" | "react" | "vue" | "angular" | "static";
  theme?: "light" | "dark";
  editorHeight?: number;
  showConsole?: boolean;
  showNavigator?: boolean;
  title?: string;
  description?: string;
}

const customTheme: SandpackTheme = {
  colors: {
    surface1: "#1e1e1e",
    surface2: "#252525",
    surface3: "#2d2d2d",
    clickable: "#999",
    base: "#e0e0e0",
    disabled: "#4d4d4d",
    hover: "#3a3a3a",
    accent: "#3b82f6",
    error: "#ef4444",
    errorSurface: "#7f1d1d",
  },
  syntax: {
    plain: "#e0e0e0",
    comment: { color: "#6a9955", fontStyle: "italic" },
    keyword: "#569cd6",
    tag: "#569cd6",
    punctuation: "#d4d4d4",
    definition: "#4ec9b0",
    property: "#9cdcfe",
    static: "#4fc1ff",
    string: "#ce9178",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "14px",
    lineHeight: "1.6",
  },
};

export function CodePlayground({
  files,
  template = "vanilla",
  theme = "light",
  editorHeight = 400,
  showConsole = true,
  showNavigator = false,
  title,
  description,
}: CodePlaygroundProps) {
  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          {title && (
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">Live Code</Badge>
              <h3 className="font-semibold">{title}</h3>
            </div>
          )}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
          )}
        </div>
      )}
      <CardContent className="p-0">
        <Sandpack
          template={template}
          files={files}
          theme={theme === "dark" ? customTheme : "light"}
          options={{
            editorHeight,
            showConsole,
            showNavigator,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorWidthPercentage: 50,
            autorun: true,
            recompileMode: "delayed",
            recompileDelay: 300,
          }}
          customSetup={{
            dependencies: {},
          }}
        />
      </CardContent>
    </Card>
  );
}

// Convenience component for HTML/CSS/JS demos
export function HTMLPlayground({
  html = "",
  css = "",
  js = "",
  title,
  description,
}: {
  html?: string;
  css?: string;
  js?: string;
  title?: string;
  description?: string;
}) {
  const files = {
    "/index.html": html || `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h1>Hello World!</h1>
  <script src="/script.js"></script>
</body>
</html>`,
    "/styles.css": css || `body {
  font-family: sans-serif;
  margin: 20px;
}

h1 {
  color: #3b82f6;
}`,
    "/script.js": js || `console.log("Hello from JavaScript!");`,
  };

  return (
    <CodePlayground
      files={files}
      template="static"
      title={title}
      description={description}
    />
  );
}

// Convenience component for React demos
export function ReactPlayground({
  code,
  title,
  description,
}: {
  code: string;
  title?: string;
  description?: string;
}) {
  const files = {
    "/App.js": code,
  };

  return (
    <CodePlayground
      files={files}
      template="react"
      title={title}
      description={description}
    />
  );
}
