"use client";

import { TerminalPlayground } from "@/components/TerminalPlayground";

export function TerminalPlaygroundDemo() {
  return (
    <TerminalPlayground
      title="Your first commit"
      description="A complete git init → push session"
      lines={[
        { command: "git init", output: "Initialized empty Git repository in /tmp/demo/.git/" },
        { command: "echo '# demo' > README.md", output: "" },
        { command: "git add README.md", output: "" },
        { command: "git commit -m 'initial'", output: "[main (root-commit) c0ffee] initial\n 1 file changed, 1 insertion(+)" },
        { command: "git log --oneline", output: "c0ffee initial" },
      ]}
    />
  );
}
