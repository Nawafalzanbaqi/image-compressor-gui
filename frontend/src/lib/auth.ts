import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

/**
 * Auth.js / NextAuth v5, self-hosted, JWT session strategy (no DB adapter, no
 * paid tiers). Credentials provider validates against the backend in prod; a
 * demo account is accepted so the flow works offline.
 *
 * CSRF: NextAuth issues + validates a CSRF token automatically for the
 * credentials sign-in POST — no extra handling needed. AUTH_SECRET signs the
 * JWT; AUTH_TRUST_HOST allows self-hosted deploys behind a proxy.
 *
 * TODO(phase-2): replace the demo check with a real POST to the backend auth
 * endpoint and map returned roles/claims into the token.
 */
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Offline demo credentials (replace with backend verification).
        if (email === "demo@example.com" && password === "demo1234") {
          return { id: "demo-user", email, name: "Demo User" };
        }
        return null;
      },
    }),
  ],
  pages: {
    // Sign-in is rendered inside the dashboard feature.
    signIn: "/dashboard",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.uid && session.user) {
        (session.user as { id?: string }).id = token.uid as string;
      }
      return session;
    },
  },
});
