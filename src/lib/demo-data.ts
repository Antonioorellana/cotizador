import type { QuoteLineInput, QuoteStatus } from "./quote";

export const DEMO_NOTICE =
  "Modo demostración: los datos visibles son ficticios y se guardan solo en este navegador.";

export const demoQuotes: Array<{
  number: string;
  client: string;
  issuedAt: string;
  validUntil: string;
  status: QuoteStatus;
  net: number;
  tax: number;
  total: number;
  owner: string;
}> = [
  { number: "COT-2026-0018", client: "Cliente Demo A", issuedAt: "18 ago 2026", validUntil: "02 sep 2026", status: "issued", net: 1499000, tax: 284810, total: 1783810, owner: "Usuario Demo" },
  { number: "COT-2026-0017", client: "Cliente Demo B", issuedAt: "16 ago 2026", validUntil: "31 ago 2026", status: "accepted", net: 870000, tax: 165300, total: 1035300, owner: "Usuario Demo" },
  { number: "COT-2026-0016", client: "Cliente Demo C", issuedAt: "14 ago 2026", validUntil: "29 ago 2026", status: "draft", net: 428000, tax: 81320, total: 509320, owner: "Usuario Demo" },
  { number: "COT-2026-0015", client: "Cliente Demo D", issuedAt: "02 ago 2026", validUntil: "17 ago 2026", status: "expired", net: 2500000, tax: 475000, total: 2975000, owner: "Usuario Demo" },
  { number: "COT-2026-0014", client: "Cliente Demo E", issuedAt: "30 jul 2026", validUntil: "14 ago 2026", status: "void", net: 760000, tax: 144400, total: 904400, owner: "Usuario Demo" },
  { number: "COT-2026-0013", client: "Cliente Demo F", issuedAt: "28 jul 2026", validUntil: "12 ago 2026", status: "accepted", net: 1250000, tax: 237500, total: 1487500, owner: "Usuario Demo" },
];

export const initialQuoteLines: QuoteLineInput[] = [
  { id: "line-1", code: "SRV-001", description: "Servicio técnico demostrativo", quantity: 1, unitPrice: 420000, standardPrice: 420000, offerPrice: 390000 },
  { id: "line-2", code: "MAT-014", description: "Material demostrativo A", quantity: 3, unitPrice: 78500, standardPrice: 78500, offerPrice: 72000 },
  { id: "line-3", code: "LOG-003", description: "Traslado demostrativo", quantity: 1, unitPrice: 95000, standardPrice: 95000, offerPrice: 85000 },
];

export const demoClients = [
  { id: "CLI-001", name: "Cliente Demo A", city: "Copiapó", email: "contacto@example.com", phone: "+56 9 0000 0001", quotes: 7 },
  { id: "CLI-002", name: "Cliente Demo B", city: "Caldera", email: "ventas@example.com", phone: "+56 9 0000 0002", quotes: 4 },
  { id: "CLI-003", name: "Cliente Demo C", city: "Vallenar", email: "administracion@example.com", phone: "+56 9 0000 0003", quotes: 3 },
];

export const demoProducts = [
  { code: "SRV-001", description: "Servicio técnico demostrativo", standard: 420000, offer: 390000, active: true },
  { code: "MAT-014", description: "Material demostrativo A", standard: 78500, offer: 72000, active: true },
  { code: "LOG-003", description: "Traslado demostrativo", standard: 95000, offer: 85000, active: true },
  { code: "SRV-009", description: "Inspección demostrativa", standard: 180000, offer: 0, active: false },
];
