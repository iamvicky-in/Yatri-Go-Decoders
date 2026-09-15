import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Simple sign-in box shown directly on the admin and vendor portals so people
 * never have to bounce through the traveller login page first.
 */
export function PortalLogin({
  title,
  subtitle,
  blocked,
}: {
  title: string;
  subtitle: string;
  /** Message shown when the person is signed in but lacks the right access. */
  blocked?: string | undefined;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error("Email or password is not correct.");
      return;
    }
    toast.success("Signed in.");
  }

  if (blocked) {
    return (
      <section className="container-page py-20 text-center">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md">{blocked}</p>
        <Button
          variant="outline"
          className="mt-6 rounded-md"
          onClick={() => supabase.auth.signOut()}
        >
          Sign in with a different account
        </Button>
      </section>
    );
  }

  return (
    <section className="container-page grid place-items-center py-16">
      <form onSubmit={submit} className="surface-card w-full max-w-sm space-y-5 p-8">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="portal-email">Email</Label>
          <Input
            id="portal-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portal-password">Password</Label>
          <Input
            id="portal-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md"
          />
        </div>
        <Button type="submit" size="lg" className="w-full rounded-md" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </section>
  );
}
