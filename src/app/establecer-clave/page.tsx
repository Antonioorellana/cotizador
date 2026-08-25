import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import { PasswordSetupForm } from "@/components/password-setup-form";

export const metadata: Metadata = { title: "Establecer contraseña" };

export default function PasswordSetupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f7fa] p-4">
      <section className="w-full max-w-md rounded-2xl border border-[#d9e1ea] bg-white p-7 shadow-[0_12px_36px_rgba(16,32,51,0.08)] sm:p-9">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[#0b2a4a] text-white">
            <KeyRound size={20} />
          </span>
          <div>
            <h1 className="text-lg font-semibold">Protege tu cuenta</h1>
            <p className="text-xs text-[#667085]">Rivera Cotizador</p>
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-semibold tracking-[-0.02em]">
          Crea tu contraseña
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Usa al menos 12 caracteres. La contraseña se envía directamente a Supabase y no es visible para el administrador.
        </p>
        <PasswordSetupForm />
      </section>
    </main>
  );
}
