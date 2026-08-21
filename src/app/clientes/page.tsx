import type { Metadata } from "next";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { demoClients } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Clientes" };

export default function ClientsPage() {
  return (
    <AppShell active="clients" breadcrumb="Clientes / Todos" headerAction={<button type="button" className="hidden min-h-10 items-center gap-2 rounded-lg bg-[#0b2a4a] px-4 font-semibold text-white sm:inline-flex"><Plus size={17} /> Nuevo cliente</button>}>
      <PageHeading title="Clientes" description="Mantén solo los datos necesarios para cotizar y conserva trazabilidad de sus modificaciones." />
      <section className="overflow-hidden rounded-xl border border-[#d9e1ea] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e9edf2] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" /><input aria-label="Buscar cliente" placeholder="Buscar por nombre, ciudad o correo" className="h-10 w-full rounded-lg border border-[#d9e1ea] pl-9 pr-3" /></div>
          <button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0b2a4a] px-4 font-semibold text-white sm:hidden"><Plus size={17} /> Nuevo cliente</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead className="bg-[#f5f7fa] text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#667085]"><tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Razón social / nombre</th><th className="px-5 py-3">Ciudad</th><th className="px-5 py-3">Correo</th><th className="px-5 py-3">Teléfono</th><th className="px-5 py-3 text-right">Cotizaciones</th><th className="w-12"><span className="sr-only">Acciones</span></th></tr></thead>
            <tbody>{demoClients.map((client) => <tr key={client.id} className="border-t border-[#e9edf2] hover:bg-[#f9fafb]"><td className="px-5 py-4 font-semibold text-[#0b2a4a]">{client.id}</td><td className="px-5 py-4 font-medium">{client.name}</td><td className="px-5 py-4 text-[#667085]">{client.city}</td><td className="px-5 py-4 text-[#667085]">{client.email}</td><td className="tabular-nums px-5 py-4 text-[#667085]">{client.phone}</td><td className="tabular-nums px-5 py-4 text-right font-semibold">{client.quotes}</td><td><button type="button" aria-label={`Acciones para ${client.name}`} className="grid size-9 place-items-center rounded-lg hover:bg-[#eef2f6]"><MoreHorizontal size={17} /></button></td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <p className="mt-4 text-xs leading-5 text-[#667085]">Privacidad: nombre, correo y teléfono tienen finalidad comercial. La aplicación productiva incluirá exportación, rectificación y supresión con excepciones de conservación legal.</p>
    </AppShell>
  );
}
