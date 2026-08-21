import type { QuoteStatus } from "@/lib/quote";

const variants: Record<QuoteStatus, { label: string; classes: string }> = {
  draft: { label: "Borrador", classes: "bg-slate-100 text-slate-700 ring-slate-200" },
  issued: { label: "Emitida", classes: "bg-blue-50 text-blue-700 ring-blue-200" },
  accepted: { label: "Aceptada", classes: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  expired: { label: "Vencida", classes: "bg-amber-50 text-amber-800 ring-amber-200" },
  void: { label: "Anulada", classes: "bg-red-50 text-red-700 ring-red-200" },
};

/** Renders text and color together so quote status remains accessible. */
export function StatusBadge({ status }: { status: QuoteStatus }) {
  const variant = variants[status];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${variant.classes}`}>{variant.label}</span>;
}
