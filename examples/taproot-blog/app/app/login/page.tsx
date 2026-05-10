import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/admin",
          });
        }}
        className="grid gap-3"
      >
        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input name="email" type="email" required className="border border-[var(--border)] rounded p-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Password</span>
          <input name="password" type="password" required className="border border-[var(--border)] rounded p-2" />
        </label>
        <button type="submit" className="bg-[var(--accent)] text-white p-2 rounded">Sign in</button>
        <p className="text-xs text-[var(--muted)] mt-2">Seeded accounts: alice@taproot.local / bob@taproot.local — password <code>taproot-dev</code>.</p>
      </form>
    </main>
  );
}
