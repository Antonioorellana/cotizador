"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Converts Supabase invitation credentials from the URL into the cookie-backed
 * session used by the Next.js proxy, then sends the user to choose a password.
 */
export function InvitationSessionHandler() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const completeInvitation = async () => {
      const supabase = createClient();
      if (!supabase) return;

      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const authorizationCode = url.searchParams.get("code");

      let sessionEstablished = false;

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        sessionEstablished = !sessionError;
      } else if (authorizationCode) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          authorizationCode,
        );
        sessionEstablished = !exchangeError;
      } else {
        const { data } = await supabase.auth.getSession();
        sessionEstablished = Boolean(data.session);
      }

      if (!active) return;

      if (!sessionEstablished) {
        if (accessToken || authorizationCode) {
          setError("La invitación no es válida o ya venció. Solicita una nueva invitación.");
        }
        return;
      }
      window.history.replaceState({}, document.title, "/acceso");
      router.replace("/establecer-clave");
      router.refresh();
    };

    void completeInvitation();
    return () => {
      active = false;
    };
  }, [router]);

  return error ? (
    <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800">
      {error}
    </p>
  ) : null;
}
