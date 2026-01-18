# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **JavaFX Learning App** - an interactive, story-driven educational platform teaching JavaFX desktop GUI development from fundamentals to advanced patterns (Swing → JavaFX → MVP → Spring Boot integration). The app focuses on teaching **mental models and architectural thinking** rather than just syntax.

**Target Audience**: Java backend developers learning JavaFX for desktop application development, specifically to work with the **hero-desktop-2** enterprise project.

**Key Philosophy**: Problem → Solution approach. Each module explains WHY JavaFX was created, WHAT problems it solves, and WHEN to use specific patterns.

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
- `/` - Dashboard with curriculum overview (18 modules, 6 phases)
- `/lesson/[moduleId]` - Individual lesson page (e.g., `/lesson/1-1-why-javafx`)

## Architecture

### Module Content System

**Critical Pattern**: The app uses a **dynamic module loading system** where each lesson's content is a separate React component.

**Module Registration Flow**:
1. Create module content component: `lib/modules/[moduleId].tsx`
2. Export as `Module_X_Y_Content()` function
3. Register in `lib/modules/index.ts`:
   ```tsx
   import { Module_1_1_Content } from "./1-1-why-javafx";

   export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
     "1-1-why-javafx": Module_1_1_Content,
     // Add new modules here
   };
   ```
4. Lesson page (`app/lesson/[moduleId]/page.tsx`) dynamically loads and renders the component

**Module ID Convention**: `{phase}-{order}-{slug}` (e.g., `1-1-why-javafx`, `2-4-mvp-pattern`, `6-1-spring-boot`)

### Data Flow Architecture

```
curriculum.ts (metadata)
    ↓
Dashboard (app/page.tsx) → renders all 6 phases/18 modules
    ↓
Lesson Page (app/lesson/[moduleId]/page.tsx)
    ↓
getModuleContent(moduleId) → loads Module_X_Y_Content component
    ↓
Renders interactive content (JavaCodePlayground, Diagrams, Challenges, hero-desktop-2 code analysis)
    ↓
progress.ts (Zustand store) → tracks completion in localStorage
```

### State Management

**Global State (Zustand)**: `lib/progress.ts`
- `completedModules: string[]` - IDs of finished lessons
- `bookmarkedModules: string[]` - User bookmarks
- `notes: Record<string, string>` - User notes per module
- `currentModule: string | null` - Currently viewing
- Persisted to `localStorage` key: `javafx-learning-progress`

**Curriculum State**: `lib/curriculum.ts`
- Static configuration for all 18 modules (6 phases)
- Helper functions: `getModuleById()`, `getNextModule()`, `getPreviousModule()`, `isModuleUnlocked()`
- **Unlock System**: Modules unlock only when prerequisites are completed
- **NEW Field**: `hasHeroDesktop2Context: boolean` - indicates if module includes hero-desktop-2 code analysis

### Component Architecture

**JavaFX-Specific Components** (in `components/`):

