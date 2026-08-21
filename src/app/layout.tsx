import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rivera Cotizador",
    template: "%s | Rivera Cotizador",
  },
  description:
    "Cotizaciones en CLP con trazabilidad, control de clientes y productos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  );
}
