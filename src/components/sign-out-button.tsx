"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Ends the Supabase session and removes access to protected routes. */
export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const signOut = async () => {
    setPending(true);
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.replace("/acceso");
    router.refresh();
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={signOut}
      className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-white/10 disabled:opacity-60"
    >
      <span className="grid size-9 place-items-center rounded-full bg-white/15 text-xs font-bold">UA</span>
      <span className="min-w-0 flex-1">
        <strong className="block truncate text-sm">Usuario autorizado</strong>
        <span className="block text-xs text-white/50">Cuenta protegida</span>
      </span>
      <LogOut aria-label="Salir" size={17} className="text-white/55" />
    </button>
  );
}
