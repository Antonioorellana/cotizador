"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPending(true);
    const supabase = createClient();

    if (!supabase) {
      setError("Supabase aún no está configurado. La vista demostrativa sigue disponible sin autenticación.");
      setPending(false);
      return;
    }

    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      setError("No fue posible iniciar sesión. Revisa las credenciales e inténtalo nuevamente.");
      setPending(false);
      return;
    }

    const destination = searchParams.get("next");
    router.replace(destination?.startsWith("/") ? destination : "/cotizaciones");
    router.refresh();
  };

  return (
    <form onSubmit={signIn} className="mt-6 space-y-4">
      <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#344054]">Correo</span><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 w-full rounded-lg border border-[#d9e1ea] px-3" /></label>
      <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#344054]">Contraseña</span><input type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full rounded-lg border border-[#d9e1ea] px-3" /></label>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800">{error}</p>}
      <button type="submit" disabled={pending} className="min-h-11 w-full rounded-lg bg-[#0b2a4a] px-4 font-semibold text-white disabled:opacity-60">{pending ? "Ingresando..." : "Ingresar"}</button>
    </form>
  );
}
