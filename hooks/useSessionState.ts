"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

export function useSessionState() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const s = await authClient.getSession();
      setSession(s.data);
    } catch (error) {
      setSession(null);
    }
  }, []);

  useEffect(() => {
    checkSession().finally(() => setLoading(false));

    // Listen for storage changes (when logout/login happens in another tab)
    window.addEventListener("storage", checkSession);

    // Listen for focus changes (refetch when user returns to tab)
    window.addEventListener("focus", checkSession);

    // Setup broadcast channel for same-tab auth changes
    const channel = new BroadcastChannel("auth");
    channel.onmessage = (event) => {
      if (event.data.type === "AUTH_CHANGE") {
        checkSession();
      }
    };

    return () => {
      window.removeEventListener("storage", checkSession);
      window.removeEventListener("focus", checkSession);
      channel.close();
    };
  }, [checkSession]);

  return { session, loading, refetchSession: checkSession };
}
