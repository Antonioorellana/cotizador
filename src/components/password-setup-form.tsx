"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MINIMUM_PASSWORD_LENGTH = 12;

/** Allows an invited user to choose their password without exposing it to an administrator. */
export function PasswordSetupForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MINIMUM_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    if (!supabase) {
      setError("La autenticación todavía no está configurada.");
      setPending(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("No fue posible guardar la contraseña. Solicita una nueva invitación.");
      setPending(false);
      return;
    }

    router.replace("/cotizaciones");
    router.refresh();
  };

  return (
    <form onSubmit={updatePassword} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-[#344054]">
          Nueva contraseña
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={MINIMUM_PASSWORD_LENGTH}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-lg border border-[#d9e1ea] px-3"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-[#344054]">
          Repetir contraseña
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={MINIMUM_PASSWORD_LENGTH}
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          className="h-11 w-full rounded-lg border border-[#d9e1ea] px-3"
        />
      </label>
      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-lg bg-[#0b2a4a] px-4 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar contraseña"}
      </button>
    </form>
  );
}
