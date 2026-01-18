# JavaFX Learning App 🖥️

**Learn JavaFX from Fundamentals to Advanced** - Master desktop GUI development with understanding of WHY and HOW.

## 📖 Introduction

An interactive **JavaFX learning platform** with a **story-driven approach**, focusing on explaining **WHY** JavaFX was created, **WHAT PROBLEMS** it solves, and **WHEN** to use specific patterns.

### Key Features

- ✅ **Story-driven Curriculum**: Learn through evolution from Swing → JavaFX → Modern Patterns
- ✅ **Interactive Code Examples**: Syntax-highlighted Java/FXML code with runnable examples
- ✅ **Mental Models**: Focus on architectural thinking and design patterns
- ✅ **hero-desktop-2 Integration**: Real-world code examples from enterprise JavaFX project
- ✅ **Progress Tracking**: Track your learning journey with localStorage
- ✅ **Responsive Design**: Modern web interface for learning desktop development

## 🎯 Learning Goals

After completing this app, you will:

1. **Understand JavaFX Architecture** - Scene Graph, Properties, Binding, FXML
2. **Master Design Patterns** - MVP, Command Pattern, Observable patterns
3. **Build Complex UIs** - TableView, TreeView, Charts, Custom Controls
4. **Production-Ready Skills** - Spring Boot integration, Concurrency, Packaging
5. **Work with hero-desktop-2** - Understand and modify enterprise JavaFX codebase

## 📚 Curriculum (6 Phases, 18 Modules)

### Phase 1: JavaFX Fundamentals (The Desktop Renaissance)

1. **Why JavaFX? (History & Architecture)** - 25 mins ✅ COMPLETE
   - Swing limitations and JavaFX solutions
   - Scene Graph architecture fundamentals
   - Hardware acceleration and CSS styling

2. **Stage, Scene, Nodes - Core Concepts** - 30 mins
   - Theater metaphor (Stage, Scene, Actors)
   - Application lifecycle
   - Basic node types

3. **Layouts - Organizing UI Components** - 35 mins
   - HBox, VBox, BorderPane, GridPane, StackPane
   - Layout decision tree
   - hero-desktop-2 dashboard layout analysis

4. **CSS Styling - Making it Beautiful** - 30 mins
   - JavaFX CSS selectors and pseudo-classes
   - Theme switching (Light/Dark mode)
   - JMetro and Transit themes from hero-desktop-2

### Phase 2: FXML & MVC Architecture

5. **FXML Basics - Declarative UI** - 30 mins
   - XML-based UI definition
   - FXMLLoader and Controllers
   - Programmatic UI vs FXML comparison

6. **Controllers & fx:id Binding** - 30 mins
   - @FXML annotation
   - Event handlers and form validation
   - hero-desktop-2 controller patterns

7. **SceneBuilder - Visual FXML Editor** - 25 mins
   - Drag-and-drop UI design
   - FXML generation workflow
   - 330+ FXML files in hero-desktop-2

8. **MVP Pattern in JavaFX** - 40 mins
   - Model-View-Presenter separation
   - Testability without UI dependencies
   - DashboardPresenter and RootPresenter analysis

### Phase 3: Properties, Binding & Observables

9. **JavaFX Properties - The Reactive Foundation** - 35 mins
   - Observable properties (StringProperty, IntegerProperty)
   - Property listeners and change notifications
   - Reactive UI updates

10. **Bidirectional Binding** - 30 mins
    - Unidirectional vs bidirectional binding
    - Computed bindings from multiple sources
    - Settings panel with live preview

11. **Collections & Observable Lists** - 30 mins
    - ObservableList and ObservableMap
    - TableView data binding
    - Collection change listeners

### Phase 4: Advanced UI Components

12. **TableView - The Workhorse Component** - 40 mins
    - Columns, cell factories, selection models
    - Custom cell renderers and editors
    - hero-desktop-2 WallBuilder tables

13. **TreeView & TreeTableView** - 35 mins
    - Hierarchical data display
    - Lazy loading for large trees
    - File explorer example

14. **Charts - Visualizing Data** - 35 mins
    - LineChart, BarChart, PieChart, ScatterChart
    - Animated data updates
    - Custom HeroBarChart and HeroPieChart

15. **ListView, ComboBox, ChoiceBox** - 25 mins
    - Selection component decision tree
    - Custom cell factories with icons
    - Settings panels

### Phase 5: Custom Controls & Advanced Topics

16. **Custom Control Development** - 45 mins
    - Extend Control class or Region
    - Control → Skin → Behavior architecture
    - hero-library custom controls (DockPane, CircleProgress)

17. **Control Skinning & CSS** - 35 mins
    - Custom Skin classes
    - CSS variables and theming
    - Button skin with animations

18. **Canvas & 2D Graphics** - 30 mins
    - GraphicsContext API
    - Immediate mode vs Retained mode
    - Custom rendering in hero-desktop-2

19. **3D Graphics with JavaFX** - 40 mins
    - PerspectiveCamera, SubScene, 3D shapes
    - Lighting and materials
    - FXYZ3D library usage in hero-desktop-2

### Phase 6: Integration & Production Patterns

20. **Spring Boot + JavaFX** - 40 mins
    - Dependency injection integration
    - @Component controllers
    - HeroBooter + HeroLauncher pattern

21. **Multithreading & Concurrency** - 40 mins
    - Task, Service, Platform.runLater()
    - Progress tracking and cancellation
    - JavaFX Application Thread

22. **Command Pattern & Undo/Redo** - 35 mins
    - Encapsulating operations as objects
    - Command stack implementation
    - UndoableCommand in hero-desktop-2

