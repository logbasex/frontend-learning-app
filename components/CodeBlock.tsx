"use client";

import { useEffect, useRef, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  fileName?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "javascript",
  showLineNumbers = true,
  fileName,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write can fail when permission is denied or in insecure contexts.
    }
  };

  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
      {({ className: prismClass, style, tokens, getLineProps, getTokenProps }) => (
        <div className={`relative group ${className ?? ""}`}>
          <div className="flex items-center justify-between bg-slate-800 text-slate-300 text-xs px-4 py-2 rounded-t-lg border-b border-slate-700">
            <span className="font-mono lowercase tracking-wide">
              {fileName ?? language}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy code"}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy code</span>
                </>
              )}
            </button>
          </div>
          <pre
            className={`${prismClass} overflow-x-auto rounded-b-lg p-4 text-sm leading-relaxed`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {showLineNumbers && (
                  <span className="inline-block w-8 text-right mr-4 select-none opacity-50">
                    {i + 1}
                  </span>
                )}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  );
}
