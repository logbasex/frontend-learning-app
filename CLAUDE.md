# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL REQUIREMENT: ENGLISH ONLY

**ALL CODE, COMMENTS, DOCUMENTATION, AND USER-FACING TEXT MUST BE IN ENGLISH**

This is a **MANDATORY** requirement. Do NOT use Vietnamese or any other language in:
- Code comments
- User-facing text (buttons, labels, headings, descriptions)
- Variable/function names
- Documentation
- Challenge questions and explanations
- Step-by-step explanations
- Mental models and key takeaways

See `.claude/instructions.md` for detailed language guidelines.

## Project Overview

This is a **Frontend Learning App** - an interactive, story-driven educational platform teaching frontend development from fundamentals to modern stack (HTML/CSS → JavaScript → React → Next.js → React Server Components). The app focuses on teaching **mental models and architectural thinking** rather than just syntax.

**Key Philosophy**: Problem → Solution approach. Each module explains WHY a technology was created, WHAT problem it solves, and WHEN to use it.

## Development Commands

```bash
# Start development server (runs on port 3001 if 3000 is occupied)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

**Dev Server**: Accessible at `http://localhost:3001` (or 3000)
**Key Routes**:
- `/` - Dashboard with curriculum overview
- `/lesson/[moduleId]` - Individual lesson page (e.g., `/lesson/1-1-html-css`)

## Architecture

### Module Content System

**Critical Pattern**: The app uses a **dynamic module loading system** where each lesson's content is a separate React component.

**Module Registration Flow**:
1. Create module content component: `lib/modules/[moduleId].tsx`
2. Export as `Module_X_Y_Content()` function
3. Register in `lib/modules/index.ts`:
   ```tsx
   import { Module_1_1_Content } from "./1-1-html-css";

   export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
     "1-1-html-css": Module_1_1_Content,
     // Add new modules here
   };
   ```
4. Lesson page (`app/lesson/[moduleId]/page.tsx`) dynamically loads and renders the component

**Module ID Convention**: `{phase}-{order}-{slug}` (e.g., `1-1-html-css`, `2-2-virtual-dom`)

### Data Flow Architecture

```
curriculum.ts (metadata)
    ↓
Dashboard (app/page.tsx) → renders all phases/modules
    ↓
Lesson Page (app/lesson/[moduleId]/page.tsx)
    ↓
getModuleContent(moduleId) → loads Module_X_Y_Content component
    ↓
Renders interactive content (CodePlayground, Diagrams, Challenges, etc.)
    ↓
progress.ts (Zustand store) → tracks completion in localStorage
```

### State Management

**Global State (Zustand)**: `lib/progress.ts`
- `completedModules: string[]` - IDs of finished lessons
- `bookmarkedModules: string[]` - User bookmarks
- `notes: Record<string, string>` - User notes per module
- `currentModule: string | null` - Currently viewing
- Persisted to `localStorage` key: `frontend-learning-progress`

**Curriculum State**: `lib/curriculum.ts`
- Static configuration for all 15 modules (5 phases)
- Helper functions: `getModuleById()`, `getNextModule()`, `getPreviousModule()`, `isModuleUnlocked()`
- **Unlock System**: Modules unlock only when prerequisites are completed

### Component Architecture

**Interactive Learning Components** (all in `components/`):

1. **CodePlayground** - Live code editor using Sandpack (CodeSandbox in-browser)
   - Variants: `HTMLPlayground` (HTML/CSS/JS), `ReactPlayground` (React code)
   - Real-time preview, syntax highlighting

2. **StepByStepExplanation** - Animated step-through explanations
   - Auto-play mode, progress bar, step indicators
   - Used for complex concepts (e.g., 7-step Browser Rendering Pipeline)

3. **InteractiveDiagram** - React Flow based flowcharts
   - Pre-built diagrams: `BrowserRenderingPipeline`, `VirtualDOMFlow`, `ComponentTree`
   - Draggable, zoomable nodes

4. **CodeComparison** - Side-by-side old vs new code comparison
   - Tabbed view (Split | Old Only | New Only)
   - Pros/Cons lists

5. **Challenge** - Quiz component
   - Multiple choice with detailed explanations
   - Instant feedback, reset capability

6. **CodeBlock** - Syntax highlighted code display (using Prism)

**UI Components** (shadcn/ui in `components/ui/`):
- Standard shadcn components: Button, Card, Badge, Progress, Tabs, etc.

## Module Content Pattern

**Reference Implementation**: `lib/modules/1-1-html-css.tsx` (~800 lines)

