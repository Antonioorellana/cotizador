"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return <button type="button" onClick={() => window.print()} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0b2a4a] px-4 font-semibold text-white"><Printer size={17} /> Imprimir / guardar PDF</button>;
}
