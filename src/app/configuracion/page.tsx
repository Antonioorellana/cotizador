import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Configuración" };

export default function SettingsPage() {
  return (
    <AppShell active="settings" breadcrumb="Configuración / Organización">
      <PageHeading title="Configuración" description="Parámetros comerciales, seguridad y privacidad de la organización." />
      <div className="grid gap-5 xl:grid-cols-2">
        <SettingsCard title="Reglas de cotización" description="Parámetros por defecto para nuevos documentos."><Setting label="IVA" value="19%" /><Setting label="Vigencia predeterminada" value="15 días" /><Setting label="Moneda" value="CLP · sin decimales" /><Setting label="Edición después de emitir" value="Bloqueada" /></SettingsCard>
        <SettingsCard title="Privacidad y conservación" description="Controles previstos para el entorno productivo."><Setting label="Acceso" value="Por organización y rol" /><Setting label="Registro de auditoría" value="Activado" /><Setting label="Exportación ARCO+" value="JSON / CSV" /><Setting label="Retención de clientes inactivos" value="Por definir con base legal" attention /></SettingsCard>
      </div>
    </AppShell>
  );
}

function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="rounded-xl border border-[#d9e1ea] bg-white p-5 sm:p-6"><h2 className="text-base font-semibold">{title}</h2><p className="mt-1 text-sm text-[#667085]">{description}</p><dl className="mt-5 divide-y divide-[#e9edf2]">{children}</dl></section>; }
function Setting({ label, value, attention = false }: { label: string; value: string; attention?: boolean }) { return <div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-[#667085]">{label}</dt><dd className={`text-right text-sm font-semibold ${attention ? "text-amber-700" : "text-[#344054]"}`}>{value}</dd></div>; }
