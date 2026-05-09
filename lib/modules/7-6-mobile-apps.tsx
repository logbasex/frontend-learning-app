"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_7_6_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const rnEndToEndSteps: Step[] = [
    {
      title: "Step 1: What RN actually is",
      description: (
        <>
          <em>React Native</em> — a framework that uses React to render real platform-native UI on
          iOS and Android via a JS bridge — is not a WebView wrapper. When you write{" "}
          <code>&lt;View&gt;</code> and <code>&lt;Text&gt;</code>, React Native maps those JSX
          elements directly to the OS&apos;s own widget APIs: <code>UIView</code> on iOS and{" "}
          <code>android.view.View</code> on Android. The user sees and touches genuine native
          controls drawn by the operating system, not web elements inside a browser.
        </>
      ),
      code: `// React Native element → native widget mapping
//
// JSX you write        iOS renders        Android renders
// ─────────────────────────────────────────────────────────
// <View>           →   UIView         →   android.view.View
// <Text>           →   UILabel        →   android.widget.TextView
// <TextInput>      →   UITextField    →   android.widget.EditText
// <ScrollView>     →   UIScrollView   →   android.widget.ScrollView
// <Image>          →   UIImageView    →   android.widget.ImageView
//
// No WebView. No CSS. Real native widgets, drawn by the OS.`,
    },
    {
      title: "Step 2: The bridge (and the new architecture)",
      description: (
        <>
          The JS bridge is the boundary between your JavaScript code and the native UI thread.
          In the <strong>legacy architecture</strong>, every prop change and event is serialized
          to JSON and sent across the bridge as a message — readable but slow for high-frequency
          updates. In the <strong>new architecture</strong> (Fabric + JSI), JavaScript can call
          native methods directly via C++ without JSON serialization, cutting the overhead
          dramatically. Either way, the architectural lesson is the same: expensive work
          should not round-trip the JS&harr;native boundary every frame.
        </>
      ),
      code: `// Legacy bridge: every message is JSON-serialized
// JS thread:     { type: 'updateView', viewId: 42, props: { color: 'red' } }
//   → serialize to JSON string
//   → queue on bridge
//   → deserialize on native thread
//   → apply to UIView/android.view.View
//
// New architecture (Fabric + JSI):
// JS thread holds a C++ reference to the native shadow node directly.
// No JSON. No queue. Direct call.
//
// Lesson: heavy compute in JS means the bridge (or JSI call)
// can't keep up with 60fps. Move expensive work to the native side.`,
    },
    {
      title: "Step 3: Style is JS objects, not CSS",
      description: (
        <>
          In React Native there is no stylesheet file and no CSS parser. Styles are plain
          JavaScript objects passed to a <code>style</code> prop. Flexbox is the default layout
          model — <code>display: flex</code> is implied, not written. There is no{" "}
          <code>display: block</code>, no cascading inheritance, no descendant selectors. The
          mental shift is real: familiar property names (<code>padding</code>,{" "}
          <code>margin</code>, <code>color</code>) but no CSS concepts around them.
        </>
      ),
      code: `import { StyleSheet, View, Text } from 'react-native';

// Styles are plain JS objects — no CSS file, no class names
const styles = StyleSheet.create({
  container: {
    flex: 1,              // flexbox is the default — always
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',   // not '700' — RN accepts string or number
    color: '#1e293b',
    // NO: display: 'block'    (flex is always on)
    // NO: class names          (no CSS classes)
    // NO: inherited color      (no cascade from parent)
  },
});`,
    },
    {
      title: "Step 4: Bootstrapping a screen",
      description: (
        <>
          The fastest way to start is <strong>Expo</strong>: <code>npx create-expo-app MyApp</code>{" "}
          sets up a React Native project with TypeScript, Metro bundler, and Expo Go (a companion
          app that runs your code on a real device instantly — no Xcode/Android Studio needed
          during development). The alternative is the React Native CLI:{" "}
          <code>npx react-native init MyApp</code>, which gives you full control but requires a
          working iOS/Android build environment from the start. Below is a minimal screen — valid
          React Native code, runnable unchanged inside a fresh Expo project.
        </>
      ),
      code: `// app/index.tsx (Expo router) — or App.tsx (bare RN)
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, world</Text>
      <Text style={styles.sub}>Open this file and start editing.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#64748b',
  },
});

// To run:
// npx create-expo-app MyApp --template blank-typescript
// cd MyApp && npx expo start
// Scan the QR code with Expo Go on your phone.`,
    },
    {
      title: "Step 5: Animations on the native side",
      description: (
        <>
          React Native&apos;s <code>Animated</code> API drives numeric values that you attach to{" "}
          style props. The key flag is <code>useNativeDriver: true</code>: it moves the animation
          off the JS thread and onto the native UI thread entirely. This means JavaScript can be
          busy — running your component logic, handling API responses — and the animation still
          runs at 60 fps independently. Drop <code>useNativeDriver</code> and the animation
          shares the JS thread; a slow render drops frames. For more complex animations,{" "}
          <code>react-native-reanimated</code> runs worklets in a separate JS runtime on the
          native side, giving you full JS expressiveness without the bridge cost.
        </>
      ),
      code: `import { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';

export function FadeIn({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,  // ← runs on the native thread, not JS
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  );
}

// useNativeDriver: true   → animation runs at 60fps even while JS is busy
// useNativeDriver: false  → animation shares the JS thread; heavy JS = dropped frames`,
    },
    {
      title: "Step 6: When a PWA is enough",
      description: (
        <>
          Before reaching for React Native, ask: does this actually need to be in the app stores?
          A <em>PWA (Progressive Web App)</em> — a web app that&apos;s installable, offline-capable,
          and behaves like a native app via service workers (defined in module{" "}
          <code>7-5</code>) — is the right pick for a content-heavy app with occasional use,
          no platform-specific APIs, and no need for App Store presence. PWAs install well on
          Android; iOS support is improving but still partial (no push notifications in some
          markets, no background sync on Safari). React Native wins when you need platform APIs
          (camera, Bluetooth, ARKit), higher performance ceilings, or App Store discoverability.
          The cheapest mobile strategy is often the one that avoids shipping a native app entirely.
        </>
      ),
      code: `// Decision checklist: React Native vs PWA
//
// Reach for a PWA when:
//   - Content app or dashboard (no native sensors needed)
//   - Occasional usage (not a primary daily-driver app)
//   - Team is web-only, no mobile build infra
//   - App Store overhead isn't worth it (review time, updates, fees)
//
// Reach for React Native when:
//   - Camera, Bluetooth, ARKit, push notifications, background tasks
//   - Needs App Store distribution / discoverability
//   - Team already knows React (huge advantage — same mental model)
//   - Performance ceiling of a WebView is not acceptable
//
// PWA installs on Android natively.
// iOS: installable from Safari, but some APIs are still gated.`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>React Native — Hello World</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="layout">
    <div class="code-panel">
      <div class="code-header">App.tsx</div>
      <pre class="code-block"><code id="code-display"></code></pre>
    </div>
    <div class="device-panel">
      <div class="device-frame">
        <div class="device-notch"></div>
        <div class="device-screen">
          <div class="screen-content">
            <p class="screen-greeting" id="greeting-text">Hello, world</p>
            <p class="screen-sub">Open this file and start editing.</p>
          </div>
        </div>
        <div class="device-home"></div>
      </div>
      <p class="device-label">iOS — native UILabel / UIView</p>
    </div>
  </div>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 860px;
}
.code-panel { flex: 1; min-width: 280px; max-width: 460px; }
.code-header {
  background: #1e293b;
  color: #94a3b8;
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 6px 6px 0 0;
  font-family: monospace;
}
.code-block {
  background: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  font-family: monospace;
  font-size: 0.72rem;
  line-height: 1.6;
  border-radius: 0 0 6px 6px;
  white-space: pre;
  overflow-x: auto;
}
.device-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.device-frame {
  width: 180px;
  height: 320px;
  background: #1e293b;
  border-radius: 28px;
  border: 3px solid #334155;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px 10px;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.device-notch {
  width: 60px;
  height: 10px;
  background: #0f172a;
  border-radius: 0 0 8px 8px;
  margin-bottom: 8px;
  flex-shrink: 0;
}
.device-screen {
  flex: 1;
  width: 100%;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.screen-content {
  text-align: center;
  padding: 12px;
}
.screen-greeting {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}
.screen-sub {
  font-size: 0.62rem;
  color: #64748b;
}
.device-home {
  width: 36px;
  height: 5px;
  background: #334155;
  border-radius: 3px;
  margin-top: 8px;
  flex-shrink: 0;
}
.device-label {
  font-size: 0.7rem;
  color: #64748b;
  text-align: center;
}`;

  const playgroundJs = `// Try this: change "Hello, world" in the App.tsx code to your name.
// The code below is real React Native syntax — drop it into a fresh
// Expo or RN project and it runs unchanged. The mock device frame on
// the right shows what the screen renders to: real native components.

var rnSource = [
  "import { View, Text, StyleSheet } from 'react-native';",
  "",
  "export default function HomeScreen() {",
  "  return (",
  "    <View style={styles.container}>",
  "      <Text style={styles.greeting}>Hello, world</Text>",
  "      <Text style={styles.sub}>Open this file and start editing.</Text>",
  "    </View>",
  "  );",
  "}",
  "",
  "const styles = StyleSheet.create({",
  "  container: {",
  "    flex: 1,",
  "    justifyContent: 'center',",
  "    alignItems: 'center',",
  "    backgroundColor: '#f8fafc',",
  "  },",
  "  greeting: {",
  "    fontSize: 28,",
  "    fontWeight: 'bold',",
  "    color: '#1e293b',",
  "    marginBottom: 8,",
  "  },",
  "  sub: {",
  "    fontSize: 14,",
  "    color: '#64748b',",
  "  },",
  "});"
].join('\\n');

var codeEl = document.getElementById('code-display');
codeEl.textContent = rnSource;

var greetingEl = document.getElementById('greeting-text');
greetingEl.title = 'Click to change the greeting';
greetingEl.style.cursor = 'pointer';
greetingEl.addEventListener('click', function() {
  var val = prompt('Change the greeting text:', greetingEl.textContent);
  if (val && val.trim()) {
    greetingEl.textContent = val.trim();
    codeEl.textContent = rnSource.replace('Hello, world', val.trim());
  }
});`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Your team knows React. The product needs an iOS and Android app. The options are:
              rewrite in Swift and Kotlin (best UX, double the codebase), use Flutter (best
              cross-platform pixel control, learn Dart), or React Native (reuse the React skills
              you have, ship to both stores). Most React-shop products end up on React Native for
              the same reason — code-share with the web team is the dominant trade.
            </p>
            <p>
              This module teaches React Native: what it is, how it works, and how to build with
              it. Flutter and Ionic are real alternatives — you will find them in a short
              Alternatives note at the end — but the body of this module teaches one tool deeply
              rather than comparing three tools shallowly. By the end you will know how React
              Native renders native UI, what the JS bridge costs, and when you should skip the
              native shell entirely and ship a PWA instead.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model first                                         */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              The three cross-platform mobile frameworks each answer the same question —
              &quot;how do we ship one codebase to iOS and Android?&quot; — by making a
              fundamentally different architectural trade. React Native threads JavaScript through
              a bridge into the OS&apos;s own widget layer, so the UI is genuinely native but the
              logic layer is JavaScript. Flutter sidesteps the OS widget layer entirely and draws
              every pixel with its own renderer, trading JS skill reuse for pixel-perfect
              cross-platform parity. Ionic skips native widgets altogether and runs the UI inside
              a WebView, trading fidelity for the shortest path from a web app to a mobile shell.
              Knowing which trade each framework makes is the only mental model you need to pick
              the right tool.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;React Native renders real native UI by calling platform widgets through a
              bridge. Flutter renders pixels itself. Ionic ships your web app inside a WebView.
              Each makes a different trade between native fidelity and code-share.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="React Native, end to end"
        description="From JavaScript to native pixels — and the decisions that matter along the way"
        steps={rnEndToEndSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Hello World — React Native source + mock device"
        description="The left panel shows real React Native syntax. The right panel shows a mock device frame rendering the same screen. Click the greeting text in the device to change it."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Your team builds React on the web. The product manager wants iOS and Android apps. React Native is the right call when:"
        options={[
          {
            id: "a",
            text: "The app must look pixel-identical on both platforms.",
          },
          {
            id: "b",
            text: "You value code-share with the web team and accept that some things will require native modules.",
          },
          {
            id: "c",
            text: "The app needs heavy use of platform-specific APIs (camera filters, ARKit, Bluetooth peripherals).",
          },
          {
            id: "d",
            text: "You have no developers on the team.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            RN&apos;s killer feature is the React skill transfer — your web team can ship to
            mobile without learning Swift/Kotlin. Where pixel-identical appearance (a) matters,
            Flutter&apos;s renderer wins because it draws every pixel itself, independent of the
            OS. Heavy platform-specific work (c) means writing native modules anyway, eroding the
            cross-platform benefit and often making pure native (Swift/Kotlin) the right call.
          </>
        }
      />

      <Challenge
        question="What does the JS bridge in React Native do?"
        options={[
          {
            id: "a",
            text: "It compiles JavaScript to native code.",
          },
          {
            id: "b",
            text: "It serializes calls between the JavaScript runtime and the native UI layer (or, in the new architecture, allows direct C++ access). It's why heavy work should live on the native side and why animations use useNativeDriver.",
          },
          {
            id: "c",
            text: "It connects the device to the dev server.",
          },
          {
            id: "d",
            text: "It's a debugging tool.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            The bridge is the boundary between the JS thread and the native UI thread. In the
            legacy architecture, every prop change was a serialized JSON message; in the new
            architecture (Fabric + JSI), JS can call native methods directly via C++. Either way,
            the architectural lesson is the same: expensive work should not round-trip JS&harr;native
            every frame, which is why animations use <code>useNativeDriver: true</code> to run
            on the native thread independently of the JS thread.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "RN's JS bridge has a measurable cost — animations should run on the native side via Animated with useNativeDriver or Reanimated",
            body: (
              <>
                Anything that drives visual changes at 60 fps from the JS thread will drop frames
                the moment JS is busy handling state updates or incoming data. Pass{" "}
                <code>useNativeDriver: true</code> to <code>Animated.timing</code> /{" "}
                <code>Animated.spring</code>, or use the <code>react-native-reanimated</code>{" "}
                library which runs worklets on the native thread by default.
              </>
            ),
          },
          {
            title: "RN's CSS-like style API is not CSS — display: flex is the default, no inheritance, no descendant selectors",
            body: (
              <>
                Flex is always on. There is no cascade, no pseudo-classes, and no media queries in
                the CSS sense. Familiar property names, completely different model. Use{" "}
                <code>StyleSheet.create()</code> instead of raw inline objects — it provides a
                minor native-side performance hint and validates property names at development time.
              </>
            ),
          },
          {
            title: "react-native-web is not a substitute for a real web app — it's for code reuse, not for shipping the same app on the web",
            body: (
              <>
                <code>react-native-web</code> renders <code>&lt;div&gt;</code> + inline styles on
                the web, not semantic HTML. It exists for teams that already have an RN app and
                want some web coverage, not as a way to ship the same bundle at production quality
                across all three platforms.
              </>
            ),
          },
          {
            title: "Flutter is the right pick for pixel-perfect cross-platform; RN is the right pick for code-share with web teams. Don't fight the tradeoff.",
            body: (
              <>
                These two goals are genuinely in tension. If the design team demands the app looks
                identical on every platform, Flutter&apos;s renderer is the correct tool. If the
                web team ships the same product and you want shared components, RN is the correct
                tool. Choosing RN for pixel-perfect work or Flutter for web-team code-share means
                fighting the framework&apos;s core architecture.
              </>
            ),
          },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 7: KeyTakeaways                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={[
          <>
            <em>React Native</em> renders real platform-native UI — <code>UIView</code> on iOS,{" "}
            <code>android.view.View</code> on Android — by calling the OS widget layer from
            JavaScript through a bridge. It is not a WebView wrapper.
          </>,
          <>
            The JS bridge serializes calls between the JavaScript runtime and the native UI
            thread. The new architecture (Fabric + JSI) replaces JSON serialization with direct
            C++ calls, but the principle is the same: keep the bridge quiet at 60 fps.
          </>,
          <>
            Style in React Native is plain JavaScript objects. Flexbox is always on. There is no
            CSS cascade, no inheritance, and no selectors. Use{" "}
            <code>StyleSheet.create()</code> for the slight native-side optimization.
          </>,
          <>
            Bootstrap with Expo (<code>npx create-expo-app</code>) for the fastest path to a
            device. The bare React Native CLI gives more control but requires a full
            iOS/Android build environment up front.
          </>,
          <>
            A <em>PWA</em> is often the right call when the app is content-heavy, usage is
            occasional, and no platform-specific APIs are needed — it avoids the entire native
            app engineering stack and ships through the web.
          </>,
        ]}
        mentalModel="React Native renders real native UI by calling platform widgets through a bridge. Flutter renders pixels itself. Ionic ships your web app inside a WebView. Each makes a different trade between native fidelity and code-share."
      />

      {/* Alternatives — one paragraph after KeyTakeaways */}
      <Card>
        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <p>
            <strong>Alternatives.</strong> <em>Flutter</em> uses Dart and Skia (its own
            renderer); every pixel is drawn by Flutter, not the OS. Pixel-perfect
            cross-platform, larger bundle, no JS skill reuse. <em>Ionic</em> wraps a web app in
            a native WebView via Capacitor — fastest path from web app to mobile, with the same
            web-vs-native UX gap that defines the trade. <em>Native</em> (Swift/Kotlin) is best
            when you need the absolute UX ceiling and don&apos;t mind two codebases.{" "}
            <em>PWAs</em> are the right pick when &quot;an app icon and offline mode&quot; is
            enough — no app stores, no native code, just a web app that installs.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