23. **JXBrowser Integration** - 30 mins
    - Embedded Chromium browser
    - JavaScript bridge (Java ↔ JS)
    - Hybrid desktop apps

24. **Packaging & Distribution** - 35 mins
    - jpackage for native installers
    - Platform-specific builds (Windows/macOS/Linux)
    - Code obfuscation with ProGuard

## 🛠️ Tech Stack

### Learning Platform (This Web App)
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand (progress tracking)
- **Components**: Custom JavaFX demo viewers, code playgrounds

### JavaFX Examples (Companion Repo)
- **JavaFX**: 21.0.1
- **Java**: 17 (LTS)
- **Build Tool**: Maven
- **Plugin**: javafx-maven-plugin

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
cd /home/logbasex/IdeaProjects/javafx-learning-app

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3001 (or 3000)
```

### Running JavaFX Examples

See the companion repository: `/home/logbasex/IdeaProjects/javafx-examples/`

```bash
cd /home/logbasex/IdeaProjects/javafx-examples

# Run Module 1.1 - Hello World
cd module-1-1-hello-world
mvn javafx:run
```

## 📁 Project Structure

```
javafx-learning-app/
├── app/
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Dashboard (18 modules, 6 phases)
│   └── lesson/[moduleId]/page.tsx   # Lesson viewer
├── components/
│   ├── CodePlayground.tsx           # Java/FXML syntax highlighting
│   ├── JavaFXDemoViewer.tsx         # Screenshots/GIFs/Videos viewer
│   ├── StepByStepExplanation.tsx    # Animated step-through
│   ├── CodeComparison.tsx           # Swing vs JavaFX comparisons
│   ├── Challenge.tsx                # Quiz component
│   └── ui/                          # shadcn components
├── lib/
│   ├── curriculum.ts                # 18 JavaFX modules metadata
│   ├── progress.ts                  # Progress tracking (Zustand)
│   └── modules/
│       ├── index.ts                 # Module registry
│       ├── 1-1-why-javafx.tsx       # Module 1.1 content (✅ COMPLETE)
│       └── ...                      # 17 more modules (TODO)
├── public/
│   └── demos/                       # Screenshots and GIFs
└── package.json
```

## 🎨 Features

### 1. Dashboard
- 18 modules across 6 phases
- Progress tracking per phase
- Unlock system (complete prerequisites first)
- Visual progress indicators

### 2. Lesson Viewer
- Comprehensive module content (~800+ lines per module)
- Java/FXML code examples with syntax highlighting
- Step-by-step explanations with auto-play
- Code comparisons (Swing vs JavaFX)
- Interactive challenges with detailed explanations
- hero-desktop-2 code analysis sections
- Links to runnable examples

### 3. Interactive Components

#### JavaCodePlayground
- Tabbed view (Java | FXML | CSS)
- Syntax highlighting with Prism
- Copy-paste ready code

#### JavaFXDemoViewer
- Screenshots of JavaFX apps
- Animated GIFs of demos
- Video demos
- Links to GitHub repo for running locally

#### StepByStepExplanation
- Auto-play mode
- Progress indicators
- Detailed code snippets with explanations

## 📚 Current Status

### ✅ Completed (Detailed Implementation)

**Module 1.1 - Why JavaFX?** (~1050 lines):
- ✅ 7-step evolution history (Swing → JavaFX)
- ✅ 3-step Scene Graph architecture explanation
- ✅ Java code examples (Hello World)
- ✅ Code comparison (Swing vs JavaFX with pros/cons)
- ✅ 2 challenges with detailed explanations
- ✅ Key takeaways and mental models
- ✅ Runnable example (module-1-1-hello-world)

**Infrastructure**:
- ✅ JavaCodePlayground component (Java/FXML/CSS syntax highlighting)
- ✅ JavaFXDemoViewer component (screenshots/GIFs/videos)
- ✅ Module content loading system
- ✅ Progress tracking with localStorage
- ✅ 18-module curriculum structure
- ✅ javafx-examples companion repo setup

### 🔜 TODO - Remaining Modules (17 modules)

**Priority modules**:
- [ ] Module 1.2: Stage, Scene, Nodes
- [ ] Module 2.4: MVP Pattern (with hero-desktop-2 analysis)
- [ ] Module 3.1: JavaFX Properties
- [ ] Module 6.1: Spring Boot + JavaFX
- [ ] Module 6.2: Multithreading & Concurrency

All other modules (12 remaining)

## 🔗 Related Projects

- **hero-desktop-2**: Enterprise JavaFX application (521 Java files, 330+ FXML files)
- **javafx-examples**: Companion repo with runnable examples for all 18 modules
- **Frontend Learning App**: Sister project for web frontend learning (HTML/CSS/React/Next.js)

## 🧠 Mental Models Covered

- Scene Graph architecture (hierarchical UI tree)
- Theater metaphor (Stage, Scene, Actors)
- Separation of concerns (FXML vs Java vs CSS)
- Reactive programming with Properties and Binding
- MVP pattern (Passive View + Active Presenter)
- Observable patterns (properties, collections)
- Command pattern (undo/redo)
- Hardware acceleration vs software rendering
- Declarative UI (FXML) vs Imperative UI (Java code)

## 🤝 Contributing

This is a learning project. Contributions welcome for:
- Implementing remaining 17 modules
- Adding more hero-desktop-2 code examples
- Creating demo GIFs/videos
- Improving explanations

## 📄 License

MIT License - Free for learning purposes

## 👤 Author

Built with ❤️ for Java developers learning JavaFX desktop GUI development.

---

**🚀 Happy Learning!** Remember: *Understand WHY, not just HOW.*
