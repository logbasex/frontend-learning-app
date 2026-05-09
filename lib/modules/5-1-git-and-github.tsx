"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { TerminalPlayground } from "@/components/TerminalPlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_5_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const initToPrSteps: Step[] = [
    {
      title: "Step 1: A commit is a snapshot",
      description: (
        <>
          When you run <code>git commit</code>, Git does not store a diff — it records the entire
          working tree as it stands at that moment. Each commit is identified by a SHA-1 hash of
          four things: the tree (file contents), the parent commit&apos;s SHA, the author, and the
          message. Change any one of those and you get a completely different SHA. That
          content-addressing is why commits are immutable: the SHA <em>is</em> the commit. You
          can read history with <code>git log</code>; adding <code>--oneline</code> and{" "}
          <code>--graph</code> turns the output into an ASCII picture of the commit DAG (directed
          acyclic graph) — branches, merges, and all.
        </>
      ),
      code: `# Make a commit and see its SHA
$ git add README.md
$ git commit -m "initial"
[main (root-commit) c0ffee1] initial
 1 file changed, 1 insertion(+)

# git log shows the chain of parent pointers
$ git log --oneline
c0ffee1 (HEAD -> main) initial

# Each commit stores: tree + parent + author + message
# Change any field and you get a new SHA — commits are immutable.`,
    },
    {
      title: "Step 2: A branch is a pointer",
      description: (
        <>
          <em>Branch</em> — a movable pointer to a commit — is one of Git&apos;s cheapest
          abstractions. <code>main</code> is just a file containing a 40-character SHA. Running{" "}
          <code>git branch feature</code> creates a second file pointing at the same commit;
          no files are copied, no history is duplicated. <code>HEAD</code> is a special pointer
          that says &quot;which branch am I on right now?&quot; When you commit,{" "}
          <code>HEAD</code>&apos;s branch advances automatically; the other branch stays put. This
          is how two branches can diverge from a shared ancestor and then be recombined later.
        </>
      ),
      code: `# Create a branch — just a new pointer at the same commit
$ git branch feature
$ git checkout feature
Switched to branch 'feature'

# HEAD now points at 'feature', not 'main'
$ cat .git/HEAD
ref: refs/heads/feature

# After a commit, 'feature' advances; 'main' stays put
$ git commit -am "add greeting"
[feature abc1234] add greeting

$ git log --oneline --graph --all
* abc1234 (HEAD -> feature) add greeting
* c0ffee1 (main) initial`,
    },
    {
      title: "Step 3: Merge vs rebase",
      description: (
        <>
          <em>Merge</em> — combining two branches by creating a merge commit with two parents —
          preserves the full history exactly as it happened. The branches remain visible in the
          graph. Use merge on shared branches like <code>main</code> so every contributor&apos;s
          context is preserved. <em>Rebase</em> — replaying one branch&apos;s commits on top of
          another, rewriting history — produces a linear sequence as if you had branched off the
          latest commit from the start. Use rebase on your own feature branch before opening a
          pull request: reviewers get a clean, sequential story. The golden rule: never rebase
          commits that other people have already pulled.
        </>
      ),
      code: `# --- MERGE: creates a merge commit, preserves both histories ---
$ git checkout main
$ git merge feature
Merge made by the 'ort' strategy.
 README.md | 1 +

$ git log --oneline --graph
*   d4ea2b1 (HEAD -> main) Merge branch 'feature'
|\\
| * abc1234 (feature) add greeting
|/
* c0ffee1 initial

# --- REBASE: replays commits, gives a linear history ---
$ git checkout feature
$ git rebase main
Successfully rebased and updated refs/heads/feature.

$ git log --oneline --graph
* ff0c3a9 (HEAD -> feature) add greeting   ← new SHA (history was rewritten)
* c0ffee1 (main) initial`,
    },
    {
      title: "Step 4: Resolving conflicts",
      description: (
        <>
          A conflict happens when two branches modify the same lines of the same file. Git
          cannot pick a winner automatically, so it writes both versions into the file surrounded
          by markers and asks you to decide. <code>{"<<<<<<< HEAD"}</code> is the current
          branch&apos;s version; <code>{">>>>>>> branch"}</code> is the incoming version; the{" "}
          <code>=======</code> divides them. Edit the file to the result you want, remove all
          markers, then <code>git add</code> the file. If you are in the middle of a merge,
          finish with <code>git commit</code>; if you are rebasing, finish with{" "}
          <code>git rebase --continue</code>.
        </>
      ),
      code: `# Git inserts conflict markers into the file
<<<<<<< HEAD
Hello from main
=======
Hello from feature
>>>>>>> feature

# 1. Edit the file to your desired outcome
Hello from main and feature

# 2. Stage the resolved file
$ git add README.md

# 3a. If you were merging:
$ git commit

# 3b. If you were rebasing:
$ git rebase --continue

# Tip: git status always tells you which files still have conflicts.`,
    },
    {
      title: "Step 5: The reflog — your safety net",
      description: (
        <>
          <code>git reflog</code> records every position <code>HEAD</code> has been at on your
          local machine, regardless of how it got there — commits, checkouts, resets, rebases.
          When you think you lost work with <code>git reset --hard</code>, the commits are still
          in the object database; they are just no longer reachable from any branch pointer.
          The reflog keeps references to them for roughly 90 days before garbage collection runs.
          Find the SHA you want with <code>git reflog</code>, then recover with{" "}
          <code>git reset --hard HEAD@{"{N}"}</code> or by creating a new branch pointing at that
          SHA.
        </>
      ),
      code: `# You ran 'git reset --hard HEAD~3' and now the commits look gone
$ git log --oneline
c0ffee1 (HEAD -> main) initial   ← only the first commit visible

# But git reflog shows every HEAD position
$ git reflog
c0ffee1 HEAD@{0}: reset: moving to HEAD~3
ff0c3a9 HEAD@{1}: commit: third commit
abc1234 HEAD@{2}: commit: second commit
7b3c0e1 HEAD@{3}: commit: add greeting
c0ffee1 HEAD@{4}: commit (initial): initial

# Restore the three commits by pointing HEAD back
$ git reset --hard HEAD@{1}
HEAD is now at ff0c3a9 third commit

# Or create a branch at any reflog entry
$ git branch rescue ff0c3a9`,
    },
    {
      title: "Step 6: Pull requests",
      description: (
        <>
          A <em>pull request</em> — a GitHub workflow for proposing a branch&apos;s changes for
          review and merge — is not a Git concept; it is a GitHub feature layered on top of Git.
          You push your branch (<code>git push -u origin feature</code>), then open a PR on
          GitHub. Reviewers leave comments; you push more commits to the same branch and the PR
          updates automatically. When approved, the maintainer merges with one of three
          strategies: a regular merge commit (preserves graph structure), squash-merge (collapses
          all your commits into one), or rebase-merge (replays commits linearly). Each produces a
          different commit graph shape — pick what matches the team&apos;s history policy.
        </>
      ),
      code: `# Push your branch and set the upstream tracking reference (-u, first push only)
$ git push -u origin feature
To github.com:you/demo.git
 * [new branch]  feature -> feature
Branch 'feature' set up to track 'origin/feature'.

# Open a PR (GitHub CLI)
$ gh pr create --title "Add greeting" --body "Adds hello to README"

# After review, check PR status
$ gh pr status

# When approved — three merge strategies available in GitHub UI:
#   Merge commit       → git log shows a merge commit with two parents
#   Squash and merge   → all commits collapsed into one on main
#   Rebase and merge   → commits replayed linearly onto main (no merge commit)`,
    },
  ];

  const terminalLines = [
    { command: "git init", output: "Initialized empty Git repository in /tmp/demo/.git/" },
    { command: "echo '# demo' > README.md", output: "" },
    { command: "git add README.md", output: "" },
    { command: "git commit -m 'initial'", output: "[main (root-commit) c0ffee1] initial\n 1 file changed, 1 insertion(+)" },
    { command: "git branch feature", output: "" },
    { command: "git checkout feature", output: "Switched to branch 'feature'" },
    { command: "echo 'hello' >> README.md", output: "" },
    { command: "git commit -am 'add greeting'", output: "[feature decade1a] add greeting\n 1 file changed, 1 insertion(+)" },
    { command: "git checkout main", output: "Switched to branch 'main'" },
    { command: "git merge feature", output: "Updating c0ffee1..decade1a\nFast-forward\n README.md | 1 +\n 1 file changed, 1 insertion(+)" },
    { command: "git log --oneline --graph", output: "* decade1a (HEAD -> main, feature) add greeting\n* c0ffee1 initial" },
    { command: "git push -u origin main", output: "To github.com:you/demo.git\n   c0ffee1..decade1a  main -> main\nBranch 'main' set up to track 'origin/main'." },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Git Log Visualizer</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>git log --graph --oneline</h2>
  <p class="hint">Click any commit dot to highlight its parent chain.</p>
  <div id="graph" class="graph">
    <div class="lane lane-main">
      <div class="commit" data-sha="f3c" data-parent="b2a" data-branch="main">
        <span class="dot dot-main"></span>
        <span class="sha">f3c9d1e</span>
        <span class="msg">Merge branch &apos;feature&apos;</span>
        <span class="ref ref-main">main</span>
      </div>
      <div class="commit" data-sha="c0f" data-parent="" data-branch="main">
        <span class="dot dot-main"></span>
        <span class="sha">c0ffee1</span>
        <span class="msg">initial</span>
      </div>
    </div>
    <div class="lane lane-feature">
      <div class="commit" data-sha="b2a" data-parent="c0f" data-branch="feature">
        <span class="dot dot-feature"></span>
        <span class="sha">b2a4c7f</span>
        <span class="msg">add greeting</span>
        <span class="ref ref-feature">feature</span>
      </div>
      <div class="commit" data-sha="a1b" data-parent="c0f" data-branch="feature">
        <span class="dot dot-feature"></span>
        <span class="sha">a1b3e9d</span>
        <span class="msg">add feature file</span>
      </div>
    </div>
  </div>
  <div id="info" class="info">Select a commit above.</div>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 700px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
  background: #fff;
}
h2 { font-size: 1.1rem; margin-bottom: 4px; }
.hint { font-size: 0.82rem; color: #64748b; margin-bottom: 20px; }
.graph {
  display: flex;
  gap: 32px;
  background: #0f172a;
  padding: 20px 24px;
  border-radius: 10px;
  margin-bottom: 16px;
}
.lane { display: flex; flex-direction: column; gap: 16px; }
.lane-main { min-width: 260px; }
.lane-feature { min-width: 260px; }
.commit {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.15s;
  border: 2px solid transparent;
}
.commit:hover { background: #1e3a5f; }
.commit.selected { border-color: #facc15; background: #1e3a5f; }
.commit.highlighted { border-color: #38bdf8; background: #0f2d47; }
.dot {
  width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
}
.dot-main { background: #22c55e; }
.dot-feature { background: #a78bfa; }
.sha { font-family: monospace; font-size: 0.78rem; color: #94a3b8; }
.msg { font-size: 0.85rem; color: #e2e8f0; flex: 1; }
.ref {
  font-family: monospace; font-size: 0.72rem;
  padding: 1px 6px; border-radius: 4px; font-weight: 600;
}
.ref-main { background: #166534; color: #86efac; }
.ref-feature { background: #4c1d95; color: #c4b5fd; }
.info {
  padding: 12px 16px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 0.88rem;
  color: #334155;
  min-height: 48px;
  line-height: 1.5;
}`;

  const playgroundJs = `// Try this: click any commit dot below to see its parent chain highlighted.
// Then in your real terminal, run \`git log --oneline --graph --all\` on any
// repo and read the same shape — branches, merges, divergence.

const parents = {
  "f3c": ["b2a", "c0f"],
  "b2a": ["c0f"],
  "a1b": ["c0f"],
  "c0f": [],
};

const messages = {
  "f3c": "Merge commit — two parents: b2a (feature) and c0f (main). The merge commit unifies both lines of history.",
  "b2a": "Last commit on feature branch. Parent is c0f (the point where feature diverged from main).",
  "a1b": "Earlier commit on feature. Also has c0f as parent — same divergence point.",
  "c0f": "Root commit — no parent. Every branch in this repo traces back to this snapshot.",
};

function getAncestors(sha) {
  const visited = new Set();
  const queue = [sha];
  while (queue.length) {
    const cur = queue.shift();
    if (visited.has(cur)) continue;
    visited.add(cur);
    (parents[cur] || []).forEach(p => queue.push(p));
  }
  return visited;
}

document.querySelectorAll(".commit").forEach(el => {
  el.addEventListener("click", () => {
    const sha = el.dataset.sha;
    const ancestors = getAncestors(sha);

    document.querySelectorAll(".commit").forEach(c => {
      c.classList.remove("selected", "highlighted");
    });

    el.classList.add("selected");
    document.querySelectorAll(".commit").forEach(c => {
      if (c !== el && ancestors.has(c.dataset.sha)) {
        c.classList.add("highlighted");
      }
    });

    document.getElementById("info").textContent = messages[sha] || "";
  });
});`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Git&apos;s reputation for being scary is mostly leftover trauma from running{" "}
              <code>rebase -i</code> without understanding what it did. Once you see the model
              — <em>snapshots and pointers, that&apos;s it</em> — every command makes sense,
              every disaster is recoverable, and force-push stops being a curse word.
            </p>
            <p>
              The commands that terrify beginners (<code>reset --hard</code>,{" "}
              <code>rebase --onto</code>, <code>reflog</code>) are terrifying only because the
              underlying model is invisible. This module makes the model visible first, then maps
              each command onto it. By the end you will be able to read a branching history,
              choose between merge and rebase on purpose, and recover a &quot;lost&quot; commit
              in under a minute.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model first                                         */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Every Git concept maps onto one of two ideas: a <strong>snapshot</strong> (a
              commit — an immutable record of the entire working tree at a point in time,
              addressed by its SHA-1 hash) or a <strong>pointer</strong> (a branch — a movable
              reference that advances with each new commit). The working directory is just
              what a particular snapshot looks like when unpacked onto disk.{" "}
              <code>HEAD</code> is the pointer to your current position. Every command —{" "}
              <code>merge</code>, <code>rebase</code>, <code>reset</code>, <code>checkout</code>{" "}
              — is an operation on snapshots and pointers. When you see it that way, nothing
              is magic and very little is permanent.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Git tracks snapshots, not diffs. A branch is a movable pointer to a commit.
              Almost everything is recoverable through the reflog.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From init to pull request"
        description="Six steps that cover the complete Git mental model"
        steps={initToPrSteps}
      />

      {/* Optional: TerminalPlayground (Git session) */}
      <TerminalPlayground
        title="Your first commit"
        description="A complete init → commit → branch → merge → push session"
        lines={terminalLines}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Git log graph visualizer"
        description="Click any commit to see its parent chain highlighted — the same shape you read in git log --oneline --graph."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="You're working on 'feature-x', branched from 'main'. 'main' has moved on. You want your PR to apply cleanly. Merge or rebase?"
        options={[
          { id: "a", text: "Merge 'main' into 'feature-x' — preserves both histories." },
          { id: "b", text: "Rebase 'feature-x' onto 'main' — replays your commits on the latest main; cleaner history." },
          { id: "c", text: "Force-push 'feature-x' over 'main'." },
          { id: "d", text: "Delete 'feature-x' and start over." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Rebasing your <em>own</em> feature branch onto the latest main keeps the PR&apos;s
            history linear and easy to review. Merging main <em>into</em> feature-x adds a merge
            commit that obscures your work. Never force-push or rewrite history on shared branches.
          </>
        }
      />

      <Challenge
        question="You ran 'git reset --hard HEAD~3' and the three commits are gone. They're not in git log. Are they recoverable?"
        options={[
          { id: "a", text: "No — --hard permanently deletes commits." },
          { id: "b", text: "Yes — git reflog shows every HEAD position; git reset --hard HEAD@{1} restores them." },
          { id: "c", text: "Yes — git stash list will show them." },
          { id: "d", text: "No — once a commit is unreachable from any branch, garbage collection wipes it immediately." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            <code>git reflog</code> records every move of HEAD on your local machine, regardless
            of how it got there. Reset doesn&apos;t delete commits; it just moves the pointer. The
            commits live on for roughly 90 days before garbage collection — plenty of time to find
            them.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "'git pull' is fetch + merge — and creates merge commits silently; many teams configure pull.rebase=true instead",
            body: (
              <>
                Running <code>git pull</code> on a branch where both you and the remote have new
                commits produces a merge commit that nobody asked for. Configure{" "}
                <code>git config --global pull.rebase true</code> to make <code>git pull</code>{" "}
                rebase by default, keeping history linear. The silent merge commit surprises
                people the first time they run <code>git log --graph</code>.
              </>
            ),
          },
          {
            title: "Detached HEAD is a footgun, not a bug — make a branch before you commit anything you want to keep",
            body: (
              <>
                Checking out a commit SHA directly (<code>git checkout c0ffee1</code>) puts Git
                in &quot;detached HEAD&quot; state — HEAD points to a commit, not a branch. Any
                commits you make here will be orphaned as soon as you checkout something else
                because no branch pointer advances. Create a branch first:{" "}
                <code>git checkout -b rescue c0ffee1</code>.
              </>
            ),
          },
          {
            title: "Force-pushing to a shared branch destroys others' work; force-pushing your own feature branch is fine and often necessary after rebase",
            body: (
              <>
                After a rebase, your local commits have new SHAs that diverge from the remote.
                You must <code>git push --force-with-lease</code> to update the remote. The{" "}
                <code>--force-with-lease</code> flag (safer than <code>--force</code>) refuses
                to overwrite if someone else has pushed in the meantime. Never force-push to{" "}
                <code>main</code> or any branch others pull from.
              </>
            ),
          },
          {
            title: "'git stash' is amnesia disguised as backup — prefer a WIP commit you can find and revert",
            body: (
              <>
                <code>git stash</code> saves changes to a hidden stack, but that stack is
                invisible in <code>git log</code>, isn&apos;t pushed to the remote, and is easy
                to forget. A <code>git commit -m &quot;WIP: [description]&quot;</code> is visible, named,
                and recoverable from any machine. Push it to the remote if you want real backup.
                Use <code>git reset HEAD~1</code> to un-commit and put the changes back in your
                working directory when you&apos;re ready to clean up.
              </>
            ),
          },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 7: KeyTakeaways                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={[
          <>
            A <em>commit</em> is a snapshot of the entire working tree addressed by the SHA-1 of
            its contents. Commits are immutable — changing anything produces a new SHA.
          </>,
          <>
            A <em>branch</em> is a movable pointer to a commit. Creating a branch costs nothing;
            switching branches just moves <code>HEAD</code>.
          </>,
          <>
            <em>Merge</em> preserves history with a merge commit; use it for shared branches.{" "}
            <em>Rebase</em> replays commits to produce a linear history; use it on your own
            feature branch before a pull request.
          </>,
          <>
            Resolving a conflict means editing the file, removing conflict markers, staging with{" "}
            <code>git add</code>, and finishing with <code>git commit</code> or{" "}
            <code>git rebase --continue</code>.
          </>,
          <>
            <code>git reflog</code> is your safety net: every HEAD position is recorded for
            roughly 90 days. <code>git reset --hard</code> does not delete commits — it just
            moves the pointer away from them.
          </>,
          <>
            A <em>pull request</em> is a GitHub layer on top of Git: push your branch, open a
            PR, receive review, push more commits, and choose a merge strategy (merge commit,
            squash, or rebase) when approved.
          </>,
        ]}
        mentalModel="Git tracks snapshots, not diffs. A branch is a movable pointer to a commit. Almost everything is recoverable through the reflog."
      />
    </div>
  );
}
