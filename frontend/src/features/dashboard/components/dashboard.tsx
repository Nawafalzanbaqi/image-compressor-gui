"use client";

import * as React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Client dashboard (gated by features.clientDashboard). Uses NextAuth's
 * credentials provider. When signed out, shows a sign-in form; NextAuth handles
 * CSRF for the credentials flow.
 */
export function Dashboard() {
  const t = useTranslations("nav");
  const { data: session, status } = useSession();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  if (status === "loading") {
    return <p className="text-muted-foreground">…</p>;
  }

  if (!session) {
    return (
      <Card className="mx-auto max-w-sm p-6">
        <h1 className="text-xl font-semibold">{t("dashboard")}</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            const res = await signIn("credentials", {
              email,
              password,
              redirect: false,
            });
            if (res?.error) setError("Invalid credentials");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
          <p className="text-xs text-muted-foreground">
            Demo: demo@example.com / demo1234
          </p>
        </form>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold">{t("dashboard")}</h1>
      <p className="mt-2 text-muted-foreground">
        {session.user?.email ?? session.user?.name}
      </p>
      <Button variant="outline" className="mt-6" onClick={() => signOut()}>
        Sign out
      </Button>
    </Card>
  );
}
