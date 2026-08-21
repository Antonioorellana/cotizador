import type { Metadata } from "next";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { demoProducts } from "@/lib/demo-data";
import { formatClp } from "@/lib/quote";

export const metadata: Metadata = { title: "Productos" };

export default function ProductsPage() {
  return (
    <AppShell active="products" breadcrumb="Productos / Catálogo" headerAction={<button type="button" className="hidden min-h-10 items-center gap-2 rounded-lg bg-[#0b2a4a] px-4 font-semibold text-white sm:inline-flex"><Plus size={17} /> Nuevo producto</button>}>
      <PageHeading title="Productos y servicios" description="Administra precios estándar y de oferta. Las cotizaciones emitidas conservan su propio snapshot." />
      <section className="overflow-hidden rounded-xl border border-[#d9e1ea] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e9edf2] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" /><input aria-label="Buscar producto" placeholder="Buscar por código o descripción" className="h-10 w-full rounded-lg border border-[#d9e1ea] pl-9 pr-3" /></div><button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0b2a4a] px-4 font-semibold text-white sm:hidden"><Plus size={17} /> Nuevo producto</button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] border-collapse"><thead className="bg-[#f5f7fa] text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#667085]"><tr><th className="px-5 py-3">Código</th><th className="px-5 py-3">Descripción</th><th className="px-5 py-3 text-right">Valor estándar</th><th className="px-5 py-3 text-right">Oferta</th><th className="px-5 py-3">Estado</th><th className="w-12"><span className="sr-only">Acciones</span></th></tr></thead><tbody>{demoProducts.map((product) => <tr key={product.code} className="border-t border-[#e9edf2] hover:bg-[#f9fafb]"><td className="px-5 py-4 font-semibold text-[#0b2a4a]">{product.code}</td><td className="px-5 py-4 font-medium">{product.description}</td><td className="tabular-nums px-5 py-4 text-right">{formatClp(product.standard)}</td><td className="tabular-nums px-5 py-4 text-right">{product.offer ? formatClp(product.offer) : "—"}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${product.active ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-slate-100 text-slate-700 ring-slate-200"}`}>{product.active ? "Activo" : "Inactivo"}</span></td><td><button type="button" aria-label={`Acciones para ${product.code}`} className="grid size-9 place-items-center rounded-lg hover:bg-[#eef2f6]"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>
      </section>
    </AppShell>
  );
}
