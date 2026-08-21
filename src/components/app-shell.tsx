import {
  Bell,
  Boxes,
  Building2,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { DEMO_NOTICE } from "@/lib/demo-data";

type NavigationKey = "summary" | "quotes" | "clients" | "products" | "settings";

const navigation = [
  { key: "summary", label: "Resumen", href: "/cotizaciones", icon: LayoutDashboard },
  { key: "quotes", label: "Cotizaciones", href: "/cotizaciones", icon: FileText },
  { key: "clients", label: "Clientes", href: "/clientes", icon: Users },
  { key: "products", label: "Productos", href: "/productos", icon: Boxes },
  { key: "settings", label: "Configuración", href: "/configuracion", icon: Settings },
] as const;

interface AppShellProps {
  active: NavigationKey;
  breadcrumb: string;
  children: ReactNode;
  headerAction?: ReactNode;
}

/** Shared responsive application chrome derived from the Stitch layout. */
export function AppShell({ active, breadcrumb, children, headerAction }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f5f7fa] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="no-print hidden min-h-screen flex-col bg-[#0b2a4a] text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-6">
          <Link href="/cotizaciones" className="flex items-center gap-3 rounded-lg">
            <span className="grid size-10 place-items-center rounded-xl bg-white text-sm font-extrabold text-[#0b2a4a]">RC</span>
            <span>
              <strong className="block text-[15px] tracking-tight">Rivera Cotizador</strong>
              <span className="mt-0.5 block text-xs text-white/60">Empresa Demo SpA</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">Operación</p>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === active;

              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-[#0b2a4a]"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-3">
          <button type="button" className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-white/10">
            <span className="grid size-9 place-items-center rounded-full bg-white/15 text-xs font-bold">UD</span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-sm">Usuario Demo</strong>
              <span className="block text-xs text-white/50">Administrador</span>
            </span>
            <LogOut aria-label="Salir" size={17} className="text-white/55" />
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="no-print border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
          {DEMO_NOTICE}
        </div>
        <header className="no-print sticky top-0 z-20 border-b border-[#d9e1ea] bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center gap-4 px-4 sm:px-6 xl:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#0b2a4a] text-xs font-extrabold text-white lg:hidden">RC</div>
              <p className="hidden truncate text-sm text-[#667085] sm:block">{breadcrumb}</p>
              <div className="relative ml-auto hidden w-full max-w-xs lg:block">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
                <input aria-label="Buscar en toda la aplicación" placeholder="Buscar en todo..." className="h-10 w-full rounded-lg border border-[#d9e1ea] bg-[#f9fafb] pl-9 pr-3 text-sm" />
              </div>
            </div>
            <button type="button" aria-label="Ver notificaciones" className="grid size-10 place-items-center rounded-lg border border-[#d9e1ea] text-[#475467] hover:bg-[#f5f7fa]">
              <Bell size={18} />
            </button>
            {headerAction}
          </div>
          <nav aria-label="Navegación móvil" className="flex gap-1 overflow-x-auto border-t border-[#e9edf2] px-3 py-2 lg:hidden">
            {navigation.slice(1, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.key} href={item.href} className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-[#475467] hover:bg-[#f5f7fa]">
                  <Icon size={16} /> {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">{children}</main>
      </div>
    </div>
  );
}

export function OrganizationSelector() {
  return (
    <button type="button" className="flex h-10 items-center gap-2 rounded-lg border border-[#d9e1ea] bg-white px-3 font-medium text-[#344054]">
      <Building2 size={17} /> Empresa Demo SpA <ChevronDown size={15} />
    </button>
  );
}