See `IMPLEMENTATION_GUIDE.md` for detailed patterns, but the core structure:

```tsx
export function Module_X_Y_Content() {
  // Define step-by-step explanations
  const conceptSteps: Step[] = [
    { title: "Step 1: ...", description: "...", code: "..." },
    // Minimum 5-7 steps for complex concepts
  ];

  return (
    <div className="space-y-8">
      {/* 1. Problem Statement - WHY this tech exists */}
      <Card>
        <CardContent className="prose">
          <h2>🌍 The Problem: ...</h2>
          <p>Historical context, problem description...</p>
        </CardContent>
      </Card>

      {/* 2. Step-by-step explanation */}
      <StepByStepExplanation
        title="..."
        steps={conceptSteps}
        autoPlay={true}
      />

      {/* 3. Interactive Demo */}
      <HTMLPlayground | ReactPlayground ... />

      {/* 4. Visual Diagram (optional) */}
      <SomeDiagram />

      {/* 5. Code Comparison (Old vs New) */}
      <CodeComparison oldCode={{...}} newCode={{...}} />

      {/* 6. Challenges (minimum 2) */}
      <Challenge question="..." correctAnswerId="..." explanation="..." />

      {/* 7. Key Takeaways */}
      <Card className="border-green-200">
        <h3>🎓 Key Takeaways</h3>
        <ol>...</ol>
        <div>💡 Mental Model: "..."</div>
      </Card>
    </div>
  );
}
```

**Critical Requirements for Each Module**:
- Start with a **problem statement** (story-driven)
- Include **step-by-step explanations** (not just code)
- Provide **interactive demos** (CodePlayground)
- Compare **old vs new approaches** (CodeComparison with pros/cons)
- Include **challenges** with detailed explanations (minimum 2)
- End with **Key Takeaways** and a **Mental Model** quote

**Content Depth**: Aim for ~25-50 minutes of reading/interaction per module. Module 1.1 is the gold standard with ~800 lines.

## Curriculum Structure

**5 Phases, 15 Modules Total**:

**Phase 1: Web Fundamentals**
- `1-1-html-css` - Static HTML/CSS Era (✅ COMPLETE - 800 lines)
- `1-2-javascript` - Dynamic Web with JavaScript (⏳ TODO)
- `1-3-jquery` - jQuery Era (⏳ TODO)

**Phase 2: Single Page Applications**
- `2-1-why-spas` - Why SPAs? (⏳ TODO)
- `2-2-virtual-dom` - Virtual DOM Revolution (⏳ TODO)
- `2-3-component-thinking` - Component Thinking (⏳ TODO)

**Phase 3: Modern React Patterns**
- `3-1-hooks` - Hooks Philosophy (⏳ TODO)
- `3-2-state-management` - State Management Mental Models (⏳ TODO)
- `3-3-performance` - Performance & Re-rendering (⏳ TODO)

**Phase 4: Server-Side Rendering**
- `4-1-csr-problems` - CSR Problems (⏳ TODO)
- `4-2-rendering-spectrum` - SSR, SSG, ISR (⏳ TODO)
- `4-3-server-components` - React Server Components (⏳ TODO)

**Phase 5: Advanced Architecture**
- `5-1-data-fetching` - Data Fetching Patterns (⏳ TODO)
- `5-2-routing` - Routing & Navigation (⏳ TODO)
- `5-3-architecture-decisions` - Real-World Architecture Decisions (⏳ TODO)

**Status**: 1/15 modules complete. See `IMPLEMENTATION_GUIDE.md` for detailed templates for remaining modules.

## Key Files

**Configuration**:
- `lib/curriculum.ts` - All 15 modules metadata, learning objectives, mental models
- `lib/progress.ts` - Zustand store for progress tracking

**Module Content**:
- `lib/modules/index.ts` - Module registry (add new modules here)
- `lib/modules/1-1-html-css.tsx` - Complete reference implementation
- `lib/modules/types.ts` - TypeScript types for module content

**Pages**:
- `app/page.tsx` - Dashboard with curriculum tree, progress bars, unlock system
- `app/lesson/[moduleId]/page.tsx` - Dynamic lesson viewer

**Interactive Components**:
- `components/CodePlayground.tsx` - Sandpack wrapper (HTML/React variants)
- `components/StepByStepExplanation.tsx` - Animated step-through
- `components/InteractiveDiagram.tsx` - React Flow diagrams
- `components/CodeComparison.tsx` - Side-by-side code view
- `components/Challenge.tsx` - Quiz component
- `components/CodeBlock.tsx` - Prism syntax highlighting

