import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

/**
 * Returns the current user's roles from public.user_roles.
 * RLS restricts each user to reading only their own rows, so this
 * cannot be spoofed client-side — a non-admin cannot see or claim 'admin'.
 */
export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to settle before deciding on roles — otherwise the
    // first pass sees user=null, sets loading=false with roles=[], and any
    // downstream `if (!loading && !isAdmin)` redirect fires by mistake.
    if (authLoading) return;
    let cancelled = false;
    async function load() {
      if (!user) { setRoles([]); setLoading(false); return; }
      setLoading(true);
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (cancelled) return;
      setRoles(error || !data ? [] : data.map((r) => r.role));
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [user?.id, authLoading]);


  return {
    roles,
    isAdmin: roles.includes("admin"),
    isUser: roles.includes("user"),
    loading: authLoading || loading,
  };
}
