"use client";

import { Highlight, themes } from "prism-react-renderer";

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  fileName?: string;
}

export function CodeBlock({
  code,
  language = "javascript",
  showLineNumbers = true,
  fileName,
}: CodeBlockProps) {
  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div>
          {fileName && (
            <div className="bg-gray-800 text-gray-300 text-xs px-4 py-2 rounded-t-lg border-b border-gray-700">
              {fileName}
            </div>
          )}
          <pre
            className={`${className} overflow-x-auto ${fileName ? 'rounded-b-lg' : 'rounded-lg'} p-4 text-sm`}
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
