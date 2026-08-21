import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = { title: "Acceso" };

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f7fa] p-4">
      <section className="w-full max-w-md rounded-2xl border border-[#d9e1ea] bg-white p-7 shadow-[0_12px_36px_rgba(16,32,51,0.08)] sm:p-9">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[#0b2a4a] font-extrabold text-white">RC</span><div><h1 className="text-lg font-semibold">Rivera Cotizador</h1><p className="text-xs text-[#667085]">Acceso seguro por organización</p></div></div>
        <h2 className="mt-8 text-2xl font-semibold tracking-[-0.02em]">Inicia sesión</h2>
        <p className="mt-2 text-sm leading-6 text-[#667085]">Usa la cuenta autorizada por tu organización. El acceso a clientes y cotizaciones se controla con RLS.</p>
        <Suspense fallback={<div className="mt-6 h-48 animate-pulse rounded-lg bg-[#f5f7fa]" />}>
          <SignInForm />
        </Suspense>
        <div className="mt-6 flex gap-3 rounded-lg bg-[#f5f7fa] p-4 text-xs leading-5 text-[#475467]"><ShieldCheck size={18} className="shrink-0 text-[#18794e]" /><p>No compartas credenciales. Cada acción productiva se asociará al usuario autenticado.</p></div>
      </section>
    </main>
  );
}
