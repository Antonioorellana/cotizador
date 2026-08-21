import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FilePenLine,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { StatusBadge } from "@/components/status-badge";
import { demoQuotes } from "@/lib/demo-data";
import { formatClp } from "@/lib/quote";

export const metadata: Metadata = { title: "Cotizaciones" };

const primaryButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0b2a4a] px-4 text-sm font-semibold text-white transition hover:bg-[#163b61]";

export default function QuotesPage() {
  return (
    <AppShell
      active="quotes"
      breadcrumb="Cotizaciones / Todas"
      headerAction={
        <Link href="/cotizaciones/nueva" className={`${primaryButton} hidden sm:inline-flex`}>
          <Plus size={17} /> Nueva cotización
        </Link>
      }
    >
      <PageHeading
        title="Cotizaciones"
        description="Controla propuestas, vencimientos y ventas sin perder trazabilidad."
        aside={<Link href="/cotizaciones/nueva" className={`${primaryButton} sm:hidden`}><Plus size={17} /> Nueva cotización</Link>}
      />

      <section aria-label="Indicadores de cotizaciones" className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total cotizado" value="$45.280.900" trend="12%" positive icon={<TrendingUp size={18} />} />
        <MetricCard label="Aceptadas" value="$28.150.000" trend="5%" positive icon={<CheckCircle2 size={18} />} />
        <MetricCard label="Por vencer" value="$8.420.500" trend="2%" icon={<Clock3 size={18} />} />
        <MetricCard label="Conversión" value="62,1%" trend="1,5%" positive icon={<ArrowUpRight size={18} />} />
      </section>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="quotes-table-title" className="min-w-0 overflow-hidden rounded-xl border border-[#d9e1ea] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#e9edf2] p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
              <input aria-label="Buscar cotización" placeholder="Buscar por número o cliente" className="h-10 w-full rounded-lg border border-[#d9e1ea] pl-9 pr-3" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <select aria-label="Filtrar por estado" defaultValue="all" className="h-10 rounded-lg border border-[#d9e1ea] bg-white px-3 text-[#344054]">
                <option value="all">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="issued">Emitida</option>
                <option value="accepted">Aceptada</option>
              </select>
              <select aria-label="Filtrar por periodo" defaultValue="30" className="h-10 rounded-lg border border-[#d9e1ea] bg-white px-3 text-[#344054]">
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 90 días</option>
                <option value="year">Este año</option>
              </select>
              <button type="button" className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d9e1ea] bg-white px-3 font-semibold text-[#344054] sm:hidden">
                <SlidersHorizontal size={16} /> Más filtros
              </button>
            </div>
          </div>

          <h2 id="quotes-table-title" className="sr-only">Listado de cotizaciones</h2>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[990px] border-collapse">
              <thead className="bg-[#f5f7fa] text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#667085]">
                <tr>
                  <th className="px-4 py-3">N°</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Emisión</th><th className="px-4 py-3">Vence</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Neto</th><th className="px-4 py-3 text-right">IVA</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3">Responsable</th><th className="w-12 px-2 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {demoQuotes.map((quote) => (
                  <tr key={quote.number} className="border-t border-[#e9edf2] hover:bg-[#f9fafb]">
                    <td className="px-4 py-3.5 font-semibold text-[#0b2a4a]"><Link href={`/cotizaciones/${quote.number}/imprimir`} className="hover:underline">{quote.number}</Link></td>
                    <td className="px-4 py-3.5 font-medium">{quote.client}</td>
                    <td className="px-4 py-3.5 text-[#667085]">{quote.issuedAt}</td>
                    <td className="px-4 py-3.5 text-[#667085]">{quote.validUntil}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={quote.status} /></td>
                    <td className="tabular-nums px-4 py-3.5 text-right">{formatClp(quote.net)}</td>
                    <td className="tabular-nums px-4 py-3.5 text-right text-[#667085]">{formatClp(quote.tax)}</td>
                    <td className="tabular-nums px-4 py-3.5 text-right font-semibold">{formatClp(quote.total)}</td>
                    <td className="px-4 py-3.5 text-[#667085]">{quote.owner}</td>
                    <td className="px-2 py-3.5"><button type="button" aria-label={`Acciones para ${quote.number}`} className="grid size-8 place-items-center rounded-md hover:bg-[#eef2f6]"><MoreHorizontal size={17} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-[#e9edf2] lg:hidden">
            {demoQuotes.map((quote) => (
              <article key={quote.number} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><Link href={`/cotizaciones/${quote.number}/imprimir`} className="font-semibold text-[#0b2a4a]">{quote.number}</Link><p className="mt-1 font-medium">{quote.client}</p></div>
                  <StatusBadge status={quote.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#667085]">
                  <div><dt>Vence</dt><dd className="mt-1 font-medium text-[#344054]">{quote.validUntil}</dd></div>
                  <div className="text-right"><dt>Total</dt><dd className="tabular-nums mt-1 text-base font-semibold text-[#102033]">{formatClp(quote.total)}</dd></div>
                </dl>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#e9edf2] px-4 py-3 text-sm text-[#667085]">
            <span>1–6 de 38</span>
            <div className="flex gap-1"><button type="button" aria-label="Página anterior" className="grid size-9 place-items-center rounded-lg border border-[#d9e1ea]"><ChevronLeft size={16} /></button><button type="button" aria-label="Página siguiente" className="grid size-9 place-items-center rounded-lg border border-[#d9e1ea]"><ChevronRight size={16} /></button></div>
          </div>
        </section>

        <aside className="rounded-xl border border-[#d9e1ea] bg-white p-5">
          <div className="flex items-center justify-between"><h2 className="text-base font-semibold">Actividad reciente</h2><Link href="#" className="text-xs font-semibold text-[#0b2a4a]">Ver todo</Link></div>
          <ol className="mt-5 space-y-5">
            <Activity icon={<FilePenLine size={15} />} title="Cotización emitida" detail="COT-2026-0018 · Usuario Demo" time="Hace 18 min" />
            <Activity icon={<CheckCircle2 size={15} />} title="Cotización aceptada" detail="COT-2026-0017 · Cliente Demo B" time="Hoy, 09:12" success />
            <Activity icon={<FilePenLine size={15} />} title="Borrador actualizado" detail="COT-2026-0016 · Usuario Demo" time="Ayer, 17:42" />
          </ol>
          <Link href="/cotizaciones/nueva" className="mt-6 flex min-h-11 items-center justify-between rounded-lg bg-[#f5f7fa] px-4 font-semibold text-[#0b2a4a] hover:bg-[#eaf0f6]">Crear una cotización <ArrowRight size={17} /></Link>
        </aside>
      </div>
    </AppShell>
  );
}

function MetricCard({ label, value, trend, positive = false, icon }: { label: string; value: string; trend: string; positive?: boolean; icon: React.ReactNode }) {
  return (
    <article className="rounded-xl border border-[#d9e1ea] bg-white p-5">
      <div className="flex items-center justify-between"><p className="text-sm font-medium text-[#667085]">{label}</p><span className="grid size-9 place-items-center rounded-lg bg-[#eef3f8] text-[#0b2a4a]">{icon}</span></div>
      <p className="tabular-nums mt-4 text-[24px] font-semibold tracking-[-0.025em]">{value}</p>
      <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${positive ? "text-[#18794e]" : "text-[#b54708]"}`}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{trend} <span className="font-normal text-[#667085]">vs. mes anterior</span></p>
    </article>
  );
}

function Activity({ icon, title, detail, time, success = false }: { icon: React.ReactNode; title: string; detail: string; time: string; success?: boolean }) {
  return (
    <li className="flex gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-full ${success ? "bg-emerald-50 text-[#18794e]" : "bg-blue-50 text-[#175cd3]"}`}>{icon}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs text-[#667085]">{detail}</p><time className="mt-1.5 block text-[11px] text-[#98a2b3]">{time}</time></div></li>
  );
}
