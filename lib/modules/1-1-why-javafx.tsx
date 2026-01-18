"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JavaCodePlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { JavaFXScreenshot } from "@/components/JavaFXDemoViewer";

export function Module_1_1_Content() {
  // Step-by-step explanation: Why JavaFX was created
  const historySteps: Step[] = [
    {
      title: "Step 1: Swing Era (1998-2008) - The Limitations",
      description: "Java Swing was released in 1998 as part of Java Foundation Classes (JFC). While revolutionary for its time (platform-independent GUI), it had significant limitations that became apparent as desktop applications evolved. Swing's architecture was designed for the 1990s desktop era and couldn't keep up with modern UI expectations.",
      code: `// Swing code from 1998 - Still works but feels outdated
import javax.swing.*;
import java.awt.*;

public class SwingApp extends JFrame {
    public SwingApp() {
        setTitle("Old Swing Application");
        setSize(400, 300);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        // Heavy AWT components - not hardware accelerated
        JLabel label = new JLabel("This is Swing");
        label.setFont(new Font("Arial", Font.BOLD, 24));
        add(label, BorderLayout.CENTER);

        setVisible(true);
    }
}
// Problem: No CSS styling, no hardware acceleration,
// limited modern UI patterns, poor DPI scaling`,
    },
    {
      title: "Step 2: The Problem - Desktop Apps Look Outdated",
      description: "By the 2000s, web applications (with CSS, JavaScript, Ajax) started looking better than desktop apps. Users expected rich, animated, responsive UIs. Swing couldn't deliver: no CSS-like styling system, no built-in animation framework, poor high-DPI support, and single-threaded rendering caused UI freezes. Desktop Java apps felt 'old' compared to modern web and mobile apps.",
      highlight: "Key insight: Technology evolves with user expectations. What was cutting-edge in 1998 became inadequate by 2008.",
    },
    {
      title: "Step 3: JavaFX 1.0 (2008) - Sun's Answer",
      description: "Sun Microsystems (later acquired by Oracle) released JavaFX to modernize Java desktop development. Initial version used JavaFX Script (a new language) - NOT Java. This was a strategic mistake that limited adoption. However, it introduced key concepts: Scene Graph architecture (borrowed from graphics/game engines), CSS styling for UI components, hardware-accelerated rendering pipeline, and built-in animation framework.",
      code: `// JavaFX Script (2008) - Now deprecated
// This was NOT Java, it was a new language!
Stage {
    title: "JavaFX 1.0"
    scene: Scene {
        content: [
            Text {
                content: "Hello JavaFX Script!"
                font: Font { size: 24 }
            }
        ]
    }
}
// Problem: Developers had to learn a new language
// This slowed JavaFX adoption significantly`,
    },
    {
      title: "Step 4: JavaFX 2.0 (2011) - Java API Rewrite",
      description: "Oracle realized the JavaFX Script mistake and completely rewrote JavaFX as a pure Java API. This was the turning point. Now Java developers could use JavaFX with familiar Java syntax. Introduced FXML (XML-based UI definition, like HTML for desktop), builder pattern for UI construction, and full Java integration (no new language to learn).",
      code: `// JavaFX 2.0+ (2011-present) - Pure Java API
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.stage.Stage;

public class JavaFXApp extends Application {
    @Override
    public void start(Stage primaryStage) {
        Label label = new Label("Hello JavaFX!");
        label.setStyle("-fx-font-size: 24px;"); // CSS styling!

        Scene scene = new Scene(label, 400, 300);
        primaryStage.setTitle("Modern JavaFX");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
// Success: Pure Java, CSS styling, clean API`,
    },
    {
      title: "Step 5: Hardware Acceleration - The Technical Advantage",
      description: "Unlike Swing (software rendering), JavaFX uses Prism rendering engine with GPU acceleration. This means: smooth 60 FPS animations (hardware accelerated transforms, opacity, effects), support for 3D graphics (PerspectiveCamera, 3D shapes, lighting), efficient rendering pipeline (scene graph optimization, dirty region tracking), and modern visual effects (shadows, blurs, reflections without performance penalty).",
      highlight: "Mental Model: JavaFX treats UI like a game engine - hardware-accelerated scene graph with optimized rendering pipeline.",
    },
    {
      title: "Step 6: CSS Styling - Designer-Friendly Approach",
      description: "JavaFX adopted CSS (Cascading Style Sheets) for UI styling, similar to web development. This separation of concerns (structure vs style) enables: external CSS files (separate styling from code), theme switching (change entire app appearance by swapping CSS), designer collaboration (designers can style without touching Java code), and modern UI aesthetics (gradients, shadows, custom fonts, animations).",
      code: `/* JavaFX CSS - Looks like Web CSS! */
.button {
    -fx-background-color: #3b82f6;
    -fx-text-fill: white;
    -fx-padding: 10 20;
    -fx-background-radius: 5;
    -fx-font-size: 14px;
}

.button:hover {
    -fx-background-color: #2563eb; /* Darker on hover */
    -fx-cursor: hand;
}

.label {
    -fx-font-family: "Arial";
    -fx-font-size: 18px;
    -fx-text-fill: #1f2937;
}
// Designers can style JavaFX apps without Java knowledge!`,
    },
    {
      title: "Step 7: Scene Graph Architecture - Core Innovation",
      description: "JavaFX's Scene Graph is a hierarchical tree structure of UI nodes (like DOM in web browsers). This architecture enables: automatic rendering optimization (only dirty regions repaint), efficient event handling (event bubbling/capturing like browser events), transformation pipeline (rotate, scale, translate any node), and component composition (build complex UIs from simple nodes). The Scene Graph is the foundation that makes everything else possible.",
      code: `// Scene Graph hierarchy - Tree structure
Stage (Window)
  └── Scene (Canvas)
      └── Root Node (e.g., VBox)
          ├── Label (Text node)
          ├── Button (Control node)
          └── HBox (Layout node)
              ├── Label
              └── TextField

// Each node can be:
// - Styled with CSS
// - Transformed (rotate, scale, move)
// - Animated
// - Event-enabled (click, hover, etc.)

// Mental Model: Scene Graph = DOM tree for desktop apps`,
    },
  ];

  // Scene Graph Architecture step-by-step
  const sceneGraphSteps: Step[] = [
    {
      title: "Understanding the Scene Graph",
      description: "The Scene Graph is a tree data structure where each node represents a visual element. Parent nodes contain child nodes, creating a hierarchy. When you change a parent node's properties (position, rotation, opacity), all children inherit those changes automatically.",
      code: `// Simple Scene Graph example
VBox root = new VBox(10); // Parent node (spacing: 10px)
root.setPadding(new Insets(20));

Label title = new Label("Welcome");  // Child 1
Button btn = new Button("Click Me"); // Child 2

// Add children to parent
root.getChildren().addAll(title, btn);

// Transform parent - children inherit transformation
root.setRotate(15); // Rotate entire VBox by 15 degrees
root.setOpacity(0.8); // 80% opacity for all children

// Scene Graph hierarchy:
// VBox (root)
//  ├── Label (title)
//  └── Button (btn)`,
    },
    {
      title: "Node Types in Scene Graph",
      description: "JavaFX categorizes nodes into three main types: Parent nodes (can contain children - layouts like VBox, HBox, Pane), Leaf nodes (cannot have children - controls like Label, Button, ImageView), and Shape nodes (geometric shapes - Rectangle, Circle, Path). Understanding node types helps you structure your UI correctly.",
      code: `// Parent nodes - Can contain children
VBox vbox = new VBox();
HBox hbox = new HBox();
BorderPane borderPane = new BorderPane();

// Leaf nodes - Cannot have children
Label label = new Label("Text");
Button button = new Button("Click");
ImageView image = new ImageView("icon.png");
TextField textField = new TextField();

// Shape nodes - Geometric primitives
Rectangle rect = new Rectangle(100, 50);
Circle circle = new Circle(50);
Line line = new Line(0, 0, 100, 100);

// Invalid: Cannot add children to leaf nodes
// button.getChildren().add(label); // Compilation ERROR!`,
    },
    {
      title: "CSS Styling in Scene Graph",
      description: "Every node in the Scene Graph can be styled with CSS. You can apply styles inline (via setStyle()), through external CSS files, or programmatically. CSS properties in JavaFX use -fx- prefix (e.g., -fx-background-color instead of background-color). This prevents conflicts with web CSS if embedding browsers.",
      code: `// Inline CSS styling
button.setStyle(
    "-fx-background-color: #3b82f6; " +
    "-fx-text-fill: white; " +
    "-fx-font-size: 16px;"
);

// External CSS file styling
scene.getStylesheets().add("styles.css");

// CSS file (styles.css):
/*
.custom-button {
    -fx-background-color: #3b82f6;
    -fx-text-fill: white;
    -fx-padding: 12 24;
    -fx-background-radius: 8;
}

.custom-button:hover {
    -fx-background-color: #2563eb;
}
*/

// Apply CSS class to node
button.getStyleClass().add("custom-button");`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Problem Statement - WHY JavaFX exists */}
      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="prose max-w-none pt-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <span>🖥️</span>
            <span>The Problem: Swing is Outdated</span>
          </h2>
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <p>
              In <strong>1998</strong>, Sun Microsystems released <strong>Java Swing</strong> as part of the Java Foundation Classes (JFC).
              It was revolutionary: write once, run anywhere GUI applications. No need for platform-specific code.
            </p>
            <p>
              But by the <strong>late 2000s</strong>, desktop applications built with Swing started to feel{" "}
              <span className="font-semibold text-orange-600 dark:text-orange-400">outdated and clunky</span>:
            </p>
            <ul className="space-y-2">
              <li>
                <strong>No CSS-like styling</strong>: Styling required verbose Java code. No designer-friendly approach.
              </li>
              <li>
                <strong>Software rendering only</strong>: No GPU acceleration → slow animations, no modern visual effects.
              </li>
              <li>
                <strong>Poor high-DPI support</strong>: Blurry on modern high-resolution screens (Retina, 4K).
              </li>
              <li>
                <strong>Single-threaded rendering</strong>: Long operations froze the UI (no built-in async patterns).
              </li>
              <li>
                <strong>Limited modern UI patterns</strong>: No built-in support for animations, transitions, or effects.
              </li>
            </ul>
            <p>
              Meanwhile, <strong>web applications</strong> with HTML5, CSS3, and JavaScript (jQuery, Ajax) started looking{" "}
              <em>better</em> than desktop apps. Mobile apps (iOS, Android) had rich, animated interfaces.{" "}
              <strong>Desktop Java apps felt stuck in the 1990s.</strong>
            </p>
            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 my-4">
              <p className="text-sm font-semibold">💡 Core Problem</p>
              <p className="text-sm">
                Swing was designed for 1990s desktop PCs. By 2008, user expectations had changed: modern UIs needed hardware acceleration,
                CSS-like styling, smooth animations, and responsive designs. Swing couldn't deliver.
              </p>
            </div>
            <p>
              <strong>Oracle's solution?</strong> <span className="text-blue-600 dark:text-blue-400 font-bold">JavaFX</span>
              - a complete redesign of Java desktop GUI, built for the modern era.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Step-by-step: History of JavaFX */}
      <StepByStepExplanation
        title="The Evolution: From Swing to JavaFX"
        description="Understanding how JavaFX emerged as the solution to Swing's limitations"
        steps={historySteps}
        autoPlay={false}
      />

      {/* 3. Code Comparison: Swing vs JavaFX */}
      <CodeComparison
        oldCode={{
          title: "Swing (1998) - Verbose & Limited",
          language: "java",
          code: `import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class SwingCounter extends JFrame {
    private int count = 0;
    private JLabel counterLabel;

    public SwingCounter() {
        setTitle("Swing Counter");
        setSize(400, 300);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));

        // Create components - NO CSS styling
        JLabel titleLabel = new JLabel("Swing Application", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        titleLabel.setForeground(new Color(59, 130, 246)); // Manual color

        counterLabel = new JLabel("Count: 0", SwingConstants.CENTER);
        counterLabel.setFont(new Font("Arial", Font.PLAIN, 18));

        JButton button = new JButton("Click Me!");
        button.setFont(new Font("Arial", Font.PLAIN, 14));
        // No easy way to style button background, border radius, etc.

        // Event handler - verbose anonymous class
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                count++;
                counterLabel.setText("Count: " + count);
            }
        });

        // Layout - manual positioning or layout managers
        JPanel centerPanel = new JPanel();
        centerPanel.setLayout(new BoxLayout(centerPanel, BoxLayout.Y_AXIS));
        centerPanel.add(Box.createVerticalGlue());
        centerPanel.add(titleLabel);
        centerPanel.add(Box.createVerticalStrut(20));
        centerPanel.add(counterLabel);
        centerPanel.add(Box.createVerticalStrut(20));
        centerPanel.add(button);
        centerPanel.add(Box.createVerticalGlue());

        add(centerPanel, BorderLayout.CENTER);
        setLocationRelativeTo(null); // Center on screen
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new SwingCounter());
    }
}`,
          pros: [
            "Mature, stable API (30+ years)",
            "Large ecosystem of existing components",
            "Works on older JVMs (Java 1.2+)",
            "Extensive documentation and community knowledge",
          ],
          cons: [
            "No CSS styling - all styling in Java code",
            "No hardware acceleration (software rendering only)",
            "Verbose code (anonymous inner classes for events)",
            "Poor high-DPI support (blurry on Retina displays)",
            "No built-in animation framework",
            "Feels outdated compared to modern UIs",
          ],
        }}
        newCode={{
          title: "JavaFX (2011+) - Modern & Clean",
          language: "java",
          code: `import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class JavaFXCounter extends Application {
    private int count = 0;

    @Override
    public void start(Stage primaryStage) {
        // Create UI components
        Label titleLabel = new Label("JavaFX Application");
        titleLabel.setStyle(
            "-fx-font-size: 24px; " +
            "-fx-font-weight: bold; " +
            "-fx-text-fill: #3b82f6;"
        );

        Label counterLabel = new Label("Count: 0");
        counterLabel.setStyle("-fx-font-size: 18px;");

        Button button = new Button("Click Me!");
        button.setStyle(
            "-fx-background-color: #3b82f6; " +
            "-fx-text-fill: white; " +
            "-fx-padding: 10 20; " +
            "-fx-background-radius: 5; " +
            "-fx-font-size: 14px;"
        );

        // Event handler - concise lambda expression
        button.setOnAction(event -> {
            count++;
            counterLabel.setText("Count: " + count);
        });

        // Layout - simple VBox with spacing
        VBox root = new VBox(20); // 20px spacing
        root.setAlignment(Pos.CENTER);
        root.setPadding(new Insets(40));
        root.setStyle("-fx-background-color: #f9fafb;");
        root.getChildren().addAll(titleLabel, counterLabel, button);

        Scene scene = new Scene(root, 400, 300);
        primaryStage.setTitle("JavaFX Counter");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}`,
          pros: [
            "CSS styling - designer-friendly, separate style from code",
            "Hardware-accelerated rendering (GPU, 60 FPS)",
            "Modern syntax (lambdas, method references)",
            "Built-in animation framework (transitions, timelines)",
            "Excellent high-DPI support (sharp on 4K, Retina)",
            "Scene Graph architecture (efficient rendering)",
            "FXML support (XML-based UI definition)",
            "3D graphics support (PerspectiveCamera, 3D shapes)",
          ],
          cons: [
            "Requires Java 11+ (won't run on older JVMs)",
            "Steeper learning curve (Scene Graph, Properties, FXML)",
            "Smaller community than Swing (but growing)",
            "Not included in JDK by default (must add as dependency)",
          ],
        }}
      />

      {/* 4. Scene Graph Architecture deep dive */}
      <StepByStepExplanation
        title="Scene Graph Architecture - JavaFX's Foundation"
        description="Understanding the hierarchical tree structure that powers JavaFX rendering"
        steps={sceneGraphSteps}
        autoPlay={false}
      />

      {/* 5. Interactive Demo - Hello World JavaFX */}
      <JavaCodePlayground
        title="Hello World JavaFX Application"
        description="Complete JavaFX application demonstrating Stage, Scene, and basic nodes"
        javaCode={`package com.example;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Stage;

/**
 * Module 1.1: Why JavaFX? - Hello World Example
 *
 * Demonstrates:
 * - Application: Entry point for JavaFX apps
 * - Stage: The window (theater metaphor)
 * - Scene: The canvas where UI elements are displayed
 * - Nodes: UI elements (Label, Button, etc.)
 */
public class HelloWorld extends Application {

    private int clickCount = 0;

    @Override
    public void start(Stage primaryStage) {
        // Create UI elements (Nodes)
        Label titleLabel = new Label("Welcome to JavaFX!");
        titleLabel.setFont(Font.font("Arial", FontWeight.BOLD, 32));
        titleLabel.setTextFill(Color.web("#3b82f6")); // Blue

        Label subtitleLabel = new Label("This is your first JavaFX application");
        subtitleLabel.setFont(Font.font("Arial", 16));
        subtitleLabel.setTextFill(Color.web("#6b7280")); // Gray

        Label counterLabel = new Label("Click count: 0");
        counterLabel.setFont(Font.font("Arial", FontWeight.BOLD, 18));

        Button clickButton = new Button("Click Me!");
        clickButton.setFont(Font.font("Arial", 14));
        clickButton.setStyle(
            "-fx-background-color: #3b82f6; " +
            "-fx-text-fill: white; " +
            "-fx-padding: 10 20; " +
            "-fx-background-radius: 5;"
        );

        // Event handler - updates counter
        clickButton.setOnAction(event -> {
            clickCount++;
            counterLabel.setText("Click count: " + clickCount);
        });

        // Layout container - VBox arranges children vertically
        VBox root = new VBox(20); // 20px spacing
        root.setAlignment(Pos.CENTER);
        root.setPadding(new Insets(40));
        root.setStyle("-fx-background-color: #f9fafb;");
        root.getChildren().addAll(
            titleLabel,
            subtitleLabel,
            counterLabel,
            clickButton
        );

        // Create Scene (canvas)
        Scene scene = new Scene(root, 600, 400);

        // Configure Stage (window)
        primaryStage.setTitle("JavaFX Hello World - Module 1.1");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args); // Launch JavaFX application
    }
}`}
        fileName="HelloWorld.java"
      />

      {/* 6. Runnable Example */}
      <JavaFXScreenshot
        src="/demos/module-1-1-placeholder.svg"
        alt="JavaFX Hello World Application"
        title="Live JavaFX Application"
        description="Clone and run this example locally to see JavaFX in action"
        repoUrl="https://github.com/your-username/javafx-examples/tree/main/module-1-1-hello-world"
      />

      {/* 7. Challenges */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">🎯 Test Your Understanding</h3>

        <Challenge
          question="Why did Oracle create JavaFX instead of improving Swing?"
          answers={[
            {
              id: "a",
              text: "Swing code was too messy to refactor",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Swing's architecture (software rendering, no CSS, single-threaded) couldn't meet modern UI expectations. A complete redesign was needed.",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Oracle wanted to force developers to buy licenses",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Swing was too fast and needed to be slowed down",
              isCorrect: false,
            },
          ]}
          explanation={
            <div className="space-y-2">
              <p className="font-semibold">Correct answer: B</p>
              <p>
                <strong>Swing's limitations were architectural</strong>, not just code quality issues:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Software rendering</strong>: Swing didn't use GPU acceleration. Modern UIs need hardware-accelerated
                  animations (60 FPS) and visual effects. This required a new rendering engine (Prism in JavaFX).
                </li>
                <li>
                  <strong>No CSS styling</strong>: All styling in Swing required Java code. Modern apps need designer-friendly
                  CSS-like styling systems. This required a fundamental change in how components are styled.
                </li>
                <li>
                  <strong>Single-threaded rendering</strong>: Swing's Event Dispatch Thread (EDT) model caused UI freezes.
                  JavaFX introduced Task and Service for proper async handling.
                </li>
              </ul>
              <p>
                <strong>Mental Model</strong>: When technology's core architecture can't support new requirements,
                incremental improvements won't work. You need a redesign (like React replacing jQuery, or TypeScript extending JavaScript).
              </p>
            </div>
          }
        />

        <Challenge
          question="What is the Scene Graph in JavaFX?"
          answers={[
            {
              id: "a",
              text: "A graphing library for charts and plots",
              isCorrect: false,
            },
            {
              id: "b",
              text: "A hierarchical tree structure of UI nodes, similar to DOM in web browsers, that enables efficient rendering and transformations",
              isCorrect: true,
            },
            {
              id: "c",
              text: "A debugging tool for visualizing application state",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A CSS file that defines the visual appearance",
              isCorrect: false,
            },
          ]}
          explanation={
            <div className="space-y-2">
              <p className="font-semibold">Correct answer: B</p>
              <p>
                The <strong>Scene Graph</strong> is JavaFX's core architectural innovation:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Hierarchical tree structure</strong>: Like the DOM in web browsers, each node can have children.
                  Parent nodes (VBox, HBox, Pane) contain child nodes (Labels, Buttons, etc.).
                </li>
                <li>
                  <strong>Automatic optimization</strong>: JavaFX only repaints "dirty" regions (nodes that changed).
                  This is much faster than repainting the entire window (like Swing does).
                </li>
                <li>
                  <strong>Transformation inheritance</strong>: When you rotate/scale/move a parent node, all children
                  inherit those transformations automatically. This makes complex animations simple.
                </li>
                <li>
                  <strong>Hardware accelerated</strong>: The Scene Graph is rendered by Prism engine using GPU,
                  enabling smooth 60 FPS animations.
                </li>
              </ul>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 mt-2">
                <p className="text-sm font-semibold">💡 Mental Model</p>
                <p className="text-sm">
                  Think of Scene Graph like a **game engine's scene tree**: hierarchical, hardware-accelerated,
                  with automatic optimization. Each node is like a game object that can be transformed, styled, and animated.
                </p>
              </div>
            </div>
          }
        />
      </div>

      {/* 8. Key Takeaways */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🎓</span>
            <span>Key Takeaways</span>
          </h3>
          <ol className="list-decimal pl-6 space-y-3 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Swing (1998) was revolutionary</strong> but couldn't evolve to meet modern UI expectations
              (hardware acceleration, CSS styling, animations, high-DPI support).
            </li>
            <li>
              <strong>JavaFX (2008, rewritten 2011)</strong> is Oracle's modern answer: GPU-accelerated rendering,
              CSS styling, Scene Graph architecture, FXML declarative UI, and Java 8+ language features (lambdas).
            </li>
            <li>
              <strong>Scene Graph architecture</strong> is the foundation: hierarchical tree of UI nodes (like DOM),
              hardware-accelerated rendering, automatic optimization (dirty region repainting), transformation inheritance.
            </li>
            <li>
              <strong>CSS separation of concerns</strong>: Designers style with CSS, developers code in Java.
              Theme switching is easy (swap CSS file). Similar to web development workflow.
            </li>
            <li>
              <strong>Theater metaphor</strong>: Stage (window) → Scene (canvas) → Nodes (actors/props).
              This mental model makes JavaFX architecture intuitive.
            </li>
            <li>
              <strong>Trade-offs exist</strong>: JavaFX requires Java 11+, steeper learning curve, smaller community than Swing.
              But for modern desktop apps, these trade-offs are worth it.
            </li>
          </ol>

          <div className="bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 mt-6">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
              💡 Mental Model for This Module
            </p>
            <p className="text-slate-700 dark:text-slate-300 italic">
              "JavaFX is to Swing what React is to jQuery: a modern, architecture-driven redesign
              that embraces new patterns (Scene Graph vs Virtual DOM, CSS styling, declarative UI)
              to meet evolving user expectations. Both required rethinking core architecture, not just incremental improvements."
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold mb-2">🏃 Next Steps</p>
            <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
              <li>
                ✅ <strong>Clone and run the example</strong>:
                <code className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded ml-2">
                  cd module-1-1-hello-world && mvn javafx:run
                </code>
              </li>
              <li>
                ✅ <strong>Modify the code</strong>: Change colors, fonts, add more buttons. Experiment!
              </li>
              <li>
                ✅ <strong>Read JavaFX docs</strong>:
                <a href="https://openjfx.io/" target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                  openjfx.io
                </a>
              </li>
              <li>
                ✅ <strong>Next module</strong>: Module 1.2 - Stage, Scene, Nodes (Deep dive into JavaFX architecture)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
