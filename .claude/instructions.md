# Claude Code Instructions

## CRITICAL: Language Requirement

**ALL CODE, COMMENTS, DOCUMENTATION, AND USER-FACING TEXT MUST BE IN ENGLISH**

This is a **MANDATORY** requirement. Never use Vietnamese or any other language.

## Implementation Guidelines

### 1. Language Standards

- ✅ **DO**: Write all code comments in English
- ✅ **DO**: Write all user-facing text in English
- ✅ **DO**: Write all variable names, function names in English
- ✅ **DO**: Write all documentation in English
- ❌ **DON'T**: Use Vietnamese in any code, comments, or UI text
- ❌ **DON'T**: Use mixed languages

### 2. Module Implementation

When implementing new modules in `lib/modules/`:

```tsx
// ✅ CORRECT - English
export function Module_1_2_Content() {
  const steps: Step[] = [
    {
      title: "Step 1: Understanding the Event Loop",
      description: "The browser uses a single-threaded event loop...",
      code: `// Event loop example`
    }
  ];

  return (
    <Card>
      <CardContent>
        <h2>🌍 The Problem: Static web pages cannot respond to user interactions</h2>
        <p>In the early days of the web...</p>
      </CardContent>
    </Card>
  );
}

// ❌ INCORRECT - Vietnamese
export function Module_1_2_Content() {
  const steps: Step[] = [
    {
      title: "Bước 1: Hiểu về Event Loop",
      description: "Trình duyệt sử dụng event loop đơn luồng...",
      // ...
    }
  ];
}
```

### 3. Component Text

All UI components must use English:

```tsx
// ✅ CORRECT
<Button>Start Learning</Button>
<h3>After completing this lesson you will:</h3>
<Badge>Completed</Badge>

// ❌ INCORRECT
<Button>Bắt đầu học</Button>
<h3>Sau khi học xong bài này bạn sẽ:</h3>
<Badge>Hoàn thành</Badge>
```

### 4. Code Comments

```tsx
// ✅ CORRECT - English comments
// Calculate the total progress percentage
const totalProgress = (completed / total) * 100;

// Fetch data from the API
const fetchData = async () => {
  // Handle loading state
  setLoading(true);

  // Make the request
  const response = await fetch(url);
};

// ❌ INCORRECT - Vietnamese comments
// Tính toán phần trăm tiến độ
const totalProgress = (completed / total) * 100;
```

### 5. Mental Models and Takeaways

```tsx
// ✅ CORRECT
<div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg">
  <p className="font-semibold">💡 Mental Model:</p>
  <p className="italic">
    "The Virtual DOM is like a draft paper before drawing the final version"
  </p>
</div>

// Key Takeaways
<p className="font-semibold">After this lesson, you now understand:</p>
<ol>
  <li><strong>What problem HTML was created to solve</strong>: Universal format to share information</li>
  <li><strong>Browser Rendering Pipeline</strong>: 7 detailed steps from HTML/CSS to pixels</li>
</ol>

// ❌ INCORRECT - Vietnamese
<p className="italic">
  "Virtual DOM giống như bản nháp trước khi vẽ bản chính thức"
</p>
```

### 6. Challenge Questions

```tsx
// ✅ CORRECT
<Challenge
  title="Challenge 1: Understanding React Hooks"
  question="When should you use useEffect instead of useState?"
  options={[
    { id: "a", text: "When you need to synchronize with external systems" },
    { id: "b", text: "When you need local component state" }
  ]}
  correctAnswerId="a"
  explanation={`
Answer A is correct! useEffect is used to synchronize your component with external systems.

**Details**:
- useState: For local component state
- useEffect: For side effects and synchronization
- Custom hooks: For reusable logic

**Best Practice**: Only use useEffect when you need to synchronize with something outside React.
  `}
/>
```

### 7. Code Playground Examples

```tsx
// ✅ CORRECT
<HTMLPlayground
  title="Try creating your first interactive form!"
  description="Edit the code on the left and see the results in real-time on the right."
  html={`<!DOCTYPE html>
<html lang="en">
<head>
  <title>My First Form</title>
</head>
<body>
  <h1>Contact Form</h1>
  <form>
    <label for="name">Name:</label>
    <input type="text" id="name" placeholder="Enter your name">
    <button type="submit">Submit</button>
  </form>
</body>
</html>`}
/>
```

## Reference Files

- See `lib/modules/1-1-html-css.tsx` for a complete English implementation example
- See `IMPLEMENTATION_GUIDE.md` for detailed patterns and templates
- See `README.md` for project documentation

## Quality Checklist

Before submitting any code, verify:
- [ ] All user-facing text is in English
- [ ] All code comments are in English
- [ ] All variable/function names are in English
- [ ] All documentation is in English
- [ ] No Vietnamese text anywhere in the code
- [ ] Mental models are explained in clear English
- [ ] Challenge explanations are detailed and in English

## Getting Help

If you're implementing a new module:
1. Read `IMPLEMENTATION_GUIDE.md` for patterns
2. Study `lib/modules/1-1-html-css.tsx` as the reference implementation
3. Follow the structure: Problem → Solution → Practice → Challenges → Takeaways
4. Always write in English

---

**Remember: ENGLISH ONLY - This is not negotiable.**
