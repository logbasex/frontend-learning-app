export interface Module {
  id: string;
  title: string;
  description: string;
  phase: number;
  order: number;
  duration: string; // e.g., "30 mins"
  prerequisites: string[]; // module IDs
  learningObjectives: string[];
  mentalModels: string[];
  hasInteractiveDemo: boolean;
  hasDiagram: boolean;
  hasChallenge: boolean;
  hasCodeComparison: boolean;
}

export interface Phase {
  id: number;
  title: string;
  description: string;
  icon: string;
  modules: Module[];
}

export const curriculum: Phase[] = [
  {
    id: 1,
    title: "Web Fundamentals",
    description: "Understand how the first web worked (The Origins)",
    icon: "Globe",
    modules: [
      {
        id: "1-1-html-css",
        title: "Static HTML/CSS Era (1990s)",
        description: "How to display information on the internet? Understanding HTML structure and CSS presentation.",
        phase: 1,
        order: 1,
        duration: "25 mins",
        prerequisites: [],
        learningObjectives: [
          "Understand the roles of HTML (structure) and CSS (presentation)",
          "Master the browser rendering pipeline (HTML → DOM → CSSOM → Render Tree)",
          "Practice creating simple static web pages"
        ],
        mentalModels: [
          "Separation of Concerns (separating structure vs style)",
          "Declarative markup language"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "1-2-javascript",
        title: "Dynamic Web with JavaScript (2000s)",
        description: "Static web → Dynamic web. Users can interact with web pages through JavaScript.",
        phase: 1,
        order: 2,
        duration: "30 mins",
        prerequisites: ["1-1-html-css"],
        learningObjectives: [
          "Understand JavaScript DOM manipulation",
          "Master Event loop and asynchronous programming",
          "Practice building form validation with vanilla JS"
        ],
        mentalModels: [
          "Imperative programming (tell browser HOW to do)",
          "Event-driven architecture",
          "Callback pattern"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "1-3-jquery",
        title: "jQuery Era (2006-2015)",
        description: "Complex DOM API + browser inconsistency → jQuery simplified syntax",
        phase: 1,
        order: 3,
        duration: "20 mins",
        prerequisites: ["1-2-javascript"],
        learningObjectives: [
          "Understand why jQuery was created (browser compatibility)",
          "Compare vanilla JS vs jQuery syntax",
          "Recognize jQuery's limitations → lead to React"
        ],
        mentalModels: [
          "Library abstraction layer",
          "API design for developer experience"
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: true
      }
    ]
  },
  {
    id: 2,
    title: "Single Page Applications",
    description: "The Revolution - From multi-page apps to SPAs",
    icon: "Zap",
    modules: [
      {
        id: "2-1-why-spas",
        title: "Why SPAs? (Problem Definition)",
        description: "Full page reload is slow → SPAs with client-side routing",
        phase: 2,
        order: 1,
        duration: "20 mins",
        prerequisites: ["1-3-jquery"],
        learningObjectives: [
          "Understand problems of traditional multi-page apps",
          "Grasp the concept of client-side routing",
          "Compare network waterfall: MPA vs SPA"
        ],
        mentalModels: [
          "Client-side routing",
          "State as single source of truth",
          "Application shell architecture"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "2-2-virtual-dom",
        title: "Virtual DOM Revolution",
        description: "React's core innovation: Virtual DOM + Reconciliation algorithm",
        phase: 2,
        order: 2,
        duration: "35 mins",
        prerequisites: ["2-1-why-spas"],
        learningObjectives: [
          "Understand why DOM manipulation is slow",
          "Master the Virtual DOM diffing algorithm",
          "Practice: compare performance DOM vs VDOM"
        ],
        mentalModels: [
          "Declarative programming (tell WHAT, not HOW)",
          "Reconciliation algorithm",
          "Batch updates optimization"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "2-3-component-thinking",
        title: "Component Thinking",
        description: "UI = f(state) - Thinking with component-based architecture",
        phase: 2,
        order: 3,
        duration: "30 mins",
        prerequisites: ["2-2-virtual-dom"],
        learningObjectives: [
          "Understand philosophy of UI as function of state",
          "Master unidirectional data flow",
          "Practice: refactor jQuery spaghetti → React components"
        ],
        mentalModels: [
          "UI = f(state)",
          "Composition over inheritance",
          "Props down, events up (unidirectional flow)"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      }
    ]
  },
  {
    id: 3,
    title: "Modern React Patterns",
    description: "Hooks, State management, Performance optimization",
    icon: "Sparkles",
    modules: [
      {
        id: "3-1-hooks",
        title: "Hooks Philosophy (Why & When)",
        description: "Class components verbose → Hooks for functional components",
        phase: 3,
        order: 1,
        duration: "35 mins",
        prerequisites: ["2-3-component-thinking"],
        learningObjectives: [
          "Understand problems of Class components",
          "Master useState, useEffect, and custom hooks",
          "Practice: build custom hook for data fetching"
        ],
        mentalModels: [
          "Hooks = logic extraction/reuse",
          "Effect = synchronization with external system",
          "Dependency array mental model"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "3-2-state-management",
        title: "State Management Mental Models",
        description: "Local state, Context, Zustand, React Query - When to use what?",
        phase: 3,
        order: 2,
        duration: "40 mins",
        prerequisites: ["3-1-hooks"],
        learningObjectives: [
          "Understand trade-offs of each state solution",
          "Distinguish between server state and client state",
          "Decision tree: Which pattern should app X use?"
        ],
        mentalModels: [
          "Co-location principle",
          "Server state vs Client state",
          "Lift state up (but not too far)"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "3-3-performance",
        title: "Performance & Re-rendering",
        description: "Optimization trade-offs: memo, useMemo, useCallback",
        phase: 3,
        order: 3,
        duration: "35 mins",
        prerequisites: ["3-2-state-management"],
        learningObjectives: [
          "Understand when components re-render",
          "Master React.memo, useMemo, and useCallback",
          "Profiler: visualize performance bottlenecks"
        ],
        mentalModels: [
          "Premature optimization is evil",
          "Measure first, optimize second",
          "Re-render is cheap (most of the time)"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      }
    ]
  },
  {
    id: 4,
    title: "Server-Side Rendering",
    description: "The Pendulum Swings Back - SSR, SSG, ISR, RSC",
    icon: "Server",
    modules: [
      {
        id: "4-1-csr-problems",
        title: "CSR Problems (Why Go Back to Server?)",
        description: "SEO issues, slow initial load, waterfall requests → SSR",
        phase: 4,
        order: 1,
        duration: "25 mins",
        prerequisites: ["3-3-performance"],
        learningObjectives: [
          "Understand problems of pure Client-Side Rendering",
          "Compare network timeline: CSR vs SSR",
          "Lighthouse metrics: TTI vs TTFB"
        ],
        mentalModels: [
          "Time to First Byte vs Time to Interactive",
          "SEO crawlers limitations",
          "Initial payload size matters"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "4-2-rendering-spectrum",
        title: "SSR, SSG, ISR - Rendering Spectrum",
        description: "Not just CSR or SSR - also SSG, ISR and hybrid approaches",
        phase: 4,
        order: 2,
        duration: "40 mins",
        prerequisites: ["4-1-csr-problems"],
        learningObjectives: [
          "Understand trade-offs of SSR, SSG, and ISR",
          "Decision tree: use case X → which rendering pattern?",
          "Practice: implement each pattern with Next.js"
        ],
        mentalModels: [
          "Spectrum: Static ← → Dynamic",
          "Trade-offs: Freshness vs Speed vs Cost",
          "Stale-while-revalidate pattern"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "4-3-server-components",
        title: "React Server Components (The Future)",
        description: "Zero JS to client - Server Components architecture",
        phase: 4,
        order: 3,
        duration: "45 mins",
        prerequisites: ["4-2-rendering-spectrum"],
        learningObjectives: [
          "Understand Server Components vs Client Components",
          "Master RSC wire format and streaming",
          "Practice: refactor Client → Server Component"
        ],
        mentalModels: [
          "Progressive enhancement",
          "Hybrid architecture (Server + Client)",
          "Component boundary decisions"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      }
    ]
  },
  {
    id: 5,
    title: "Advanced Architecture",
    description: "Real-world decisions: Data fetching, Routing, Monorepos",
    icon: "Layers",
    modules: [
      {
        id: "5-1-data-fetching",
        title: "Data Fetching Patterns",
        description: "Evolution: useEffect+fetch → React Query → Server fetching",
        phase: 5,
        order: 1,
        duration: "40 mins",
        prerequisites: ["4-3-server-components"],
        learningObjectives: [
          "Understand evolution of data fetching patterns",
          "Compare: client fetch vs server fetch",
          "Decision: which pattern for real-time dashboard?"
        ],
        mentalModels: [
          "Colocation (fetch where you need data)",
          "Fetch-on-render vs Fetch-then-render",
          "Waterfall vs Parallel fetching"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "5-2-routing",
        title: "Routing & Navigation",
        description: "React Router vs Next.js App Router, Parallel routes, Intercepting routes",
        phase: 5,
        order: 2,
        duration: "35 mins",
        prerequisites: ["5-1-data-fetching"],
        learningObjectives: [
          "Understand file-system routing philosophy",
          "Master nested layouts and parallel routes",
          "Practice: build complex routing with Next.js"
        ],
        mentalModels: [
          "File-system routing",
          "Convention over configuration",
          "Route lifecycle (loading, error states)"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true
      },
      {
        id: "5-3-architecture-decisions",
        title: "Real-World Architecture Decisions",
        description: "Monorepo, Styling, TypeScript, Testing - Trade-offs matrix",
        phase: 5,
        order: 3,
        duration: "50 mins",
        prerequisites: ["5-2-routing"],
        learningObjectives: [
          "Decision matrix: Tailwind vs CSS-in-JS",
          "Monorepo trade-offs: Turborepo vs Nx",
          "Testing strategy: Unit vs Integration vs E2E"
        ],
        mentalModels: [
          "No silver bullet - only trade-offs",
          "Architecture decisions are reversible",
          "Start simple, scale when needed"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false
      }
    ]
  }
];

// Helper functions
export function getAllModules(): Module[] {
  return curriculum.flatMap(phase => phase.modules);
}

export function getModuleById(id: string): Module | undefined {
  return getAllModules().find(module => module.id === id);
}

export function getModulesByPhase(phaseId: number): Module[] {
  const phase = curriculum.find(p => p.id === phaseId);
  return phase?.modules || [];
}

export function getNextModule(currentModuleId: string): Module | undefined {
  const allModules = getAllModules();
  const currentIndex = allModules.findIndex(m => m.id === currentModuleId);

  if (currentIndex === -1 || currentIndex === allModules.length - 1) {
    return undefined;
  }

  return allModules[currentIndex + 1];
}

export function getPreviousModule(currentModuleId: string): Module | undefined {
  const allModules = getAllModules();
  const currentIndex = allModules.findIndex(m => m.id === currentModuleId);

  if (currentIndex <= 0) {
    return undefined;
  }

  return allModules[currentIndex - 1];
}

export function isModuleUnlocked(moduleId: string, completedModules: string[]): boolean {
  const module = getModuleById(moduleId);
  if (!module) return false;

  // Check if all prerequisites are completed
  return module.prerequisites.every(prereqId => completedModules.includes(prereqId));
}

export function getPhaseProgress(phaseId: number, completedModules: string[]): number {
  const phaseModules = getModulesByPhase(phaseId);
  if (phaseModules.length === 0) return 0;

  const completed = phaseModules.filter(m => completedModules.includes(m.id)).length;
  return Math.round((completed / phaseModules.length) * 100);
}

export function getTotalProgress(completedModules: string[]): number {
  const totalModules = getAllModules().length;
  if (totalModules === 0) return 0;

  return Math.round((completedModules.length / totalModules) * 100);
}
