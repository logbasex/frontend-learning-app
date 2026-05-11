"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { TerminalPlayground } from "@/components/TerminalPlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { LayeredFlow } from "@/components/LayeredFlow";

export function Module_3_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const shipItSteps = [
    {
      title: "git init — creating the snapshot store",
      description: (
        <p>
          Running <code>git init</code> inside a directory creates a hidden <code>.git/</code>{" "}
          folder. That folder <em>is</em> the repository — it holds every snapshot you will ever
          take. Nothing outside <code>.git/</code> changes. <code>git add</code> stages files,
          meaning you are telling Git: &quot;include these in the next snapshot.&quot;{" "}
          <code>git commit</code> takes the snapshot. A <em>commit</em> is a complete picture of
          every tracked file at that moment — not a list of changes, a full copy (efficiently
          compressed). The diff view you see in editors and on GitHub is a <em>rendering</em> of two
          snapshots placed side by side; Git itself stores the whole thing.
        </p>
      ),
      code: `$ cd examples/taproot-blog/static
$ git init
Initialized empty Git repository in .git/

$ git add index.html assets/styles.css assets/comments.js
# stages those three files for the next snapshot

$ git commit -m "initial: static blog"
[main (root-commit) a1b2c3d] initial: static blog
 3 files changed, 112 insertions(+)
 create mode 100644 index.html
 create mode 100644 assets/styles.css
 create mode 100644 assets/comments.js

# .git/ now holds one commit — one complete snapshot.`,
      language: "bash",
    },
    {
      title: "git log — reading history like a story",
      description: (
        <p>
          Every <em>commit</em> has a unique <em>SHA</em> (a 40-character hash that identifies it),
          a parent commit (or two, for a merge), an author, a date, and a message. The chain of
          commits is the history. <code>git log --oneline --graph</code> prints it in a compact
          one-line-per-commit form with ASCII art for branches. Reading it from bottom to top gives
          you the story of the project: what changed, who changed it, and when. The message is your
          future self&apos;s documentation — &quot;fix button alignment&quot; tells future you
          nothing; &quot;fix: button overlaps nav on mobile below 375px&quot; tells future you
          exactly when and why.
        </p>
      ),
      code: `$ git log --oneline --graph
* e4f5a6b (HEAD -> main) fix: button overlaps nav on mobile below 375px
* 9d8c7b6 feat: add comment section with lazy fetch
* a1b2c3d initial: static blog

# Each line is one commit.
# The SHA (e4f5a6b) lets you inspect or revert to any point.
# (HEAD -> main) shows where the main branch pointer currently sits.

$ git show e4f5a6b
# prints the full commit: message, author, date, and the diff
# between this snapshot and its parent.`,
      language: "bash",
    },
    {
      title: "Branches — movable pointers, not copies",
      description: (
        <p>
          A <em>branch</em> is a movable pointer to a commit. That is it — not a copy of the files,
          not a separate folder. <code>git branch fix-css</code> creates a new pointer named{" "}
          <code>fix-css</code> pointing at the current commit. <code>git checkout fix-css</code>{" "}
          moves <code>HEAD</code> (the &quot;you are here&quot; marker) to that branch. Every new{" "}
          <code>git commit</code> advances the pointer. Meanwhile <code>main</code> stays where it
          was. Branching is cheap because creating or switching a branch is just writing a 40-byte
          pointer — not copying a gigabyte of files. This is why the standard workflow is: make
          every change on a branch, not directly on <code>main</code>.
        </p>
      ),
      code: `$ git branch fix-css
# creates a new pointer called fix-css at the current commit
# (does NOT switch to it yet)

$ git checkout fix-css
Switched to branch 'fix-css'

# OR the shorthand that creates + switches in one step:
$ git checkout -b fix-css

# Now edit assets/styles.css and commit:
$ git add assets/styles.css
$ git commit -m "fix: restore link colour overwritten in experiment"
[fix-css 7a8b9c0] fix: restore link colour overwritten in experiment

# main is still at e4f5a6b.
# fix-css is now at 7a8b9c0.
# Two pointers; one commit graph.`,
      language: "bash",
    },
    {
      title: "Merging and rebasing — joining histories",
      description: (
        <p>
          When <code>fix-css</code> is ready, you need to bring it back into <code>main</code>.{" "}
          <em>Merge</em> joins the two histories with a <em>merge commit</em> — a commit with two
          parents. The result is faithful to what actually happened: two lines of work, converged.{" "}
          <em>Rebase</em> replays your branch&apos;s commits on top of main&apos;s current tip,
          rewriting their SHAs, producing a clean linear history as if no branching ever happened.
          Both are correct. On a solo project or a team that values fidelity, merge. On a team that
          values a clean, bisectable log, rebase before merging. Never rebase a branch that other
          people have already checked out — rewriting SHAs breaks their history.
        </p>
      ),
      code: `# --- Merge path ---
$ git checkout main
$ git merge fix-css
Merge made by the 'ort' strategy.
 assets/styles.css | 4 ++--

# git log --oneline --graph now shows a fork and rejoin:
# *   d1e2f3a (HEAD -> main) Merge branch 'fix-css'
# |\
# | * 7a8b9c0 (fix-css) fix: restore link colour overwritten in experiment
# |/
# * e4f5a6b feat: add comment section with lazy fetch

# --- Rebase path (alternative) ---
$ git checkout fix-css
$ git rebase main         # replay fix-css commits on top of main
$ git checkout main
$ git merge fix-css       # fast-forward: just moves the pointer
# Result: linear history, no merge commit.`,
      language: "bash",
    },
    {
      title: "Conflicts — a tool, not a curse",
      description: (
        <p>
          A <em>conflict</em> happens when two branches edit the same line of the same file. Git
          halts the merge and marks the file with conflict markers so you can decide which version
          to keep. This is deliberate: Git refuses to guess. The file looks intimidating the first
          time, but the structure is mechanical: everything between <code>{"<<<<<<<"}  HEAD</code>{" "}
          and <code>=======</code> is your branch; everything between <code>=======</code> and{" "}
          <code>{">>>>>>>"} fix-css</code> is the incoming branch. You read both, keep (or combine)
          what you want, delete the markers, then stage and commit. That is it.
        </p>
      ),
      code: `# Git halts the merge and reports:
Auto-merging assets/styles.css
CONFLICT (content): Merge conflict in assets/styles.css
Automatic merge failed; fix conflicts and then commit the result.

# assets/styles.css now contains:
<<<<<<< HEAD
  color: #5b21b6;
=======
  color: #3b82f6;
>>>>>>> fix-css

# Step 1: read both sides. main used purple; fix-css used blue.
# Step 2: decide. Keep the fix-css blue — that was the correction.
# Step 3: edit the file to the resolved version (remove markers):
  color: #3b82f6;

# Step 4: stage and finish the merge:
$ git add assets/styles.css
$ git commit
[main c2d3e4f] Merge branch 'fix-css'`,
      language: "bash",
    },
    {
      title: "Remotes — publishing the history",
      description: (
        <p>
          Everything so far exists only on your laptop. A <em>remote</em> is a copy of the
          repository hosted somewhere else — GitHub, GitLab, Bitbucket, any server that speaks the
          Git protocol. <code>git remote add origin ...</code> names that copy{" "}
          <code>origin</code> (the conventional name for the primary remote).{" "}
          <code>git push -u origin main</code> sends your commits there. The <code>-u</code> flag
          sets <code>origin/main</code> as the tracking branch so future <code>git push</code> and{" "}
          <code>git pull</code> commands need no arguments. <code>git pull</code> fetches remote
          changes and merges them; <code>git fetch</code> fetches without merging (safer when you
          want to inspect first).
        </p>
      ),
      code: `# Create the repo on GitHub, then link it:
$ git remote add origin git@github.com:you/taproot-blog.git

# Push main to the remote for the first time:
$ git push -u origin main
Enumerating objects: 6, done.
Counting objects: 100% (6/6), done.
Writing objects: 100% (6/6), 4.51 KiB | 4.51 MiB/s, done.
Branch 'main' set up to track remote branch 'main' from 'origin'.

# From now on, 'git push' and 'git pull' with no arguments
# work on origin/main automatically.

# If a collaborator pushes while you are working:
$ git fetch origin      # downloads their commits but does not merge
$ git log origin/main   # inspect what they did
$ git merge origin/main # merge when ready (or: git pull does fetch+merge)`,
      language: "bash",
    },
    {
      title: "Hosting — a server that answers with your index.html",
      description: (
        <p>
          A static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages) is a server permanently
          willing to answer HTTP requests with your files. GitHub Pages is the simplest choice: it
          reads your repo&apos;s <code>main</code> branch and serves it at{" "}
          <code>https://you.github.io/taproot-blog/</code> — no build step, no configuration file,
          no server to maintain. <em>Continuous deployment</em> means every <code>git push</code> to
          the watched branch triggers an automatic redeploy. The chain is: commit &rarr; push &rarr;
          host picks up the push &rarr; serves the new files &rarr; URL updates for everyone. That
          is the entire pipeline for a static site.
        </p>
      ),
      code: `$ cd examples/taproot-blog/static
$ git init
$ git add .
$ git commit -m "initial: static blog"
$ gh repo create taproot-blog --public --source=. --push
# (GitHub CLI creates the remote and pushes in one command)

# Enable GitHub Pages:
# Settings -> Pages -> Branch: main / Folder: / (root) -> Save
# After ~30 seconds:
# https://you.github.io/taproot-blog/

# Every future push redeploys automatically:
$ git add assets/styles.css
$ git commit -m "fix: increase body font size for readability"
$ git push
# -> GitHub Pages rebuilds -> URL serves the new version

# ---- Alternative hosts (same idea, different CLI) ----
# Netlify:  npx netlify-cli deploy --prod --dir .
# Vercel:   npx vercel --prod
# Both watch main and redeploy on push once linked.`,
      language: "bash",
    },
  ];

  const terminalLines = [
    {
      command: "# Try this: rename a file with 'git mv' and check 'git status' before committing",
      output: "",
      delayMs: 600,
    },
    {
      command: "git init",
      output: "Initialized empty Git repository in .git/",
      delayMs: 700,
    },
    {
      command: "git status",
      output: `On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html
        assets/

nothing added to commit but untracked files present`,
      delayMs: 700,
    },
    {
      command: "git add .",
      output: "",
      delayMs: 600,
    },
    {
      command: "git commit -m \"initial: static blog\"",
      output: `[main (root-commit) a1b2c3d] initial: static blog
 3 files changed, 112 insertions(+)
 create mode 100644 index.html
 create mode 100644 assets/styles.css
 create mode 100644 assets/comments.js`,
      delayMs: 800,
    },
    {
      command: "git log --oneline --graph",
      output: "* a1b2c3d (HEAD -> main) initial: static blog",
      delayMs: 700,
    },
    {
      command: "git checkout -b fix-css",
      output: "Switched to a new branch 'fix-css'",
      delayMs: 700,
    },
    {
      command: "git add assets/styles.css && git commit -m \"fix: restore link colour\"",
      output: `[fix-css 7a8b9c0] fix: restore link colour
 1 file changed, 2 insertions(+), 2 deletions(-)`,
      delayMs: 800,
    },
    {
      command: "git checkout main && git merge fix-css",
      output: `Switched to branch 'main'
Updating a1b2c3d..7a8b9c0
Fast-forward
 assets/styles.css | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)`,
      delayMs: 900,
    },
    {
      command: "git log --oneline --graph",
      output: `* 7a8b9c0 (HEAD -> main, fix-css) fix: restore link colour
* a1b2c3d initial: static blog`,
      delayMs: 700,
    },
    {
      command: "git push -u origin main",
      output: `Enumerating objects: 6, done.
Writing objects: 100% (6/6), 4.51 KiB | 4.51 MiB/s, done.
Branch 'main' set up to track remote branch 'main' from 'origin'.`,
      delayMs: 900,
    },
  ];

  const deployPipelineStages = [
    { label: "git commit", detail: "Snapshot taken locally", color: "blue" as const },
    { label: "git push", detail: "Sent to GitHub remote", color: "violet" as const },
    { label: "Pages trigger", detail: "Host detects new commit", color: "emerald" as const },
    { label: "Serve files", detail: "index.html goes live", color: "amber" as const },
    { label: "CDN edge", detail: "Cached globally", color: "rose" as const },
    { label: "URL live", detail: "you.github.io/taproot-blog", color: "slate" as const },
  ];

  const gotchaItems = [
    {
      title: "git commit -m sets the message but stages nothing — git add is what selects what to commit",
      body: (
        <>
          Running <code>git commit -m &quot;my change&quot;</code> with nothing staged produces an
          empty commit (or an error on a fresh repo). The <code>-m</code> flag only supplies the
          message. It is <code>git add</code> that moves files into the staging area — the set of
          changes that will be included in the next snapshot. If you edited five files but only{" "}
          <code>git add</code>&apos;d two of them, your commit contains exactly those two. The
          others are still modified on disk but invisible to the history until you stage them.
        </>
      ),
    },
    {
      title: "git push --force rewrites the remote's history — on a shared branch, it deletes other people's work",
      body: (
        <>
          A regular <code>git push</code> is rejected if the remote has commits you do not have
          locally. That rejection is a safety net. <code>--force</code> overrides it and replaces
          the remote&apos;s history with yours. On a branch only you use, that is sometimes
          intentional. On a shared branch — <code>main</code>, a team feature branch — it silently
          removes any commits the remote had that yours did not. Those commits are not in the
          recycle bin; they are gone from the shared history. There is no undo that does not involve
          someone who still has the lost commits locally.
        </>
      ),
    },
    {
      title: "A .gitignore only ignores untracked files — files already committed stay in the history forever",
      body: (
        <>
          Adding <code>secrets.env</code> to <code>.gitignore</code> after you have already
          committed it does nothing. The file is already in the history; every clone of the repo
          gets it. <code>.gitignore</code> only prevents Git from noticing new, never-committed
          files. To remove a tracked file from history you need <code>git rm --cached</code> plus a
          history-rewriting step (<code>git filter-branch</code> or <code>git filter-repo</code>),
          and then a force-push — which means all collaborators need to re-clone. The lesson: add
          sensitive files to <code>.gitignore</code> <em>before</em> the first commit.
        </>
      ),
    },
    {
      title: "GitHub Pages serves static files directly — it does not run a build step unless you add a workflow",
      body: (
        <>
          GitHub Pages reads your files and serves them over HTTP. It does not run{" "}
          <code>npm run build</code>, does not install packages, and does not execute any server
          code. A hand-written HTML + CSS + JS site works immediately. A Next.js or Vite app does
          not — the source TypeScript is not what the browser runs; the compiled output is. For
          those you need a GitHub Actions workflow that builds the project and pushes the output to
          the <code>gh-pages</code> branch (or Netlify / Vercel, which run the build automatically
          on every push).
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">Ship It and Version It</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            It is Tuesday afternoon. You have been experimenting with the layout of{" "}
            <code>assets/styles.css</code> — trying a new colour palette, adjusting spacing,
            testing a different font stack. At some point you open the blog in the browser and
            something looks off. You check <code>styles.css</code>. The block you spent two hours
            on last week — the one that made the post header look exactly right — is gone. You hit
            Ctrl+Z. Nothing. The file was saved, the editor&apos;s undo history is gone, and there
            is no prior version anywhere on the laptop. It is simply gone.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            A week later, your friend asks if they can read the blog. You say sure — and then
            pause. &quot;What&apos;s the URL?&quot; You think for a moment. The answer is not a
            URL. The answer is: &quot;Uh... it&apos;s on my laptop. I can show you if you come
            over.&quot;
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            These are not edge cases. They are the two most basic things any piece of software
            needs to survive: a history that does not disappear when you make a mistake, and a home
            that is not a single hard drive. How do you get both?
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The instinctive answer to &quot;how do you track changes?&quot; is to store a log of
            edits — the diff between version N and version N+1. That is how most version-control
            systems worked in the 1990s. Git does something different. Every time you commit, Git
            stores a complete picture of every tracked file as it was at that moment. Not the diff,
            the whole thing. The diff you see in editors and on GitHub is computed on the fly by
            comparing two of those pictures side by side. This distinction is not academic — it is
            why Git branches are cheap to create, why you can inspect any file at any point in
            history without &quot;replaying&quot; edits, and why operations like rebase work at all.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            Git tracks snapshots, not diffs.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">From a folder on your laptop to a URL anyone can visit</h2>
      <StepByStepExplanation
        title="Deriving Git, GitHub, and continuous deployment"
        description="Each step solves one concrete problem: lost work, no history, no collaboration, no public URL, no automatic redeploy."
        steps={shipItSteps}
      />

      {/* Optional: deploy pipeline diagram */}
      <LayeredFlow
        title="The commit-to-URL chain"
        description="Every push to main triggers this chain automatically. The learner runs one command; the rest happens without further action."
        stages={deployPipelineStages}
        direction="horizontal"
      />

      {/* 4. Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <TerminalPlayground
        title="Git workflow — init, commit, branch, merge, push"
        description="Watch the full workflow play out. After the animation, try the hint at the top: rename a file with git mv, then inspect git status before committing to see how Git tracks the rename as a single operation."
        lines={terminalLines}
        prompt="$"
      />

      {/* 5. Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="What does git commit include?"
        question={`You run 'git status' and see this output:

Changes to be committed:
  modified:   index.html
  new file:   assets/logo.svg

Changes not staged for commit:
  modified:   assets/styles.css

Untracked files:
  assets/font.woff2

You run 'git commit -m "add logo"'. What will the commit contain?`}
        options={[
          {
            id: "a",
            text: "index.html and assets/logo.svg only. git commit snapshots whatever is in the staging area — the modified styles.css and untracked font.woff2 are not staged and will not be included.",
          },
          {
            id: "b",
            text: "index.html, assets/logo.svg, and assets/styles.css. git commit includes all modified tracked files, whether staged or not.",
          },
          {
            id: "c",
            text: "All four: index.html, assets/logo.svg, assets/styles.css, and assets/font.woff2. git commit -m snapshots the entire working directory.",
          },
          {
            id: "d",
            text: "Nothing — git commit requires git add -A before it will include any changes.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            <code>git commit</code> snapshots exactly what is in the <em>staging area</em> — the
            set of files shown under &quot;Changes to be committed.&quot; The <code>-m</code> flag
            only supplies the message; it does not change what is staged.{" "}
            <code>assets/styles.css</code> is modified but not staged (it appears under &quot;Changes
            not staged for commit&quot;), so it is excluded. <code>assets/font.woff2</code> is
            untracked — Git has never been told to watch it — so it is also excluded. The commit
            contains exactly <strong>index.html</strong> and <strong>assets/logo.svg</strong>. The
            other two changes will still be there after the commit, waiting for you to stage them in
            the next one.
          </p>
        }
      />

      <Challenge
        title="Merge or rebase?"
        question={`Your team has a policy: "the main branch must have a linear history so that git bisect works reliably." You have been working on a branch called 'add-dark-mode' for two days. main has moved on — three commits were merged by teammates while you were working. What is the correct sequence of commands before merging your branch?`}
        options={[
          {
            id: "a",
            text: "git checkout add-dark-mode && git rebase main — replays your commits on top of the latest main, producing a linear history that satisfies the team policy.",
          },
          {
            id: "b",
            text: "git checkout main && git merge add-dark-mode — merges your branch into main with a merge commit, which is the standard workflow regardless of team policy.",
          },
          {
            id: "c",
            text: "git checkout add-dark-mode && git merge main — merges the latest main into your branch, then you push. This produces a linear history on main.",
          },
          {
            id: "d",
            text: "git push --force — overwrites the remote's main with your branch, incorporating both your changes and theirs by force.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            The team policy requires a linear history. <em>Rebase</em> is the right tool: it
            replays your commits on top of <code>main</code>&apos;s current tip, rewriting their
            SHAs but preserving your changes and keeping the log bisectable. After the rebase,{" "}
            <code>git checkout main && git merge add-dark-mode</code> is a fast-forward merge — no
            merge commit, just advancing the pointer. Option B creates a merge commit, which violates
            the linear-history policy. Option C (merging main into your branch) adds a merge commit
            to your branch and still produces a merge commit when you merge back — same problem.
            Option D rewrites shared history and destroys your teammates&apos; commits: never do
            this on a shared branch.
          </p>
        }
      />

      {/* 6. GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        mentalModel="Git tracks snapshots, not diffs."
        points={[
          <>
            A <em>commit</em> is a complete snapshot of every tracked file at a given moment. The
            diff view you see in editors is computed by comparing two snapshots; it is not what Git
            stores. This is why branches are cheap and why you can recover any file from any point
            in history instantly.
          </>,
          <>
            A <em>branch</em> is a movable pointer to a commit — not a copy of the files. Creating
            or switching a branch costs 40 bytes. Work on a branch, keep <code>main</code> clean,
            merge or rebase when done.
          </>,
          <>
            <em>Merge</em> joins histories with a merge commit (faithful to what happened).{" "}
            <em>Rebase</em> replays your commits on top of the target, producing a linear history.
            Conflicts in either case are mechanical: read both sides, choose, delete the markers,
            stage, and commit.
          </>,
          <>
            A <em>remote</em> is a published copy of the history. <code>git push</code> sends your
            commits there; <code>git pull</code> fetches and merges theirs. GitHub is the most
            common remote host. The remote is also your backup — everything on your laptop is
            recoverable from it.
          </>,
          <>
            A static host (GitHub Pages, Netlify, Vercel) answers HTTP requests with your files.{" "}
            <em>Continuous deployment</em> means every <code>git push</code> to the watched branch
            triggers a redeploy. The chain is: commit &rarr; push &rarr; redeploy &rarr; URL
            updates. This is the floor of shipping frontend work, not a finishing touch.
          </>,
        ]}
      />
    </div>
  );
}
