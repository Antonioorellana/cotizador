import type { Metadata } from "next";
import { QuoteEditor } from "@/components/quote-editor";

export const metadata: Metadata = { title: "Nueva cotización" };

export default function NewQuotePage() {
  return <QuoteEditor />;
}
