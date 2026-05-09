"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const packageJson = `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "Example app showing a realistic package.json",
  "engines": {
    "node": ">=20.0.0",
    "npm":  ">=10.0.0"
  },
  "scripts": {
    "dev":     "vite",
    "build":   "tsc && vite build",
    "preview": "vite preview",
    "lint":    "eslint src --max-warnings 0",
    "test":    "vitest run"
  },
  "dependencies": {
    "react":     "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react":       "^18.3.3",
    "@types/react-dom":   "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint":             "^9.7.0",
    "typescript":         "^5.5.3",
    "vite":               "^5.3.4",
    "vitest":             "^2.0.3"
  }
}`;

const lockfileExcerpt = `{
  "name": "my-app",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "dependencies": { "react": "^18.3.1" }
    },
    "node_modules/react": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
      "integrity": "sha512-wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2Q==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0"
      },
      "engines": { "node": ">=0.10.0" }
    }
  }
}`;

export function Module_5_2_Content() {
  return (
    <ScaffoldModule
      emoji="📦"
      problemTitle="npm vs pnpm vs yarn — the lockfile is doing more than you think"
      problem={
        <>
          <p>
            <code>package.json</code> <strong>declares</strong> what your
            project needs, using version <em>ranges</em> like{" "}
            <code>^18.3.1</code>. The caret means &quot;accept any compatible
            version up to but not including the next major.&quot; This is the
            Semver contract: <strong>MAJOR.MINOR.PATCH</strong> — breaking
            change, new feature, bug fix. The lockfile (
            <code>package-lock.json</code>, <code>yarn.lock</code>, or{" "}
            <code>pnpm-lock.yaml</code>) <strong>resolves</strong> those ranges
            to exact versions, pinning the precise tree of every dependency and
            its transitive dependencies. Every developer and every CI run
            installs the exact same bytes.
          </p>
          <p>
            <strong>pnpm</strong> stores each package version exactly once in a
            global content-addressed store on disk, then hard-links (or symlinks
            on some systems) them into each project&apos;s{" "}
            <code>node_modules</code>. This makes installs fast (nothing is
            re-downloaded or re-extracted), disk usage tiny, and dependency
            isolation strict — your code cannot accidentally import a package
            that is not declared in your own <code>package.json</code>.{" "}
            <strong>Yarn Classic</strong> (v1) popularised deterministic installs
            and the lockfile concept. <strong>npm</strong> caught up with{" "}
            <code>package-lock.json</code> in npm v5 and is now the default
            choice for most projects.
          </p>
          <p>
            The practical rule: commit the lockfile to version control, use one
            package manager consistently across a project (do not mix{" "}
            <code>npm install</code> and <code>yarn add</code>), and run{" "}
            <code>npm ci</code> (not <code>npm install</code>) in CI pipelines —
            it installs exactly what the lockfile says and fails if the lockfile
            is out of sync with <code>package.json</code>.
          </p>
        </>
      }
      body={
        <>
          <CodeBlock
            language="json"
            fileName="package.json"
            code={packageJson}
          />
          <div className="mt-4">
            <CodeBlock
              language="json"
              fileName="package-lock.json (excerpt)"
              code={lockfileExcerpt}
            />
          </div>
        </>
      }
      challenge={{
        question: "Why should you commit the lockfile to version control?",
        options: [
          {
            id: "a",
            text: "Lockfiles contain compiled code that makes installs faster on other machines.",
          },
          {
            id: "b",
            text: "So every developer and CI run installs the EXACT same dependency tree, ruling out 'works on my machine' from version drift.",
          },
          {
            id: "c",
            text: "You must commit the lockfile because npm will refuse to install without it.",
          },
          {
            id: "d",
            text: "The lockfile replaces package.json — you only need one or the other.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            Without a committed lockfile, <code>npm install</code> resolves
            version ranges fresh each time. If a transitive dependency has
            released a new patch or minor version since a colleague last
            installed, they get a different tree. The lockfile pins every
            package to an exact version plus an integrity hash, ensuring
            reproducible installs across every machine, container, and CI job
            that runs <code>npm ci</code>.
          </>
        ),
      }}
      takeaways={[
        <>
          <code>package.json</code> declares intent with version ranges.
          Lockfiles resolve those ranges to exact, immutable versions. Always
          commit the lockfile.
        </>,
        <>
          Semver is a three-part contract: MAJOR (breaking), MINOR (additive),
          PATCH (fix). The <code>^</code> caret accepts compatible updates but
          not the next major.
        </>,
        <>
          pnpm&apos;s content-addressed store gives you fast installs, minimal
          disk use, and strict isolation. Use <code>npm ci</code> in CI
          pipelines for guaranteed reproducibility.
        </>,
      ]}
      mentalModel="package.json declares; the lockfile resolves. Semver is a contract — sometimes broken, but always declared."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
