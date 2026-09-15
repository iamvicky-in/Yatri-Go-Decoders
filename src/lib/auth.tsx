import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
};

/** The dashboard each account type should see after signing in. */
export function dashboardForRole(isAdmin: boolean, isVendor: boolean) {
  if (isAdmin) return "/admin" as const;
  if (isVendor) return "/vendor-dashboard" as const;
  return "/dashboard" as const;
}

/** Live Supabase session + admin/vendor roles for the signed-in user. */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const uid = session?.user.id;
    if (!uid) {
      setIsAdmin(false);
      setIsVendor(false);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    void Promise.resolve(
      supabase.from("user_roles").select("role").eq("user_id", uid).in("role", ["admin", "vendor"]),
    )
      .then(({ data, error }) => {
        if (!active) return;
        const roles = new Set(data?.map((r) => r.role) ?? []);
        setIsAdmin(roles.has("admin"));
        setIsVendor(roles.has("vendor"));
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setIsAdmin(false);
        setIsVendor(false);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [session?.user.id]);

  return { session, user: session?.user ?? null, loading, isAdmin, isVendor };
}

export async function signOut() {
  await supabase.auth.signOut();
}
