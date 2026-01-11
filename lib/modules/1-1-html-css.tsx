import { HTMLPlayground, ReactPlayground } from "@/components/CodePlayground";
import { BrowserRenderingPipeline } from "@/components/InteractiveDiagram";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Card, CardContent } from "@/components/ui/card";

export function Module_1_1_Content() {
  // Browser Rendering Pipeline - Detailed Steps
  const browserRenderingSteps: Step[] = [
    {
      title: "Step 1: Browser receives HTML from server",
      description:
        "When you access a URL (e.g., google.com), the browser sends an HTTP request to the server. The server returns an HTML file - this is plain text containing tags like <html>, <head>, <body>. The browser begins reading this file from top to bottom (top-to-bottom parsing).",
      code: `<!-- Server returns this HTML -->
<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a paragraph.</p>
</body>
</html>`,
    },
    {
      title: "Step 2: HTML Parser creates DOM Tree",
      description:
        "The browser uses the HTML Parser to parse HTML into a DOM (Document Object Model) Tree - a tree structure in memory. Each HTML tag becomes a 'node' in the tree. For example: <html> is the root node, <head> and <body> are children of <html>. This DOM Tree is a representation of HTML in memory, which the browser will use for rendering.",
      code: `// DOM Tree (simplified representation)
Document
└── html
    ├── head
    │   ├── title ("My Page")
    │   └── link (styles.css)
    └── body
        ├── h1 ("Hello World")
        └── p ("This is a paragraph.")`,
    },
    {
      title: "Step 3: Browser loads CSS and parses it into CSSOM",
      description:
        "When the browser encounters a <link rel='stylesheet'> tag, it loads the CSS file from the server (parallel request). The CSS Parser parses CSS into CSSOM (CSS Object Model) - a structure similar to DOM but for styles. CSSOM contains all rules (selectors + declarations). For example: h1 { color: red; } → selector 'h1' with property 'color' = 'red'.",
      code: `/* styles.css */
body {
  margin: 0;
  font-family: Arial;
}

h1 {
  color: blue;
  font-size: 32px;
}

p {
  color: gray;
  line-height: 1.6;
}

/* CSSOM tree:
- body: { margin: 0, font-family: Arial }
- h1: { color: blue, font-size: 32px }
- p: { color: gray, line-height: 1.6 }
*/`,
    },
    {
      title: "Step 4: Combine DOM + CSSOM = Render Tree",
      description:
        "The browser combines the DOM Tree and CSSOM Tree to create the Render Tree. The Render Tree only contains nodes that NEED TO BE DISPLAYED on screen (visible nodes). For example: <head>, <script>, elements with display:none will NOT be in the Render Tree. Each node in the Render Tree knows: (1) What the content is (text, image...), (2) How it's styled (color, font-size...).",
      code: `// Render Tree (only visible nodes)
RenderObject (body)
├── RenderObject (h1)
│   ├── Text: "Hello World"
│   └── Styles: { color: blue, font-size: 32px }
└── RenderObject (p)
    ├── Text: "This is a paragraph."
    └── Styles: { color: gray, line-height: 1.6 }

// Note: <head>, <title> are NOT in the Render Tree
// because they are not visible on screen`,
    },
    {
      title: "Step 5: Layout (Reflow) - Calculate position and size",
      description:
        "The Layout process (also called Reflow) calculates the EXACT position (x, y coordinates) and size (width, height) of EACH ELEMENT on the screen. The browser starts from the root of the Render Tree, calculating in order: (1) Box model (margin, border, padding, content), (2) Position (static, relative, absolute, fixed), (3) Float and clear. Output: Each node has exact coordinates (e.g., h1 at position x=0, y=0, width=800px, height=50px).",
      code: `// Layout calculation (pseudo-code)
body {
  x: 0, y: 0
  width: 800px (viewport width)
  height: auto (calculated from children)
}

h1 {
  x: 0, y: 0 (relative to body)
  width: 800px (inherit from parent)
  height: 50px (calculated from font-size + line-height)
}

p {
  x: 0, y: 50px (after h1)
  width: 800px
  height: 30px
}`,
    },
    {
      title: "Step 6: Paint - Draw pixels to screen",
      description:
        "The Paint process draws EACH PIXEL to the screen in layer order. The browser divides elements into multiple layers (e.g., background layer, text layer, border layer). Paint order: (1) Background color/image, (2) Borders, (3) Children elements, (4) Outline. The browser uses the GPU to accelerate this process. Result: You see the webpage displayed on screen!",
      code: `// Paint operations (simplified)
PaintLayer 1: body background (white)
PaintLayer 2: h1 text ("Hello World" with color blue)
PaintLayer 3: p text ("This is..." with color gray)

// With animations/transforms:
// Browser creates separate composite layers
// to avoid repainting the entire page`,
    },
    {
      title: "Step 7: Compositing - Combine layers together",
      description:
        "Compositing is the final step: The browser composites all layers together into a final image displayed on screen. If there's scrolling, the browser just needs to move layers (no repaint needed). If there are CSS transforms (translate, rotate, scale), the browser uses the GPU to composite very quickly. This is why transform/opacity animations are faster than left/top animations (transform doesn't trigger layout/paint, only composite).",
      code: `// Compositing layers
Layer 1: Main document layer
  └── Contains: body, h1, p

Layer 2: Fixed positioned element (if any)
Layer 3: Transformed element (if any)

// Browser composites these layers:
FinalImage = Layer1 + Layer2 + Layer3

// With hardware acceleration (GPU):
// Compositing is VERY FAST (60fps)`,
    },
  ];

  // HTML Semantic Tags explanation
  const semanticHTMLSteps: Step[] = [
    {
      title: "Why do we need Semantic HTML?",
      description:
        "Before semantic tags existed, developers only used <div> and <span> for everything. Problem: Browsers, screen readers, and search engines DON'T KNOW which element is a header, which is navigation, which is main content. Solution: HTML5 introduced semantic tags like <header>, <nav>, <main>, <article>, <aside>, <footer> - each tag has CLEAR MEANING.",
      code: `<!-- Old way (non-semantic) -->
<div class="header">
  <div class="nav">
    <a href="/">Home</a>
  </div>
</div>
<div class="main">
  <div class="article">Content here</div>
</div>
<div class="footer">Copyright 2025</div>

<!-- Problem: Browser doesn't know which div is what! -->`,
    },
    {
      title: "Semantic Tags help Screen Readers",
      description:
        "Screen readers (software for visually impaired users) use semantic tags to navigate. When encountering <nav>, screen reader announces: 'Navigation landmark'. Users can skip navigation if they want. When encountering <main>, announces: 'Main content'. When encountering <article>, announces: 'Article'. If you only use <div>, screen reader just reads 'division' - no context!",
      code: `<!-- Screen reader benefits -->
<nav>  <!-- "Navigation landmark" -->
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

<main>  <!-- "Main content" -->
  <article>  <!-- "Article" -->
    <h1>Title</h1>  <!-- "Heading level 1" -->
    <p>Content</p>
  </article>
</main>

<!-- Users can jump between landmarks:
   Ctrl+Home → Main content
   D → Next landmark
-->`,
    },
    {
      title: "SEO Benefits - Search Engines understand structure",
      description:
        "Google and other search engines use semantic HTML to understand page structure. <article> → this is main content, index it. <aside> → this is sidebar/related content, less important. <time> → this is publication date. <address> → contact info. Result: Better search rankings because Google clearly understands your content. Rich snippets (featured snippets on Google) also rely on semantic HTML.",
      code: `<!-- SEO-friendly semantic HTML -->
<article itemscope itemtype="http://schema.org/BlogPosting">
  <header>
    <h1 itemprop="headline">React Hooks Explained</h1>
    <time itemprop="datePublished" datetime="2025-01-10">
      January 10, 2025
    </time>
    <address itemprop="author">
      By John Doe
    </address>
  </header>

  <section itemprop="articleBody">
    <p>Main content here...</p>
  </section>
</article>

<!-- Google extracts:
   Title: React Hooks Explained
   Date: Jan 10, 2025
   Author: John Doe
-->`,
    },
  ];

  // CSS Cascade explanation
  const cssCascadeSteps: Step[] = [
    {
      title: "What is Cascade? Why is it called 'Cascading'?",
      description:
        "'Cascading' means 'waterfall' - styles flow from top to bottom, from parent to child. When multiple CSS rules apply to 1 element, the browser must decide which rule 'wins'. The Cascade algorithm has 3 deciding factors (in order of priority): (1) Importance (!important), (2) Specificity (how specific the selector is), (3) Source order (which rule is declared later).",
      code: `/* Example of cascade conflict */
p {
  color: blue;  /* Rule 1 */
}

.highlight {
  color: red;  /* Rule 2 - higher specificity */
}

#unique {
  color: green !important;  /* Rule 3 - !important wins all */
}

<p class="highlight" id="unique">
  What color is this text?
  → GREEN (because of !important)
</p>`,
    },
    {
      title: "Specificity - How specific is the selector",
      description:
        "Specificity is calculated by formula: (inline styles, IDs, classes, elements). For example: inline style = 1000 points, #id = 100 points, .class = 10 points, element = 1 point. The more specific the selector, the more it wins. Example: #header .nav li (100+10+1=111) beats .nav li (10+1=11). Tips: Avoid !important because it's hard to override. Use classes instead of IDs for flexibility.",
      code: `/* Specificity calculation */

/* Specificity: 1 (1 element) */
p { color: black; }

/* Specificity: 11 (1 class + 1 element) */
p.intro { color: blue; }

/* Specificity: 101 (1 ID + 1 element) */
#main p { color: red; }

/* Specificity: 111 (1 ID + 1 class + 1 element) */
#main p.intro { color: green; }

/* Specificity: 1000 (inline style) */
<p style="color: purple;">Purple wins!</p>

/* Specificity: ∞ (!important) */
p { color: orange !important; }`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <h2>🌍 The Problem: How to share information on the Internet?</h2>
          <p>
            In <strong>1989</strong>, Tim Berners-Lee at CERN (European Organization for Nuclear Research) faced a major problem:
            Thousands of scientists around the world needed to share papers, research findings, and collaborate. But:
          </p>
          <ul>
            <li>
              <strong>Everyone used different computers</strong>: Unix, Windows, Mac
            </li>
            <li>
              <strong>No standard format</strong>: Word docs, PDFs, plain text files...
            </li>
            <li>
              <strong>Hard to link documents</strong>: How to reference from doc A to doc B?
            </li>
          </ul>
          <p>
            Tim needed a <strong>UNIVERSAL</strong> solution - one that works on all computers, all OSes.
          </p>

          <h3>💡 The Solution: HTML (HyperText Markup Language)</h3>
          <p>
            Tim created <strong>HTML</strong> - a simple markup language with:
          </p>
          <ul>
            <li>
              <strong>Tags</strong>: Wrap content with {'<tag>content</tag>'} to define structure
            </li>
            <li>
              <strong>Hyperlinks</strong>: {'<a href="...">link</a>'} to connect documents
            </li>
            <li>
              <strong>Platform-independent</strong>: Just need a browser to read, no specific software required
            </li>
          </ul>
          <p>
            On <strong>August 6, 1991</strong>, Tim published the first website: info.cern.ch. This was the beginning of the World Wide Web!
          </p>
        </CardContent>
      </Card>

      {/* Step-by-step: Browser Rendering Pipeline */}
      <StepByStepExplanation
        title="Browser Rendering Pipeline - Detailed Step-by-Step"
        description="Understand exactly what the browser does from receiving HTML/CSS from the server to displaying on screen"
        steps={browserRenderingSteps}
        autoPlay={true}
        autoPlayDelay={5000}
      />

      {/* Visual Diagram */}
      <BrowserRenderingPipeline />

      {/* First HTML Playground */}
      <HTMLPlayground
        title="Try creating your first HTML page!"
        description="Edit the code on the left and see the results in real-time on the right. Try changing text, adding elements..."
        html={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Website</title>
</head>
<body>
  <!-- Header Section -->
  <header>
    <h1>Welcome to my website! 🎉</h1>
    <nav>
      <a href="#about">About</a> |
      <a href="#skills">Skills</a> |
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <!-- Main Content -->
  <main>
    <section id="about">
      <h2>About Me</h2>
      <p>
        I am a <strong>Backend Developer</strong> with years of Java experience,
        and now I'm learning <em>Frontend</em> to become a Full-stack Developer!
      </p>
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#667eea"/>
        <text x="150" y="100" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">My Photo</text>
      </svg>
    </section>

    <section id="skills">
      <h2>My Skills</h2>
      <ul>
        <li>Java & Spring Boot (Expert)</li>
        <li>Microservices Architecture</li>
        <li>Docker & Kubernetes</li>
        <li>HTML & CSS (Learning)</li>
        <li>React & Next.js (Coming soon)</li>
      </ul>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <form>
        <label for="name">Name:</label><br>
        <input type="text" id="name" placeholder="Enter your name"><br><br>

        <label for="email">Email:</label><br>
        <input type="email" id="email" placeholder="your@email.com"><br><br>

        <label for="message">Message:</label><br>
        <textarea id="message" rows="4" placeholder="Write a message..."></textarea><br><br>

        <button type="submit">Send</button>
      </form>
    </section>
  </main>

  <!-- Footer -->
  <footer>
    <p>&copy; 2025 - My First Website. Made with ❤️ and HTML</p>
  </footer>
</body>
</html>`}
        css={`/* Reset & Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* Header Styles */
header {
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-align: center;
}

h1 {
  color: #667eea;
  font-size: 2.5rem;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

nav {
  margin-top: 15px;
}

nav a {
  color: #764ba2;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 15px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

nav a:hover {
  background: #667eea;
  color: white;
}

/* Main Content */
main {
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

section {
  margin-bottom: 40px;
  scroll-margin-top: 20px; /* For smooth scroll with fixed header */
}

h2 {
  color: #667eea;
  font-size: 2rem;
  margin-bottom: 15px;
  border-bottom: 3px solid #764ba2;
  padding-bottom: 10px;
}

p {
  margin-bottom: 15px;
  text-align: justify;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin: 20px 0;
}

/* Lists */
ul {
  list-style-position: inside;
  margin-left: 20px;
}

ul li {
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  border-radius: 4px;
}

/* Forms */
form {
  max-width: 500px;
}

label {
  font-weight: 600;
  color: #764ba2;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #667eea;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

button:active {
  transform: translateY(0);
}

/* Footer */
footer {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

footer p {
  margin: 0;
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  body {
    padding: 10px;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  nav a {
    display: block;
    margin: 5px 0;
  }
}`}
      />

      {/* Semantic HTML Step-by-step */}
      <StepByStepExplanation
        title="Semantic HTML - Why is it important?"
        description="Understand in detail why semantic tags (<header>, <nav>, <main>...) are more important than just using <div>"
        steps={semanticHTMLSteps}
      />

      {/* Code Comparison: <font> vs CSS */}
      <CodeComparison
        title="Why not use the <font> tag?"
        description="Comparison of old way (1990s inline styling) vs new way (CSS separation of concerns)"
        oldCode={{
          title: "Old Way (1990s) - Inline Styling with <font>",
          code: `<!-- HTML with inline styling (BAD PRACTICE) -->
<font color="red" size="6" face="Arial">
  <b>Large red heading</b>
</font>

<p>
  Paragraph text with
  <font color="blue" size="4" face="Verdana">
    <i>large blue italic text</i>
  </font>
  and normal text.
</p>

<font color="green" size="3">
  List:
</font>
<ul>
  <li><font color="purple" size="2">Item 1</font></li>
  <li><font color="purple" size="2">Item 2</font></li>
  <li><font color="purple" size="2">Item 3</font></li>
</ul>`,
          language: "html",
          pros: [
            "Simple, easy to understand for beginners",
            "No need to learn CSS",
            "WYSIWYG - see style directly in HTML",
          ],
          cons: [
            "❌ Mixes structure (HTML) with presentation (styling)",
            "❌ Hard to maintain: Want to change color 'purple' → must edit EVERY place",
            "❌ Not reusable: Copy-paste code many times",
            "❌ HTML file very long, hard to read",
            "❌ No semantic meaning (search engines don't understand)",
            "❌ <font> tag deprecated (can't use in HTML5)",
          ],
        }}
        newCode={{
          title: "New Way - Separation of Concerns (HTML + CSS)",
          code: `<!-- HTML: Only handles structure and semantics -->
<h1 class="title">Large red heading</h1>

<p>
  Paragraph text with
  <span class="highlight-text">large blue italic text</span>
  and normal text.
</p>

<h2 class="section-title">List:</h2>
<ul class="item-list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- CSS: Only handles presentation -->
<style>
.title {
  color: red;
  font-size: 2.5rem;
  font-family: Arial, sans-serif;
  font-weight: bold;
}

.highlight-text {
  color: blue;
  font-size: 1.5rem;
  font-family: Verdana, sans-serif;
  font-style: italic;
}

.section-title {
  color: green;
  font-size: 1.2rem;
}

.item-list li {
  color: purple;
  font-size: 1rem;
}
</style>`,
          language: "html",
          pros: [
            "✅ Separates structure (HTML) vs style (CSS) - Separation of Concerns",
            "✅ Easy to maintain: Change purple color → edit 1 place in CSS, applies everywhere",
            "✅ Reusable classes: .highlight-text used in many places",
            "✅ HTML shorter, easier to read",
            "✅ Semantic tags (h1, h2) help SEO and accessibility",
            "✅ CSS can be cached separately → faster load times",
            "✅ Can use CSS preprocessors (SASS, LESS) for better organization",
          ],
          cons: [
            "Need to learn CSS",
            "Slightly more complex for beginners",
            "Need to understand selectors, specificity, cascade",
          ],
        }}
      />

      {/* CSS Cascade deep dive */}
      <StepByStepExplanation
        title="CSS Cascade - Deep dive into 'Cascading' in CSS"
        description="When multiple CSS rules conflict, how does the browser decide which rule 'wins'?"
        steps={cssCascadeSteps}
      />

      {/* Challenge 1: Semantic HTML */}
      <Challenge
        title="Challenge 1: Semantic HTML"
        question="You're building a blog post page. Which structure should you use?"
        options={[
          {
            id: "a",
            text: "Use all <div> with classes: <div class='header'>, <div class='content'>, <div class='footer'>",
          },
          {
            id: "b",
            text: "Use semantic tags: <header>, <article>, <footer> and <section> for each content part",
          },
          {
            id: "c",
            text: "Use <table> for layout because it's easy to align elements",
          },
          {
            id: "d",
            text: "Doesn't matter, all 3 ways are the same in terms of performance",
          },
        ]}
        correctAnswerId="b"
        explanation={`
Answer B is correct! Semantic HTML (<header>, <article>, <footer>, <section>) provides many benefits:

1. **Accessibility**: Screen readers understand structure → visually impaired users navigate easier
2. **SEO**: Google knows what's main content (<article>), what's sidebar (<aside>)
3. **Maintainability**: Code is easier to read - just looking at the tag tells you what the element does
4. **Future-proof**: Browsers can add new features for semantic tags

Avoid:
- ❌ <div> soup: Hard to read, no meaning
- ❌ <table> for layout: Only use tables for tabular data
        `}
      />

      {/* Challenge 2: CSS Specificity */}
      <Challenge
        title="Challenge 2: CSS Specificity"
        question={`Given this CSS:
\`\`\`css
p { color: black; }
.intro { color: blue; }
#special { color: red; }
\`\`\`

What color will the element \`<p class="intro" id="special">\` have?`}
        options={[
          { id: "a", text: "Black (because p selector is declared first)" },
          { id: "b", text: "Blue (because .intro specificity is higher than p)" },
          { id: "c", text: "Red (because #special specificity is highest)" },
          { id: "d", text: "Depends on browser, each browser is different" },
        ]}
        correctAnswerId="c"
        explanation={`
Answer C is correct! RED wins because **ID selector** has the highest specificity.

**Specificity calculation** (in order of priority):
1. Inline styles (style="...") = 1000 points
2. IDs (#special) = 100 points
3. Classes (.intro) = 10 points
4. Elements (p) = 1 point

In this example:
- \`p\` = 1 point
- \`.intro\` = 10 points
- \`#special\` = 100 points ← **WINS**

**Tips**:
- Avoid using IDs for styling (hard to override)
- Prefer classes (flexible, reusable)
- Avoid !important (only use when truly necessary)
        `}
      />

      {/* Key Takeaways */}
      <Card className="border-2 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">
            🎓 Key Takeaways - Module 1.1
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="font-semibold">After this lesson, you now understand:</p>
            <ol className="space-y-3">
              <li>
                <strong>What problem HTML was created to solve</strong>: Universal format to share information across different systems
              </li>
              <li>
                <strong>Browser Rendering Pipeline</strong>: 7 detailed steps from HTML/CSS → pixels on screen
                <ul className="ml-6 mt-2">
                  <li>HTML Parser → DOM Tree</li>
                  <li>CSS Parser → CSSOM Tree</li>
                  <li>DOM + CSSOM → Render Tree</li>
                  <li>Layout (Reflow) → Calculate positions</li>
                  <li>Paint → Draw pixels</li>
                  <li>Compositing → Combine layers</li>
                </ul>
              </li>
              <li>
                <strong>Separation of Concerns</strong>: Separate HTML (structure) vs CSS (presentation) → easier to maintain
              </li>
              <li>
                <strong>Semantic HTML</strong>: Helps accessibility, SEO, and code readability
              </li>
              <li>
                <strong>CSS Cascade & Specificity</strong>: Understand how browsers decide styles when there's a conflict
              </li>
            </ol>

            <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-green-500">
              <p className="font-semibold text-green-700 dark:text-green-400 mb-2">
                💡 Mental Model:
              </p>
              <p className="italic">
                "HTML is the skeleton (structure), CSS is the skin (appearance). Separating them makes it easy to change appearance without breaking structure."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
