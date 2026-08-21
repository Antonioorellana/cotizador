import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { initialQuoteLines } from "@/lib/demo-data";
import { calculateLine, calculateQuote, formatClp } from "@/lib/quote";

export const metadata: Metadata = { title: "Vista imprimible" };

export default async function PrintableQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const totals = calculateQuote(initialQuoteLines);

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-4 sm:p-8 print:p-0">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3"><Link href="/cotizaciones" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d9e1ea] bg-white px-4 font-semibold"><ArrowLeft size={17} /> Volver</Link><PrintButton /></div>
      <article className="print-surface min-h-[1120px] rounded-xl border border-[#d9e1ea] bg-white p-7 shadow-sm sm:p-12">
        <header className="flex flex-col justify-between gap-7 border-b-2 border-[#0b2a4a] pb-7 sm:flex-row">
          <div><div className="grid size-14 place-items-center rounded-xl bg-[#0b2a4a] text-base font-extrabold text-white">RC</div><h1 className="mt-4 text-xl font-semibold">Empresa Demo SpA</h1><p className="mt-1 text-sm text-[#667085]">Documento demostrativo · sin validez comercial</p></div>
          <div className="sm:text-right"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#667085]">Cotización</p><p className="mt-2 text-2xl font-semibold text-[#0b2a4a]">{decodeURIComponent(id)}</p><p className="mt-3 text-sm text-[#667085]">Emisión: 21 de agosto de 2026</p><p className="mt-1 text-sm text-[#667085]">Válida hasta: 5 de septiembre de 2026</p></div>
        </header>
        <section className="mt-8 grid gap-5 rounded-lg bg-[#f5f7fa] p-5 sm:grid-cols-2"><div><p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#667085]">Cotizar a</p><p className="mt-2 font-semibold">Cliente Demo A</p><p className="mt-1 text-sm text-[#667085]">Copiapó, Región de Atacama</p></div><div className="sm:text-right"><p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#667085]">Condiciones</p><p className="mt-2 text-sm">Lista de precios: Valor estándar</p><p className="mt-1 text-sm">IVA: 19%</p></div></section>
        <section className="mt-8 overflow-hidden rounded-lg border border-[#d9e1ea]"><table className="w-full border-collapse"><thead className="bg-[#0b2a4a] text-left text-xs font-semibold text-white"><tr><th className="px-4 py-3">Descripción</th><th className="px-4 py-3 text-right">Cant.</th><th className="px-4 py-3 text-right">Precio</th><th className="px-4 py-3 text-right">Total</th></tr></thead><tbody>{initialQuoteLines.map((line) => { const lineTotals = calculateLine(line); return <tr key={line.id} className="border-t border-[#d9e1ea]"><td className="px-4 py-4"><p className="font-medium">{line.description}</p><p className="mt-1 text-xs text-[#667085]">{line.code}</p></td><td className="tabular-nums px-4 py-4 text-right">{line.quantity}</td><td className="tabular-nums px-4 py-4 text-right">{formatClp(line.unitPrice)}</td><td className="tabular-nums px-4 py-4 text-right font-semibold">{formatClp(lineTotals.total)}</td></tr>; })}</tbody></table></section>
        <div className="mt-8 flex justify-end"><dl className="w-full max-w-sm space-y-3"><div className="flex justify-between"><dt className="text-[#667085]">Neto</dt><dd className="tabular-nums font-semibold">{formatClp(totals.net)}</dd></div><div className="flex justify-between"><dt className="text-[#667085]">IVA (19%)</dt><dd className="tabular-nums font-semibold">{formatClp(totals.tax)}</dd></div><div className="flex justify-between border-t-2 border-[#0b2a4a] pt-4 text-xl"><dt className="font-semibold">Total</dt><dd className="tabular-nums font-semibold text-[#0b2a4a]">{formatClp(totals.total)}</dd></div></dl></div>
        <footer className="mt-14 border-t border-[#d9e1ea] pt-6 text-xs leading-5 text-[#667085]"><p>Cotización válida por 15 días. Valores expresados en pesos chilenos.</p><p className="mt-1">Este documento de demostración no contiene datos reales y no constituye una oferta comercial.</p></footer>
      </article>
    </main>
  );
}
