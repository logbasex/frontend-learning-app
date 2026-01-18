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
  hasHeroDesktop2Context: boolean; // NEW: Link to hero-desktop-2 project
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
    title: "JavaFX Fundamentals",
    description: "The Desktop Renaissance - From Swing to JavaFX",
    icon: "Monitor",
    modules: [
      {
        id: "1-1-why-javafx",
        title: "Why JavaFX? (History & Architecture)",
        description: "Swing is outdated (1998) → JavaFX brings modern desktop GUI with hardware acceleration and CSS styling",
        phase: 1,
        order: 1,
        duration: "25 mins",
        prerequisites: [],
        learningObjectives: [
          "Understand the limitations of Swing and why JavaFX was created",
          "Master the Scene Graph architecture fundamentals",
          "Compare JavaFX vs Web vs Mobile for application development"
        ],
        mentalModels: [
          "Scene Graph architecture (hierarchical UI tree)",
          "Hardware acceleration for modern UIs",
          "Separation of concerns: FXML (UI) + Java (logic)"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: false
      },
      {
        id: "1-2-stage-scene-nodes",
        title: "Stage, Scene, Nodes - Core Concepts",
        description: "Understanding JavaFX's theater metaphor: Stage (window) → Scene (canvas) → Nodes (UI elements)",
        phase: 1,
        order: 2,
        duration: "30 mins",
        prerequisites: ["1-1-why-javafx"],
        learningObjectives: [
          "Master the Stage-Scene-Node hierarchy",
          "Build a simple JavaFX application from Application.start()",
          "Understand the JavaFX Application lifecycle"
        ],
        mentalModels: [
          "Theater metaphor (Stage, Scene, Actors/Nodes)",
          "Scene Graph traversal and rendering",
          "Lifecycle: init() → start() → stop()"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: true
      },
      {
        id: "1-3-layouts",
        title: "Layouts - Organizing UI Components",
        description: "How to arrange components? Layout panes (HBox, VBox, BorderPane, GridPane, StackPane, FlowPane, AnchorPane)",
        phase: 1,
        order: 3,
        duration: "35 mins",
        prerequisites: ["1-2-stage-scene-nodes"],
        learningObjectives: [
          "Understand each layout pane's use case",
          "Build a dashboard with complex nested layouts",
          "Make layout decisions based on requirements"
        ],
        mentalModels: [
          "Layout decision tree (which pane for which use case?)",
          "Nested layouts for complex UIs",
          "Responsive design with layout constraints"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "1-4-css-styling",
        title: "CSS Styling - Making it Beautiful",
        description: "JavaFX default UI looks plain → CSS styling (similar to Web CSS but JavaFX-specific)",
        phase: 1,
        order: 4,
        duration: "30 mins",
        prerequisites: ["1-3-layouts"],
        learningObjectives: [
          "Master JavaFX CSS selectors and pseudo-classes",
          "Implement theme switching (Light/Dark mode)",
          "Compare inline styles vs external CSS vs JavaFX CSS API"
        ],
        mentalModels: [
          "CSS cascading and specificity in JavaFX",
          "Theme architecture with CSS variables",
          "Skinning vs Styling"
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: true
      }
    ]
  },
  {
    id: 2,
    title: "FXML & MVC Architecture",
    description: "Declarative UI with FXML and separation of concerns",
    icon: "FileCode",
    modules: [
      {
        id: "2-1-fxml-basics",
        title: "FXML Basics - Declarative UI",
        description: "Building UI in Java code is verbose → FXML (XML-based UI definition, like HTML for JavaFX)",
        phase: 2,
        order: 1,
        duration: "30 mins",
        prerequisites: ["1-4-css-styling"],
        learningObjectives: [
          "Understand FXML structure and FXMLLoader",
          "Build the same UI in Java code vs FXML",
          "Connect FXML to Controller classes"
        ],
        mentalModels: [
          "Declarative UI (FXML) vs Imperative UI (Java code)",
          "Separation of UI (FXML) vs Logic (Controller)",
          "XML markup for scene graph definition"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: true
      },
      {
        id: "2-2-controllers",
        title: "Controllers & fx:id Binding",
        description: "How to connect FXML elements with Java code? @FXML annotation and fx:id binding",
        phase: 2,
        order: 2,
        duration: "30 mins",
        prerequisites: ["2-1-fxml-basics"],
        learningObjectives: [
          "Master @FXML annotation for field and method injection",
          "Implement event handlers in Controller",
          "Build form validation with FXML + Controller"
        ],
        mentalModels: [
          "MVC separation: View (FXML) ↔ Controller (Java)",
          "Event flow: User action → Handler → Model update → View refresh",
          "Dependency injection via @FXML"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "2-3-scenebuilder",
        title: "SceneBuilder - Visual FXML Editor",
        description: "Writing FXML manually is tedious → SceneBuilder (drag-and-drop FXML editor)",
        phase: 2,
        order: 3,
        duration: "25 mins",
        prerequisites: ["2-2-controllers"],
        learningObjectives: [
          "Master SceneBuilder workflow: design → generate FXML → load in app",
          "Build a login screen with SceneBuilder",
          "Understand when to use SceneBuilder vs manual FXML"
        ],
        mentalModels: [
          "Visual design tools for developer productivity",
          "Round-trip engineering (SceneBuilder ↔ FXML)",
          "Component library and custom controls"
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "2-4-mvp-pattern",
        title: "MVP Pattern in JavaFX",
        description: "Controller becomes too big (god object) → Model-View-Presenter separation for better architecture",
        phase: 2,
        order: 4,
        duration: "40 mins",
        prerequisites: ["2-3-scenebuilder"],
        learningObjectives: [
          "Understand the problems of fat Controllers",
          "Master MVP architecture: Model, View, Presenter roles",
          "Refactor MVC to MVP with clear separation"
        ],
        mentalModels: [
          "MVP: Passive View + Active Presenter",
          "Testability: Presenter without UI dependencies",
          "Separation: Business logic (Presenter) vs UI logic (View)"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: true
      }
    ]
  },
  {
    id: 3,
    title: "Properties, Binding & Observables",
    description: "Reactive programming with JavaFX Properties",
    icon: "Link",
    modules: [
      {
        id: "3-1-properties",
        title: "JavaFX Properties - The Reactive Foundation",
        description: "Manual UI updates when data changes → Observable properties (StringProperty, IntegerProperty, etc.)",
        phase: 3,
        order: 1,
        duration: "35 mins",
        prerequisites: ["2-4-mvp-pattern"],
        learningObjectives: [
          "Understand JavaFX Property system and Observables",
          "Master property listeners and change notifications",
          "Build reactive UIs with automatic updates"
        ],
        mentalModels: [
          "Reactive programming with Observable properties",
          "Property → Listener → UI auto-update",
          "Binding: source property changes → target updates"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: true
      },
      {
        id: "3-2-binding",
        title: "Bidirectional Binding",
        description: "Syncing two properties (e.g., Slider ↔ TextField) → Bidirectional binding with bindBidirectional()",
        phase: 3,
        order: 2,
        duration: "30 mins",
        prerequisites: ["3-1-properties"],
        learningObjectives: [
          "Master binding types: unidirectional, bidirectional, computed",
          "Build settings panel with live preview",
          "Understand binding lifecycle and unbinding"
        ],
        mentalModels: [
          "Unidirectional: source → target (read-only)",
          "Bidirectional: source ↔ target (two-way sync)",
          "Computed binding: derived values from multiple sources"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: true
      },
      {
        id: "3-3-collections",
        title: "Collections & Observable Lists",
        description: "TableView data changes don't update UI → ObservableList, ObservableMap for automatic UI refresh",
        phase: 3,
        order: 3,
        duration: "30 mins",
        prerequisites: ["3-2-binding"],
        learningObjectives: [
          "Master ObservableList and ObservableMap",
          "Build Todo list with add/remove/update",
          "Understand collection change listeners"
        ],
        mentalModels: [
          "Observable collections: automatic UI synchronization",
          "Collection listeners: granular change notifications",
          "TableView ↔ ObservableList binding"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      }
    ]
  },
  {
    id: 4,
    title: "Advanced UI Components",
    description: "TableView, TreeView, Charts, and complex controls",
    icon: "Table",
    modules: [
      {
        id: "4-1-tableview",
        title: "TableView - The Workhorse Component",
        description: "Displaying tabular data → TableView with columns, cells, selection, and editing",
        phase: 4,
        order: 1,
        duration: "40 mins",
        prerequisites: ["3-3-collections"],
        learningObjectives: [
          "Master TableView setup: columns, cell factories, selection",
          "Implement custom cell renderers and editors",
          "Build employee management table with CRUD operations"
        ],
        mentalModels: [
          "TableView architecture: TableColumn → CellFactory → Cell",
          "Observable backing: model changes → view updates",
          "Selection models: single vs multiple selection"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "4-2-treeview",
        title: "TreeView & TreeTableView",
        description: "Hierarchical data display → TreeView (folders) and TreeTableView (hybrid table + tree)",
        phase: 4,
        order: 2,
        duration: "35 mins",
        prerequisites: ["4-1-tableview"],
        learningObjectives: [
          "Understand TreeItem and tree structure",
          "Build file explorer with TreeView",
          "Compare TreeView vs TreeTableView use cases"
        ],
        mentalModels: [
          "Tree structure: root → branches → leaves",
          "Lazy loading for large trees",
          "TreeTableView: combine hierarchy with columns"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "4-3-charts",
        title: "Charts - Visualizing Data",
        description: "Data visualization → Built-in charts (LineChart, BarChart, PieChart, ScatterChart, AreaChart)",
        phase: 4,
        order: 3,
        duration: "35 mins",
        prerequisites: ["4-2-treeview"],
        learningObjectives: [
          "Master JavaFX chart types and their use cases",
          "Build live stock chart with animations",
          "Customize chart styling and behavior"
        ],
        mentalModels: [
          "Chart architecture: Data → Series → Chart → Styling",
          "Animated data updates for live charts",
          "Custom charts: when to extend vs build from scratch"
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "4-4-listview-combobox",
        title: "ListView, ComboBox, ChoiceBox",
        description: "Selecting from lists → ListView (scrollable), ComboBox (dropdown), ChoiceBox (simple dropdown)",
        phase: 4,
        order: 4,
        duration: "25 mins",
        prerequisites: ["4-3-charts"],
        learningObjectives: [
          "Compare ListView, ComboBox, and ChoiceBox use cases",
          "Implement custom cell factories with icons + text",
          "Build settings panel with various pickers"
        ],
        mentalModels: [
          "Decision tree: which component for which selection?",
          "Cell factory pattern: custom rendering",
          "Selection models and change listeners"
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: false
      }
    ]
  },
  {
    id: 5,
    title: "Custom Controls & Advanced Topics",
    description: "Building custom controls, 2D/3D graphics, and advanced features",
    icon: "Paintbrush",
    modules: [
      {
        id: "5-1-custom-controls",
        title: "Custom Control Development",
        description: "Built-in controls aren't enough → Extend Control class or Region for custom components",
        phase: 5,
        order: 1,
        duration: "45 mins",
        prerequisites: ["4-4-listview-combobox"],
        learningObjectives: [
          "Master custom control architecture: Control → Skin → Behavior",
          "Build toggle switch control from scratch",
          "Understand CSS styling for custom controls"
        ],
        mentalModels: [
          "Separation: Control (API) vs Skin (rendering) vs Behavior (interaction)",
          "Reusable controls as libraries",
          "CSS styling integration"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "5-2-skinning",
        title: "Control Skinning & CSS",
        description: "Customize existing control appearance → Custom Skin classes and advanced CSS",
        phase: 5,
        order: 2,
        duration: "35 mins",
        prerequisites: ["5-1-custom-controls"],
        learningObjectives: [
          "Understand Skin architecture and lifecycle",
          "Create custom Button skin with animations",
          "Master CSS variables and pseudo-classes"
        ],
        mentalModels: [
          "Skin: rendering strategy for controls",
          "CSS theming: variables for consistent design",
          "Skin selection: default vs custom skins"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: false
      },
      {
        id: "5-3-canvas-2d",
        title: "Canvas & 2D Graphics",
        description: "Custom drawing (charts, diagrams, games) → Canvas API (like HTML Canvas)",
        phase: 5,
        order: 3,
        duration: "30 mins",
        prerequisites: ["5-2-skinning"],
        learningObjectives: [
          "Master GraphicsContext API for 2D drawing",
          "Draw flowchart on Canvas with animations",
          "Understand Canvas vs Node-based rendering"
        ],
        mentalModels: [
          "Immediate mode (Canvas) vs Retained mode (Scene Graph)",
          "GraphicsContext: drawing primitives and state",
          "Canvas for performance-critical rendering"
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "5-4-3d-graphics",
        title: "3D Graphics with JavaFX",
        description: "3D visualization → JavaFX 3D API (Camera, SubScene, 3D shapes, lighting, materials)",
        phase: 5,
        order: 4,
        duration: "40 mins",
        prerequisites: ["5-3-canvas-2d"],
        learningObjectives: [
          "Master 3D basics: PerspectiveCamera, SubScene, 3D shapes",
          "Build rotating 3D cube with lighting",
          "Understand transformations and materials"
        ],
        mentalModels: [
          "3D Scene Graph: Camera → SubScene → 3D Nodes",
          "Transformations: translate, rotate, scale",
          "Lighting: ambient, point, directional"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      }
    ]
  },
  {
    id: 6,
    title: "Integration & Production Patterns",
    description: "Spring Boot, Concurrency, Command Pattern, and Deployment",
    icon: "Rocket",
    modules: [
      {
        id: "6-1-spring-boot",
        title: "Spring Boot + JavaFX",
        description: "JavaFX with dependency injection → Spring Boot integration for enterprise apps",
        phase: 6,
        order: 1,
        duration: "40 mins",
        prerequisites: ["5-4-3d-graphics"],
        learningObjectives: [
          "Integrate Spring Boot with JavaFX Application",
          "Master dependency injection in Controllers",
          "Build enterprise JavaFX app with Spring services"
        ],
        mentalModels: [
          "Dependency injection: loose coupling and testability",
          "SpringBootApplication + JavaFX Application lifecycle",
          "Event publishing across application layers"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        hasHeroDesktop2Context: true
      },
      {
        id: "6-2-multithreading",
        title: "Multithreading & Concurrency",
        description: "Long operations freeze UI → Background tasks with Task, Service, Platform.runLater()",
        phase: 6,
        order: 2,
        duration: "40 mins",
        prerequisites: ["6-1-spring-boot"],
        learningObjectives: [
          "Master JavaFX Task and Service for background work",
          "Implement progress tracking and cancellation",
          "Understand JavaFX Application Thread vs background threads"
        ],
        mentalModels: [
          "JavaFX Application Thread: UI updates only",
          "Task: one-time background work with progress",
          "Service: reusable background tasks"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "6-3-command-pattern",
        title: "Command Pattern & Undo/Redo",
        description: "Implementing undo/redo → Command pattern with command stack",
        phase: 6,
        order: 3,
        duration: "35 mins",
        prerequisites: ["6-2-multithreading"],
        learningObjectives: [
          "Master Command pattern for encapsulating operations",
          "Build text editor with undo/redo functionality",
          "Understand command stack and history management"
        ],
        mentalModels: [
          "Command: encapsulate action as object",
          "Undo/Redo: command stack (history)",
          "Macro commands: composite pattern"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "6-4-jxbrowser",
        title: "JXBrowser Integration",
        description: "Display web content in desktop app → Embedded Chromium browser (JXBrowser)",
        phase: 6,
        order: 4,
        duration: "30 mins",
        prerequisites: ["6-3-command-pattern"],
        learningObjectives: [
          "Setup JXBrowser in JavaFX application",
          "Load web content and handle navigation",
          "Implement JavaScript bridge for Java ↔ JS communication"
        ],
        mentalModels: [
          "Embedded browser: full web stack in desktop app",
          "JavaScript bridge: bidirectional communication",
          "Hybrid apps: JavaFX UI + Web content"
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
      },
      {
        id: "6-5-packaging",
        title: "Packaging & Distribution",
        description: "Deploy JavaFX app to users → jpackage, native installers, code obfuscation",
        phase: 6,
        order: 5,
        duration: "35 mins",
        prerequisites: ["6-4-jxbrowser"],
        learningObjectives: [
          "Master jpackage for creating native installers",
          "Build platform-specific packages (Windows/macOS/Linux)",
          "Implement code obfuscation with ProGuard"
        ],
        mentalModels: [
          "Self-contained application: JVM + app bundled",
          "Platform-specific packaging: MSI, DMG, DEB/RPM",
          "Code obfuscation: protecting intellectual property"
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        hasHeroDesktop2Context: true
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
