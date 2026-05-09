"use client";

import { EventLoopVisualizer } from "@/components/EventLoopVisualizer";

export function EventLoopVisualizerDemo() {
  return (
    <EventLoopVisualizer
      title="setTimeout vs Promise — order"
      code={`console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`}
      frames={[
        { description: "Initial — main script enters call stack", callStack: ["<script>"], macrotaskQueue: [], microtaskQueue: [], consoleLog: [] },
        { description: "console.log('A') runs", callStack: ["<script>"], macrotaskQueue: [], microtaskQueue: [], consoleLog: ["A"] },
        { description: "setTimeout schedules a macrotask", callStack: ["<script>"], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: [], consoleLog: ["A"] },
        { description: "Promise.resolve().then schedules a microtask", callStack: ["<script>"], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: ["() => console.log('C')"], consoleLog: ["A"] },
        { description: "console.log('D') runs", callStack: ["<script>"], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: ["() => console.log('C')"], consoleLog: ["A", "D"] },
        { description: "Script ends; microtask queue drains first", callStack: [], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: ["() => console.log('C')"], consoleLog: ["A", "D"] },
        { description: "Microtask runs — log 'C'", callStack: [], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: [], consoleLog: ["A", "D", "C"] },
        { description: "Macrotask runs — log 'B'", callStack: [], macrotaskQueue: [], microtaskQueue: [], consoleLog: ["A", "D", "C", "B"] },
      ]}
    />
  );
}
