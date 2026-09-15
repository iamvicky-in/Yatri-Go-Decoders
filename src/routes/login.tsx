import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { dashboardForRole, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up — YATRI GO" },
      {
        name: "description",
        content:
          "Sign in to YATRI GO to save trips, manage bookings and track your travel budget, or create a traveller account.",
      },
      { property: "og:title", content: "Login or Sign Up — YATRI GO" },
      { property: "og:description", content: "Save trips, bookings and budgets to your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, loading, isAdmin, isVendor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    void navigate({ to: dashboardForRole(isAdmin, isVendor), replace: true });
  }, [loading, user, isAdmin, isVendor, navigate]);

  function redirectForRole() {
    return navigate({ to: dashboardForRole(isAdmin, isVendor), replace: true });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to YATRI GO.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
      await redirectForRole();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Try email and password.");
      return;
    }
    if (result.redirected) return;
    await redirectForRole();
  }

  return (
    <section className="container-page grid place-items-center py-16">
      <div className="surface-card w-full max-w-md space-y-6 p-8">
        <div className="bg-secondary grid grid-cols-2 gap-1 rounded-md p-1.5">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md py-2 text-sm font-semibold transition-colors ${
                mode === m ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {mode === "login"
              ? "Pick up your saved trips and bookings."
              : "Plan trips, save places and manage bookings."}
          </p>
        </div>

        <Button variant="outline" className="w-full rounded-md" onClick={google} type="button">
          Continue with Google
        </Button>

        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-4" onSubmit={submit}>
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vicky Sharma"
                className="rounded-md"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md"
            />
          </div>
          <Button type="submit" className="w-full rounded-md" size="lg" disabled={busy}>
            {busy ? "Please wait…" : mode === "login" ? "Login" : "Create account"}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-xs">
          New here? Create an account, then{" "}
          <Link to="/plan" className="text-accent font-semibold">
            plan a trip
          </Link>{" "}
          and your bookings will be saved to your profile.
        </p>
      </div>
    </section>
  );
}
