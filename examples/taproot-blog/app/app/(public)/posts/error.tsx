"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Something went wrong loading this post.</p>
      <button onClick={() => reset()} className="underline">Try again</button>
    </div>
  );
}