**Documentation**:
- `IMPLEMENTATION_GUIDE.md` - Comprehensive guide for implementing remaining 14 modules
- `README.md` - Project overview, setup, features

## Common Workflows

### Adding a New Module

1. **Create module file**:
   ```bash
   touch lib/modules/[moduleId].tsx
   ```

2. **Implement content** following the pattern in `IMPLEMENTATION_GUIDE.md`:
   - Problem statement
   - 5-7 step explanations
   - Interactive demos
   - Code comparisons
   - Challenges
   - Key takeaways

3. **Register module**:
   ```tsx
   // lib/modules/index.ts
   import { Module_X_Y_Content } from "./[moduleId]";

   export const MODULE_CONTENTS = {
     // ... existing modules
     "[moduleId]": Module_X_Y_Content,
   };
   ```

4. **Test**: Navigate to `http://localhost:3001/lesson/[moduleId]`

### Creating Interactive Diagrams

**Pre-built diagrams** in `components/InteractiveDiagram.tsx`:
- `BrowserRenderingPipeline` - HTML→DOM→CSSOM→Render Tree→Paint
- `VirtualDOMFlow` - React's reconciliation algorithm
- `ComponentTree` - Component hierarchy

**To create new diagram**:
```tsx
export function YourDiagram() {
  const nodes: Node[] = [
    { id: "1", data: { label: "Step 1" }, position: { x: 0, y: 0 } },
    // ... more nodes
  ];

  const edges: Edge[] = [
    { id: "e1", source: "1", target: "2", animated: true },
  ];

  return <InteractiveDiagram initialNodes={nodes} initialEdges={edges} />;
}
```

### Working with Progress System

```tsx
// In any component
import { useProgress } from "@/lib/progress";

const {
  completedModules,
  markModuleComplete,
  toggleBookmark,
  addNote
} = useProgress();

// Mark module complete
markModuleComplete("1-1-html-css");

// Check if unlocked (all prerequisites completed)
import { isModuleUnlocked } from "@/lib/curriculum";
const unlocked = isModuleUnlocked("2-1-why-spas", completedModules);
```

## Design Principles

**Story-Driven Learning**:
- Always start with historical context (e.g., "In 1989, Tim Berners-Lee at CERN...")
- Explain WHY a technology was created (the problem it solved)
- Show the evolution (e.g., static HTML → jQuery → React)

**Mental Models Over Syntax**:
- Focus on concepts like "UI = f(state)", "Separation of Concerns"
- Include a "Mental Model" quote in every module's Key Takeaways
- Explain trade-offs (no silver bullet)

**Interactive Over Passive**:
- Every module must have live code examples (CodePlayground)
- Step-by-step explanations with code snippets
- Visual diagrams for complex flows
- Challenges to test understanding

**Detailed Explanations**:
- Break complex topics into 5-7+ steps
- Include code comments explaining each line
- Provide real-world examples and measurements ("50% faster", "bundle size reduced from 200KB to 50KB")
- Compare old vs new approaches with explicit pros/cons

## Technical Notes

**Next.js Version**: 16.1.1 (App Router)
- Uses React Server Components by default
- File-based routing in `app/` directory
- All module content components must use `"use client"` directive (they're interactive)

**Styling**: Tailwind CSS v4 + shadcn/ui
- Utility-first CSS
- Dark mode support via system preference
- Custom gradient backgrounds

**State Persistence**: localStorage (key: `frontend-learning-progress`)
- Automatically synced via Zustand middleware
- Reset progress: Clear localStorage in browser DevTools

**Port**: Development server runs on port 3001 (3000 often occupied)

**External Dependencies**:
- Avoid external image URLs (use inline SVG instead for placeholders)
- Sandpack handles in-browser code execution (no external API calls)
- React Flow handles diagrams (no external resources)

## Debugging

**Module not loading**:
1. Check if module ID is registered in `lib/modules/index.ts`
2. Verify module ID matches curriculum in `lib/curriculum.ts`
3. Check browser console for import errors
4. Ensure component is exported as `Module_X_Y_Content`

**Progress not saving**:
1. Check localStorage in browser DevTools
2. Look for key `frontend-learning-progress`
3. Verify Zustand store is properly initialized

**Sandpack errors**:
1. Check if code has syntax errors
2. Verify template prop ("vanilla", "react", "static")
3. Ensure files object has correct structure

## References

- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md` - Detailed patterns for all 14 remaining modules
- **Module 1.1**: `lib/modules/1-1-html-css.tsx` - Gold standard reference (800 lines)
- **README**: Complete project documentation
