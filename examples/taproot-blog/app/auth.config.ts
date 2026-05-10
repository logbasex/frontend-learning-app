import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin) return !!auth?.user;
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
