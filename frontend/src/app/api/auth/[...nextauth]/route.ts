import { handlers } from "@/lib/auth";

// Auth.js v5 App Router handler. NextAuth manages CSRF, callbacks, and the
// JWT session cookie.
export const { GET, POST } = handlers;