1. **JavaCodePlayground** - Syntax-highlighted Java/FXML/CSS code display
   - Tabbed view (Java | FXML | CSS)
   - No live execution (JavaFX can't run in browser)
   - Copy-paste ready code with file names

2. **JavaFXDemoViewer** - Display JavaFX application demos
   - Types: `screenshot`, `gif`, `video`
   - Links to runnable examples in javafx-examples repo
   - GitHub repo integration

3. **StepByStepExplanation** - Animated step-through explanations
   - Auto-play mode, progress bar, step indicators
   - Used for complex concepts (e.g., 7-step Swing → JavaFX evolution)

4. **CodeComparison** - Side-by-side code comparison (Swing vs JavaFX)
   - Tabbed view (Split | Old Only | New Only)
   - Pros/Cons lists
   - Used to show evolution and improvements

5. **Challenge** - Quiz component
   - Multiple choice with detailed explanations
   - Instant feedback, reset capability

6. **CodeBlock** - Syntax highlighted code display (using Prism)
   - Supports: `java`, `xml` (FXML), `css` (JavaFX CSS)

**UI Components** (shadcn/ui in `components/ui/`):
- Standard shadcn components: Button, Card, Badge, Progress, Tabs, etc.

## Module Content Pattern

**Reference Implementation**: `lib/modules/1-1-why-javafx.tsx` (~1050 lines)

Core structure:

```tsx
export function Module_X_Y_Content() {
  // Define step-by-step explanations
  const historySteps: Step[] = [
    { title: "Step 1: ...", description: "...", code: "..." },
    // Minimum 5-7 steps for complex concepts
  ];

  return (
    <div className="space-y-8">
      {/* 1. Problem Statement - WHY this tech/pattern exists */}
      <Card>
        <CardContent className="prose">
          <h2>🖥️ The Problem: ...</h2>
          <p>Historical context, problem description...</p>
        </CardContent>
      </Card>

      {/* 2. Step-by-step explanation */}
      <StepByStepExplanation
        title="..."
        steps={historySteps}
        autoPlay={false}
      />

      {/* 3. Java/FXML Code Examples */}
      <JavaCodePlayground
        javaCode="..."
        fxmlCode="..."
        cssCode="..."
        title="..."
      />

      {/* 4. Code Comparison (Swing vs JavaFX) */}
      <CodeComparison
        oldCode={{ title: "Swing", code: "...", pros: [...], cons: [...] }}
        newCode={{ title: "JavaFX", code: "...", pros: [...], cons: [...] }}
      />

      {/* 5. JavaFX Demo Viewer */}
      <JavaFXScreenshot
        src="/demos/module-x-y.svg"
        alt="..."
        title="..."
        repoUrl="https://github.com/.../javafx-examples/tree/main/module-x-y"
      />

      {/* 6. hero-desktop-2 Context (if applicable) */}
      <Card className="border-purple-200">
        <h3>🔗 In hero-desktop-2 Project</h3>
        <p>This pattern is used in:</p>
        <CodeBlock language="java" code="..." fileName="DashboardPresenter.java" />
      </Card>

      {/* 7. Challenges (minimum 2) */}
      <Challenge question="..." correctAnswerId="..." explanation="..." />

      {/* 8. Key Takeaways */}
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
- Start with a **problem statement** (story-driven, historical context)
- Include **step-by-step explanations** (5-7+ steps for complex topics)
- Provide **Java/FXML code examples** (syntax-highlighted, well-commented)
- Compare **old vs new approaches** (Swing vs JavaFX with pros/cons)
- Include **JavaFX demo** (screenshot/GIF with link to runnable example)
- Add **hero-desktop-2 context** (real-world code analysis where applicable)
- Include **challenges** with detailed explanations (minimum 2)
- End with **Key Takeaways** and a **Mental Model** quote

**Content Depth**: Aim for ~800-1050 lines per module. Module 1.1 is the gold standard with ~1050 lines.

## Curriculum Structure

**6 Phases, 18 Modules Total**:

**Phase 1: JavaFX Fundamentals**
- `1-1-why-javafx` - Why JavaFX? History & Architecture (✅ COMPLETE - 1050 lines)
- `1-2-stage-scene-nodes` - Stage, Scene, Nodes - Core Concepts (⏳ TODO)
- `1-3-layouts` - Layouts - Organizing UI Components (⏳ TODO)
- `1-4-css-styling` - CSS Styling - Making it Beautiful (⏳ TODO)

**Phase 2: FXML & MVC Architecture**
- `2-1-fxml-basics` - FXML Basics - Declarative UI (⏳ TODO)
- `2-2-controllers` - Controllers & fx:id Binding (⏳ TODO)
- `2-3-scenebuilder` - SceneBuilder - Visual FXML Editor (⏳ TODO)
- `2-4-mvp-pattern` - MVP Pattern in JavaFX (⏳ TODO)

**Phase 3: Properties, Binding & Observables**
- `3-1-properties` - JavaFX Properties - The Reactive Foundation (⏳ TODO)
- `3-2-binding` - Bidirectional Binding (⏳ TODO)
- `3-3-collections` - Collections & Observable Lists (⏳ TODO)

**Phase 4: Advanced UI Components**
- `4-1-tableview` - TableView - The Workhorse Component (⏳ TODO)
- `4-2-treeview` - TreeView & TreeTableView (⏳ TODO)
- `4-3-charts` - Charts - Visualizing Data (⏳ TODO)
- `4-4-listview-combobox` - ListView, ComboBox, ChoiceBox (⏳ TODO)

**Phase 5: Custom Controls & Advanced Topics**
- `5-1-custom-controls` - Custom Control Development (⏳ TODO)
- `5-2-skinning` - Control Skinning & CSS (⏳ TODO)
- `5-3-canvas-2d` - Canvas & 2D Graphics (⏳ TODO)
- `5-4-3d-graphics` - 3D Graphics with JavaFX (⏳ TODO)

**Phase 6: Integration & Production Patterns**
- `6-1-spring-boot` - Spring Boot + JavaFX (⏳ TODO)
- `6-2-multithreading` - Multithreading & Concurrency (⏳ TODO)
- `6-3-command-pattern` - Command Pattern & Undo/Redo (⏳ TODO)
- `6-4-jxbrowser` - JXBrowser Integration (⏳ TODO)
- `6-5-packaging` - Packaging & Distribution (⏳ TODO)

**Status**: 1/18 modules complete (Module 1.1).

## Key Files

**Configuration**:
- `lib/curriculum.ts` - All 18 modules metadata, learning objectives, mental models
- `lib/progress.ts` - Zustand store for progress tracking (key: `javafx-learning-progress`)

**Module Content**:
- `lib/modules/index.ts` - Module registry (add new modules here)
- `lib/modules/1-1-why-javafx.tsx` - Complete reference implementation (✅ COMPLETE)
- `lib/modules/types.ts` - TypeScript types for module content

**Pages**:
- `app/page.tsx` - Dashboard with curriculum tree, progress bars, unlock system
- `app/lesson/[moduleId]/page.tsx` - Dynamic lesson viewer

**JavaFX-Specific Components**:
- `components/CodePlayground.tsx` - Java/FXML/CSS syntax highlighting (JavaCodePlayground)
- `components/JavaFXDemoViewer.tsx` - Screenshot/GIF/Video viewer
- `components/StepByStepExplanation.tsx` - Animated step-through
- `components/CodeComparison.tsx` - Swing vs JavaFX comparisons
- `components/Challenge.tsx` - Quiz component
- `components/CodeBlock.tsx` - Prism syntax highlighting

**Documentation**:
- `README.md` - Project overview, setup, features, curriculum
- `CLAUDE.md` - This file (architecture and development guide)

**Companion Repository**:
- `/home/logbasex/IdeaProjects/javafx-examples/` - Maven multi-module project with runnable examples

## Common Workflows

### Adding a New Module

1. **Create module file**:
   ```bash
   touch lib/modules/[moduleId].tsx
   ```

2. **Implement content** following the pattern in Module 1.1:
   - Problem statement (historical context)
   - 5-7 step explanations
   - Java/FXML code examples
   - Swing vs JavaFX comparison
   - JavaFX demo (screenshot/GIF)
   - hero-desktop-2 code analysis (if applicable)
   - Challenges (minimum 2)
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

4. **Create runnable example** in javafx-examples repo:
   ```bash
   cd /home/logbasex/IdeaProjects/javafx-examples
   mkdir module-x-y-name
   # Create pom.xml and Java source files
   ```

5. **Test**: Navigate to `http://localhost:3001/lesson/[moduleId]`

### Working with JavaFX Examples Repo

```bash
cd /home/logbasex/IdeaProjects/javafx-examples

# Create new module directory
mkdir module-x-y-name
cd module-x-y-name

# Create pom.xml (inherit from parent POM)
# Create src/main/java/com/example/ directory
# Implement Java code

# Test locally
mvn javafx:run
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
markModuleComplete("1-1-why-javafx");

// Check if unlocked (all prerequisites completed)
import { isModuleUnlocked } from "@/lib/curriculum";
const unlocked = isModuleUnlocked("2-1-fxml-basics", completedModules);
```

## Design Principles

**Story-Driven Learning**:
- Always start with historical context (e.g., "In 1998, Sun Microsystems released Swing...")
- Explain WHY JavaFX was created (Swing's limitations)
- Show the evolution (e.g., Swing → JavaFX 1.0 → JavaFX 2.0 → Modern JavaFX)

**Mental Models Over Syntax**:
- Focus on concepts like "Scene Graph architecture", "Reactive Properties", "MVP pattern"
- Include a "Mental Model" quote in every module's Key Takeaways
- Explain trade-offs (e.g., JavaFX vs Swing, MVC vs MVP)

**Interactive Over Passive**:
- Every module must have Java/FXML code examples
- Step-by-step explanations with detailed code snippets
- Visual demos (screenshots/GIFs) of running JavaFX apps
- Links to runnable examples
- Challenges to test understanding

**Real-World Context**:
- Include hero-desktop-2 code analysis where applicable
- Show how patterns are used in production enterprise apps
- Provide runnable examples that can be cloned and run locally

**Detailed Explanations**:
- Break complex topics into 5-7+ steps
- Include code comments explaining each line
- Compare old vs new approaches with explicit pros/cons
- Provide measurements and real-world context

## Technical Notes

**Next.js Version**: 16.1.1 (App Router)
- Uses React Server Components by default
- File-based routing in `app/` directory
- All module content components must use `"use client"` directive (they're interactive)

**Styling**: Tailwind CSS v4 + shadcn/ui
- Utility-first CSS
- Dark mode support via system preference
- Custom gradient backgrounds

**State Persistence**: localStorage (key: `javafx-learning-progress`)
- Automatically synced via Zustand middleware
- Reset progress: Clear localStorage in browser DevTools

**Port**: Development server runs on port 3001 (3000 often occupied)

**JavaFX Demo Strategy**:
- JavaFX cannot run in browser (desktop-only)
- Use screenshots, GIFs, or videos for demos
- Provide links to javafx-examples repo for runnable code
- Users clone and run: `cd module-x-y && mvn javafx:run`

**External Dependencies**:
- Avoid external image URLs (use inline SVG instead for placeholders)
- Use `/demos/` directory for screenshots/GIFs
- Link to javafx-examples repo on GitHub

## Debugging

**Module not loading**:
1. Check if module ID is registered in `lib/modules/index.ts`
2. Verify module ID matches curriculum in `lib/curriculum.ts`
3. Check browser console for import errors
4. Ensure component is exported as `Module_X_Y_Content`

**Progress not saving**:
1. Check localStorage in browser DevTools
2. Look for key `javafx-learning-progress` (NOT `frontend-learning-progress`)
3. Verify Zustand store is properly initialized

**JavaFX code not highlighting**:
1. Ensure `language="java"` for Java code
2. Use `language="xml"` for FXML
3. Use `language="css"` for JavaFX CSS
4. Check if Prism supports the language

## References

- **Module 1.1**: `lib/modules/1-1-why-javafx.tsx` - Gold standard reference (1050 lines)
- **README**: Complete project documentation
- **javafx-examples repo**: `/home/logbasex/IdeaProjects/javafx-examples/`
- **hero-desktop-2**: Enterprise JavaFX project for real-world code examples
