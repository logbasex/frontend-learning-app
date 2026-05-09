"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const rnCode = `// hello-rn.tsx
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function HelloScreen() {
  const [name, setName] = useState("World");

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {name}!</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  greeting: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "80%",
    fontSize: 16,
  },
});`;

const flutterCode = `// hello.dart
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) =>
      const MaterialApp(home: HelloScreen());
}

class HelloScreen extends StatefulWidget {
  const HelloScreen({super.key});
  @override
  State<HelloScreen> createState() => _HelloScreenState();
}

class _HelloScreenState extends State<HelloScreen> {
  final _controller = TextEditingController(text: "World");

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "Hello, \${_controller.text}!",
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _controller,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: "Enter your name",
                ),
                onChanged: (_) => setState(() {}),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`;

export function Module_7_6_Content() {
  return (
    <ScaffoldModule
      emoji="📱"
      problemTitle="React Native vs Flutter vs Ionic — three answers, one question"
      problem={
        <>
          <p>
            Every cross-platform mobile framework is trying to answer the same question: how do
            we ship one codebase to both iOS and Android? React Native answers it by rendering{" "}
            <strong>real native UI components</strong> via a JavaScript bridge. Your{" "}
            <code>&lt;View&gt;</code> becomes a{" "}
            <code>UIView</code> on iOS and an <code>android.view.View</code> on Android. The
            result looks genuinely native, performs well, and lets JavaScript developers reuse
            their existing skills.
          </p>
          <p>
            Flutter takes a completely different path: it ships its{" "}
            <strong>own renderer</strong> (Skia on older devices, Impeller on newer ones) and
            draws every pixel itself. There are no native widgets involved — Flutter owns the
            canvas. This gives you pixel-perfect cross-platform parity (the app looks{" "}
            <em>identical</em> on both platforms) at the cost of adopting Dart instead of
            JavaScript.
          </p>
          <p>
            Ionic wraps a standard Web app inside a{" "}
            <strong>WebView</strong> and exposes native device APIs (camera, GPS, push
            notifications) through Capacitor plugins. If your team already ships a React or
            Angular web app, Ionic lets you go mobile fastest. The trade-off is a lower
            performance ceiling: the WebView adds overhead that React Native and Flutter avoid.
            Choose by team skill set and target quality bar.
          </p>
        </>
      }
      body={
        <div className="space-y-4">
          <CodeBlock
            language="tsx"
            fileName="hello-rn.tsx"
            code={rnCode}
          />
          <CodeBlock
            language="dart"
            fileName="hello.dart"
            code={flutterCode}
          />
        </div>
      }
      challenge={{
        question:
          "Why does Flutter render the same on every platform, while React Native looks slightly different on iOS vs Android?",
        options: [
          {
            id: "a",
            text: "Flutter compiles to native machine code, so the OS handles rendering consistently.",
          },
          {
            id: "b",
            text: "Flutter ships its own renderer and draws every pixel itself, ignoring native widgets. React Native uses each platform's native UIKit/Android Views, which look slightly different by design.",
          },
          {
            id: "c",
            text: "React Native uses a WebView on both platforms, which introduces OS-level rendering differences.",
          },
          {
            id: "d",
            text: "Flutter enforces a single design system (Material) whereas React Native has no default design system.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            Flutter owns its entire rendering pipeline via Skia/Impeller — it never asks the OS
            to draw a button or a text field. Every pixel is Flutter&apos;s responsibility, so the
            output is identical on iOS and Android. React Native delegates to each platform&apos;s
            native widget toolkit, which intentionally differ (iOS uses UIKit, Android uses
            Views), producing subtly different appearances.
          </>
        ),
      }}
      takeaways={[
        <>
          React Native renders <strong>real native UI components</strong> via a JS bridge —
          looks native on each platform but appearance varies slightly between iOS and Android.
        </>,
        <>
          Flutter uses its <strong>own renderer</strong> (Skia/Impeller) and draws every pixel,
          giving pixel-perfect cross-platform parity at the cost of learning Dart.
        </>,
        <>
          Ionic wraps a Web app in a WebView — fastest to ship for Web teams, but with the
          lowest performance ceiling of the three.
        </>,
      ]}
      mentalModel="RN: real native UI, JS bridge. Flutter: own renderer, every pixel. Ionic: Web in a WebView."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
