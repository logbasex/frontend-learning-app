"use client";
import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

export function Module_2_2_Content() {
  return (
    <ScaffoldModule
      emoji="📝"
      problemTitle="The browser ships a free validator — most apps reinvent it badly"
      problem={
        <>
          <p>
            Validating user input before sending it to a server is one of the
            most repeated tasks in front-end development, yet most teams reach
            for a JavaScript library on day one and skip the validation
            primitives that every modern browser already ships for free. The
            result is thousands of lines of custom validation logic, inconsistent
            error messages, and accessibility bugs that the platform would have
            solved automatically.
          </p>
          <p>
            HTML5 introduced a <strong>Constraint Validation API</strong> backed
            by built-in attributes. <code>required</code> blocks submission when
            an input is empty. <code>type=&quot;email&quot;</code> rejects
            strings without an <code>@</code> and a domain. <code>pattern</code>{" "}
            accepts a regular expression the value must fully match.{" "}
            <code>minlength</code> and <code>maxlength</code> constrain text
            length; <code>min</code> and <code>max</code> constrain numeric or
            date ranges. The browser validates all of these before the{" "}
            <code>submit</code> event fires, surfacing errors with native UI
            that is localised and accessible out of the box.
          </p>
          <p>
            Every input has a live <code>validity</code> object with boolean
            flags like <code>valueMissing</code>, <code>typeMismatch</code>, and{" "}
            <code>patternMismatch</code>. You can read these in JavaScript to
            style error states or build custom messages while still delegating
            the underlying checks to the browser. Call{" "}
            <code>input.setCustomValidity(&quot;message&quot;)</code> to inject
            your own message into the native constraint system without
            re-implementing the whole pipeline.
          </p>
          <p>
            Accessibility matters here too. Every <code>&lt;input&gt;</code>{" "}
            must be paired with a <code>&lt;label&gt;</code> &mdash; either by
            wrapping the input inside the label element, or by pointing a
            standalone label at the input with a matching <code>htmlFor</code> /
            <code>for</code> attribute. Without this pairing, screen readers
            announce the input as unlabelled and assistive technology users
            cannot tell what they are filling in. Descriptive{" "}
            <code>aria-describedby</code> attributes link an input to an error
            message element so screen readers announce the error automatically
            when the field receives focus.
          </p>
          <p>
            The interactive example below demonstrates a small form with an
            email field and a numeric quantity field. Click the button to inspect
            the browser&apos;s built-in <code>validity</code> state in real time.
          </p>
        </>
      }
      body={
        <HTMLPlayground
          title="Native form validation"
          description="Try submitting empty or invalid values to see browser constraints in action."
          html={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <form id="order-form" novalidate>
    <h2>Place an order</h2>

    <div class="field">
      <label for="email">Email address *</label>
      <input
        id="email"
        type="email"
        name="email"
        required
        placeholder="you@example.com"
      />
      <span class="hint" id="email-hint"></span>
    </div>

    <div class="field">
      <label for="qty">Quantity (1–100) *</label>
      <input
        id="qty"
        type="number"
        name="qty"
        required
        min="1"
        max="100"
        placeholder="e.g. 5"
      />
      <span class="hint" id="qty-hint"></span>
    </div>

    <button type="submit">Submit order</button>
    <p id="success" style="display:none;color:#16a34a;font-weight:bold">
      ✓ Order submitted!
    </p>
  </form>

  <section id="validity-display">
    <h3>Live validity state</h3>
    <pre id="validity-out">Click an input or submit to see state…</pre>
  </section>

  <script src="/script.js"></script>
</body>
</html>`}
          css={`* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 24px; color: #111827; background: #f9fafb; }
h2 { font-size: 1.25rem; margin-bottom: 16px; }
h3 { font-size: 1rem; color: #374151; margin-bottom: 8px; }
.field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
label { font-size: 0.875rem; font-weight: 600; color: #374151; }
input { padding: 8px 12px; border: 2px solid #d1d5db; border-radius: 6px;
        font-size: 1rem; width: 100%; max-width: 320px; }
input:focus { outline: none; border-color: #3b82f6; }
input:invalid.touched { border-color: #ef4444; }
input:valid.touched { border-color: #16a34a; }
.hint { font-size: 0.75rem; color: #ef4444; min-height: 1rem; }
button { padding: 10px 24px; background: #2563eb; color: white;
         border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; }
button:hover { background: #1d4ed8; }
#validity-display { margin-top: 24px; }
#validity-out { background: #1e293b; color: #7dd3fc; padding: 14px;
                border-radius: 8px; font-size: 0.8rem; white-space: pre-wrap; }`}
          js={`function showValidity(input, hintId) {
  const v = input.validity;
  const hint = document.getElementById(hintId);
  const out = document.getElementById('validity-out');

  const state = {
    value: input.value,
    valid: v.valid,
    valueMissing: v.valueMissing,
    typeMismatch: v.typeMismatch,
    rangeUnderflow: v.rangeUnderflow,
    rangeOverflow: v.rangeOverflow,
    patternMismatch: v.patternMismatch,
  };
  out.textContent = JSON.stringify(state, null, 2);

  input.classList.add('touched');
  if (!v.valid) {
    hint.textContent = input.validationMessage;
  } else {
    hint.textContent = '✓ looks good';
    hint.style.color = '#16a34a';
  }
}

document.getElementById('email').addEventListener('blur', function() {
  showValidity(this, 'email-hint');
});

document.getElementById('qty').addEventListener('blur', function() {
  showValidity(this, 'qty-hint');
});

document.getElementById('order-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email');
  const qty = document.getElementById('qty');
  email.classList.add('touched');
  qty.classList.add('touched');
  showValidity(email, 'email-hint');
  showValidity(qty, 'qty-hint');
  if (this.checkValidity()) {
    document.getElementById('success').style.display = 'block';
  }
});`}
        />
      }
      challenge={{
        question: "Which attribute makes a browser reject an email input that contains no '@' symbol before the form submits?",
        options: [
          { id: "a", text: "required" },
          { id: "b", text: "pattern=\".*@.*\"" },
          { id: "c", text: "type=\"email\"" },
          { id: "d", text: "minlength=\"5\"" },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            Setting <code>type=&quot;email&quot;</code> activates the browser&apos;s
            built-in email format validation, which checks for a local part, an{" "}
            <code>@</code> symbol, and a domain segment. <code>required</code>{" "}
            only checks that the field is non-empty; it does not validate the
            format. A custom <code>pattern</code> would work but is redundant
            since <code>type=&quot;email&quot;</code> already handles this more
            thoroughly.
          </>
        ),
      }}
      takeaways={[
        <>Use built-in attributes (required, type, min, max, pattern, minlength) to get free, accessible browser validation before writing any JavaScript.</>,
        <>Always pair every input with a label using htmlFor / for, or by wrapping &mdash; unlabelled inputs are invisible to screen readers.</>,
        <>Read the input.validity object in JS for fine-grained error messages without re-implementing the validation logic yourself.</>,
      ]}
      mentalModel="The browser&apos;s constraint validator is a free co-pilot &mdash; use it first, then layer JavaScript only for the edge cases it can&apos;t handle."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
