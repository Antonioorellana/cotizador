"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Eye,
  FileCheck2,
  Plus,
  Printer,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { initialQuoteLines } from "@/lib/demo-data";
import {
  calculateLine,
  calculateQuote,
  formatClp,
  priceForMode,
  type PriceMode,
  type QuoteLineInput,
} from "@/lib/quote";

const inputClass = "h-10 w-full rounded-lg border border-[#d9e1ea] bg-white px-3 text-sm text-[#102033] disabled:cursor-not-allowed disabled:bg-[#f5f7fa] disabled:text-[#667085]";
const secondaryButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d9e1ea] bg-white px-3.5 text-sm font-semibold text-[#344054] transition hover:bg-[#f5f7fa] disabled:cursor-not-allowed disabled:opacity-50";
const primaryButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0b2a4a] px-4 text-sm font-semibold text-white transition hover:bg-[#163b61] disabled:cursor-not-allowed disabled:opacity-50";

/** Interactive quote editor that preserves integer CLP and line-level IVA rules. */
export function QuoteEditor() {
  const [lines, setLines] = useState<QuoteLineInput[]>(initialQuoteLines);
  const [priceMode, setPriceMode] = useState<PriceMode>("standard");
  const [issued, setIssued] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState("Los cambios aún no se han guardado.");
  const totals = useMemo(() => calculateQuote(lines), [lines]);

  const updateLine = <Key extends keyof QuoteLineInput>(
    id: string,
    key: Key,
    value: QuoteLineInput[Key],
  ) => {
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, [key]: value } : line)),
    );
    setNotice("Cambios pendientes de guardar.");
  };

  const changePriceMode = (mode: PriceMode) => {
    setPriceMode(mode);
    setLines((current) => current.map((line) => ({ ...line, unitPrice: priceForMode(line, mode) })));
    setNotice("La lista de precios fue actualizada.");
  };

  const addLine = () => {
    setLines((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        code: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        standardPrice: 0,
        offerPrice: 0,
      },
    ]);
    setNotice("Nueva línea agregada.");
  };

  const saveDraft = () => {
    try {
      const draft = { number: "COT-2026-0019", priceMode, lines, savedAt: new Date().toISOString() };
      localStorage.setItem("rivera-cotizador:demo-draft:v1", JSON.stringify(draft));
      setNotice("Borrador guardado en este navegador.");
    } catch {
      setNotice("El navegador bloqueó el almacenamiento local del borrador.");
    }
  };

  const issueQuote = () => {
    try {
      const snapshot = { number: "COT-2026-0019", priceMode, lines, issuedAt: new Date().toISOString() };
      localStorage.setItem("rivera-cotizador:demo-issued:v1", JSON.stringify(snapshot));
    } catch {
      // The UI can still freeze the demo even if private browsing blocks storage.
    }
    setIssued(true);
    setConfirming(false);
    setNotice("Cotización demostrativa emitida. Sus valores quedaron congelados.");
  };

  return (
    <AppShell
      active="quotes"
      breadcrumb="Cotizaciones / Nueva"
      headerAction={
        <button type="button" className={`${primaryButton} hidden sm:inline-flex`} disabled={issued || lines.length === 0} onClick={() => setConfirming(true)}>
          <FileCheck2 size={17} /> Emitir cotización
        </button>
      }
    >
      <PageHeading
        title="Nueva cotización"
        description="Completa los antecedentes y revisa el cierre antes de emitir."
        aside={<span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${issued ? "bg-blue-50 text-blue-700 ring-blue-200" : "bg-slate-100 text-slate-700 ring-slate-200"}`}>{issued ? "Emitida" : "Borrador"}</span>}
      />

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#d9e1ea] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-[#667085]">
          {notice.includes("guardado") || issued ? <Check size={16} className="text-[#18794e]" /> : <span className="size-2 rounded-full bg-amber-500" />}
          <span aria-live="polite">{notice}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={saveDraft} disabled={issued} className={secondaryButton}><Save size={16} /> Guardar borrador</button>
          <Link href="/cotizaciones/COT-2026-0019/imprimir" className={secondaryButton}><Eye size={16} /> Vista previa</Link>
          <button type="button" onClick={() => setConfirming(true)} disabled={issued || lines.length === 0} className={`${primaryButton} sm:hidden`}><FileCheck2 size={16} /> Emitir</button>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <section aria-labelledby="general-title" className="rounded-xl border border-[#d9e1ea] bg-white p-5 sm:p-6">
            <h2 id="general-title" className="text-base font-semibold">Datos generales</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Field label="Número"><input value="COT-2026-0019" readOnly className={inputClass} /></Field>
              <Field label="Fecha de emisión"><input type="date" defaultValue="2026-08-21" disabled={issued} className={inputClass} /></Field>
              <Field label="Válida hasta"><input type="date" defaultValue="2026-09-05" disabled={issued} className={inputClass} /></Field>
              <Field label="Cliente" className="sm:col-span-2">
                <div className="flex gap-2"><select defaultValue="demo-a" disabled={issued} className={inputClass}><option value="demo-a">Cliente Demo A</option><option value="demo-b">Cliente Demo B</option><option value="demo-c">Cliente Demo C</option></select><button type="button" disabled={issued} className={`${secondaryButton} shrink-0`}><Plus size={15} /> <span className="hidden sm:inline">Nuevo cliente</span></button></div>
              </Field>
              <Field label="Lista de precios">
                <select value={priceMode} disabled={issued} onChange={(event) => changePriceMode(event.target.value as PriceMode)} className={inputClass}><option value="standard">Valor estándar</option><option value="offer">Oferta</option></select>
              </Field>
            </div>
            <p className="mt-4 text-xs text-[#667085]">IVA aplicado: <strong className="text-[#344054]">19%</strong>. El impuesto se redondea por línea.</p>
          </section>

          <section aria-labelledby="items-title" className="overflow-hidden rounded-xl border border-[#d9e1ea] bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-[#e9edf2] p-5 sm:px-6">
              <div><h2 id="items-title" className="text-base font-semibold">Productos y servicios</h2><p className="mt-1 text-xs text-[#667085]">Los valores del catálogo se copian como snapshot.</p></div>
              <button type="button" onClick={addLine} disabled={issued} className={secondaryButton}><Plus size={16} /> Agregar línea</button>
            </div>

            <div className="hidden overflow-x-auto 2xl:block">
              <table className="w-full min-w-[950px] border-collapse">
                <thead className="bg-[#f5f7fa] text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#667085]"><tr><th className="px-4 py-3">Código</th><th className="px-4 py-3">Descripción</th><th className="px-4 py-3 text-right">Cantidad</th><th className="px-4 py-3 text-right">Precio unit.</th><th className="px-4 py-3 text-right">Neto</th><th className="px-4 py-3 text-right">IVA</th><th className="px-4 py-3 text-right">Total</th><th className="w-12"><span className="sr-only">Eliminar</span></th></tr></thead>
                <tbody>
                  {lines.map((line) => {
                    const lineTotals = calculateLine(line);
                    return (
                      <tr key={line.id} className="border-t border-[#e9edf2] align-top">
                        <td className="p-3"><input aria-label="Código" value={line.code} disabled={issued} onChange={(event) => updateLine(line.id, "code", event.target.value)} className={`${inputClass} min-w-28`} /></td>
                        <td className="p-3"><input aria-label="Descripción" value={line.description} disabled={issued} onChange={(event) => updateLine(line.id, "description", event.target.value)} className={`${inputClass} min-w-64`} /></td>
                        <td className="p-3"><input aria-label="Cantidad" type="number" min="1" step="1" value={line.quantity} disabled={issued} onChange={(event) => updateLine(line.id, "quantity", Math.max(1, Number(event.target.value)))} className={`${inputClass} min-w-20 text-right tabular-nums`} /></td>
                        <td className="p-3"><input aria-label="Precio unitario" type="number" min="0" step="1" value={line.unitPrice} disabled={issued} onChange={(event) => updateLine(line.id, "unitPrice", Math.max(0, Math.round(Number(event.target.value))))} className={`${inputClass} min-w-32 text-right tabular-nums`} /></td>
                        <td className="tabular-nums px-4 py-5 text-right">{formatClp(lineTotals.net)}</td><td className="tabular-nums px-4 py-5 text-right text-[#667085]">{formatClp(lineTotals.tax)}</td><td className="tabular-nums px-4 py-5 text-right font-semibold">{formatClp(lineTotals.total)}</td>
                        <td className="px-2 py-4"><button type="button" aria-label={`Eliminar línea ${line.code || "sin código"}`} disabled={issued} onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))} className="grid size-9 place-items-center rounded-lg text-[#b42318] hover:bg-red-50 disabled:opacity-40"><Trash2 size={16} /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#e9edf2] 2xl:hidden">
              {lines.map((line, index) => {
                const lineTotals = calculateLine(line);
                return (
                  <article key={line.id} className="p-5">
                    <div className="mb-4 flex items-center justify-between"><strong>Línea {index + 1}</strong><button type="button" aria-label={`Eliminar línea ${index + 1}`} disabled={issued} onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))} className="grid size-9 place-items-center rounded-lg text-[#b42318] hover:bg-red-50"><Trash2 size={16} /></button></div>
                    <div className="grid gap-3 sm:grid-cols-2"><Field label="Código"><input value={line.code} disabled={issued} onChange={(event) => updateLine(line.id, "code", event.target.value)} className={inputClass} /></Field><Field label="Descripción"><input value={line.description} disabled={issued} onChange={(event) => updateLine(line.id, "description", event.target.value)} className={inputClass} /></Field><Field label="Cantidad"><input type="number" min="1" value={line.quantity} disabled={issued} onChange={(event) => updateLine(line.id, "quantity", Math.max(1, Number(event.target.value)))} className={`${inputClass} tabular-nums`} /></Field><Field label="Precio unitario"><input type="number" min="0" value={line.unitPrice} disabled={issued} onChange={(event) => updateLine(line.id, "unitPrice", Math.max(0, Math.round(Number(event.target.value))))} className={`${inputClass} tabular-nums`} /></Field></div>
                    <dl className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-[#f5f7fa] p-3 text-xs"><div><dt className="text-[#667085]">Neto</dt><dd className="tabular-nums mt-1 font-semibold">{formatClp(lineTotals.net)}</dd></div><div><dt className="text-[#667085]">IVA</dt><dd className="tabular-nums mt-1 font-semibold">{formatClp(lineTotals.tax)}</dd></div><div className="text-right"><dt className="text-[#667085]">Total</dt><dd className="tabular-nums mt-1 font-semibold">{formatClp(lineTotals.total)}</dd></div></dl>
                  </article>
                );
              })}
            </div>

            {lines.length === 0 && <div className="p-8 text-center text-sm text-[#667085]">Agrega al menos una línea para emitir la cotización.</div>}
          </section>

          <section className="rounded-xl border border-[#d9e1ea] bg-white p-5 sm:p-6">
            <Field label="Notas y condiciones"><textarea rows={4} disabled={issued} defaultValue="Cotización válida por 15 días. Valores expresados en pesos chilenos." className="w-full resize-y rounded-lg border border-[#d9e1ea] p-3" /></Field>
            <div className="mt-4 grid gap-3 sm:grid-cols-3"><Checkbox label="Incluir datos bancarios" defaultChecked disabled={issued} /><Checkbox label="Mostrar descuento" disabled={issued} /><Checkbox label="Enviar copia por correo" disabled={issued} /></div>
          </section>
        </div>

        <aside className="order-first rounded-xl border border-[#d9e1ea] bg-white p-5 xl:sticky xl:top-24 xl:order-none">
          <h2 className="text-base font-semibold">Resumen</h2>
          <dl className="mt-5 space-y-3 text-sm"><SummaryRow label="Neto" value={formatClp(totals.net)} /><SummaryRow label="IVA (19%)" value={formatClp(totals.tax)} muted /><div className="border-t border-[#d9e1ea] pt-4"><div className="flex items-end justify-between gap-4"><dt className="font-semibold">Total</dt><dd className="tabular-nums text-2xl font-semibold tracking-[-0.025em] text-[#0b2a4a]">{formatClp(totals.total)}</dd></div></div></dl>
          <dl className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-[#f5f7fa] p-4 text-xs"><div><dt className="text-[#667085]">Ítems</dt><dd className="mt-1 text-sm font-semibold">{totals.itemCount}</dd></div><div><dt className="text-[#667085]">Vigencia</dt><dd className="mt-1 text-sm font-semibold">15 días</dd></div></dl>
          <div className="mt-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900"><AlertTriangle size={18} className="mt-0.5 shrink-0" /><p>Al emitir, los datos y precios quedarán congelados para preservar la trazabilidad.</p></div>
          {issued && <Link href="/cotizaciones/COT-2026-0019/imprimir" className={`${primaryButton} mt-4 w-full`}><Printer size={16} /> Imprimir o guardar PDF</Link>}
        </aside>
      </div>

      {confirming && (
        <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-[#00152d]/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirming(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="issue-title" className="w-full max-w-md rounded-xl border border-[#d9e1ea] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-full bg-amber-50 text-amber-700"><AlertTriangle size={21} /></span><button type="button" aria-label="Cerrar confirmación" onClick={() => setConfirming(false)} className="grid size-9 place-items-center rounded-lg hover:bg-[#f5f7fa]"><X size={18} /></button></div>
            <h2 id="issue-title" className="mt-4 text-xl font-semibold">¿Emitir COT-2026-0019?</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">La cotización quedará congelada y no podrá editarse. Los cambios posteriores deberán registrarse como una nueva versión o anulación trazable.</p>
            <div className="mt-6 flex justify-end gap-2"><button type="button" className={secondaryButton} onClick={() => setConfirming(false)}>Volver</button><button type="button" className={primaryButton} onClick={issueQuote}>Sí, emitir</button></div>
          </section>
        </div>
      )}
    </AppShell>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-1.5 block text-xs font-semibold text-[#344054]">{label}</span>{children}</label>;
}

function Checkbox({ label, defaultChecked = false, disabled = false }: { label: string; defaultChecked?: boolean; disabled?: boolean }) {
  return <label className="flex min-h-10 items-center gap-2.5 rounded-lg border border-[#e9edf2] px-3 text-sm text-[#344054]"><input type="checkbox" defaultChecked={defaultChecked} disabled={disabled} className="size-4 accent-[#0b2a4a]" />{label}</label>;
}

function SummaryRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return <div className="flex justify-between gap-4"><dt className={muted ? "text-[#667085]" : "text-[#344054]"}>{label}</dt><dd className="tabular-nums font-semibold">{value}</dd></div>;
}
