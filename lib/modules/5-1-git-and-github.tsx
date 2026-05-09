"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const gitWorkflow = `# 1. Create a feature branch from up-to-date main
git switch main
git pull                          # make sure main is current
git switch -c feat/add-login      # new branch = new movable pointer

# 2. Make changes and stage interactively
#    -p lets you review each hunk before staging — great hygiene
git add -p

# 3. Commit with a Conventional Commit message
#    feat / fix / chore / refactor / docs / test / perf
git commit -m "feat: add login form with email validation"

# 4. Push and set the upstream tracking branch (-u only needed first time)
git push -u origin feat/add-login

# 5. Open a Pull Request using the GitHub CLI
gh pr create --fill              # uses branch name + commits as title/body
#   OR open the URL printed by git push

# 6. After PR is merged, clean up locally
git switch main
git pull                          # fast-forward main to include the merge commit
git branch -d feat/add-login      # safe delete — warns if not fully merged

# --- Keeping your feature branch up to date during review ---
# Rebase (preferred for feature branches): replays your commits on top of main,
# giving a linear history. Rewrites commit SHAs — never rebase shared branches.
git fetch origin
git rebase origin/main

# Merge (preferred for shared/long-lived branches): adds a merge commit but
# preserves the original commit history exactly.
git merge origin/main`;

export function Module_5_1_Content() {
  return (
    <ScaffoldModule
      emoji="🌳"
      problemTitle="Branch, commit, push, PR — the muscle memory of the trade"
      problem={
        <>
          <p>
            Git does not store diffs — it stores <strong>snapshots</strong> of
            the entire working tree at the time of each commit. A commit is an
            immutable node with a unique SHA; a <strong>branch</strong> is just
            a lightweight movable pointer to one of those nodes. When you commit
            on a branch, the pointer advances automatically. This model explains
            why branching in Git is nearly free (no file copying) and why you
            can have dozens of branches without penalty.
          </p>
          <p>
            <strong>
              <code>git merge</code>
            </strong>{" "}
            joins two branches by creating a new merge commit that has two
            parents. The original commits are preserved exactly as they
            happened, making the history an accurate record of what was done and
            when. Use merge for long-lived shared branches (like{" "}
            <code>main</code>) where preserving context matters.{" "}
            <strong>
              <code>git rebase</code>
            </strong>{" "}
            instead replays your commits one-by-one on top of the target branch,
            rewriting their SHAs. The result is a cleaner, linear history —
            great for feature branches before merging. The rule is simple: never
            rebase commits that have already been pushed and shared.
          </p>
          <p>
            The day-to-day workflow below covers the full loop: branch, stage
            with <code>git add -p</code> (interactive hunk selection), commit
            with a Conventional Commit message, push, open a PR with the{" "}
            <code>gh</code> CLI, and clean up after merge. Internalising this
            loop until it is muscle memory is more valuable than knowing every
            Git flag.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="bash"
          fileName="day-in-the-life.sh"
          code={gitWorkflow}
        />
      }
      challenge={{
        question: "What does `git rebase main` do on a feature branch?",
        options: [
          {
            id: "a",
            text: "Merges main into your feature branch, creating a merge commit.",
          },
          {
            id: "b",
            text: "Deletes your feature branch and replaces it with main.",
          },
          {
            id: "c",
            text: "Replays your feature-branch commits on top of the latest main, giving you a linear history without a merge commit.",
          },
          {
            id: "d",
            text: "Pushes your feature branch to the remote and sets it as the new main.",
          },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            <code>git rebase main</code> finds the common ancestor of your
            feature branch and <code>main</code>, temporarily removes your
            commits, fast-forwards to the tip of <code>main</code>, and then
            re-applies each of your commits one by one. The result is as if you
            had branched off the very latest <code>main</code>, producing a
            perfectly linear history. Because the commit SHAs change, you must{" "}
            <code>git push --force-with-lease</code> to update the remote — and
            you should never rebase commits others have already pulled.
          </>
        ),
      }}
      takeaways={[
        <>
          Git stores snapshots, not diffs. A branch is a movable pointer to a
          commit; commits are immutable nodes identified by their SHA.
        </>,
        <>
          Use <code>git rebase</code> to keep your feature branch linear before
          merging. Use <code>git merge</code> for shared branches where
          preserving the original history matters.
        </>,
        <>
          The <code>gh</code> CLI (<code>gh pr create</code>,{" "}
          <code>gh pr view</code>, <code>gh pr merge</code>) integrates GitHub
          into your terminal loop, saving context switches to the browser.
        </>,
      ]}
      mentalModel="Git tracks snapshots, not diffs. A branch is a movable pointer; a commit is an immutable node."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
