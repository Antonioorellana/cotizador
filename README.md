# Rivera Cotizador

Webapp para crear cotizaciones en CLP con clientes, catálogo, estados, vista imprimible y trazabilidad. El frontend deriva de un sistema visual creado en Stitch y la arquitectura productiva utiliza Next.js, Supabase y Vercel.

## Estado actual

- Frontend navegable en modo demostración, con datos inequívocamente ficticios.
- Editor funcional: líneas editables, lista estándar/oferta, cálculo por línea, guardado local demostrativo, confirmación de emisión y bloqueo posterior.
- Vista individual preparada para imprimir o guardar como PDF.
- Autenticación Supabase preparada mediante `@supabase/ssr` y clave publicable.
- Migración inicial lista, pero **no aplicada a ningún proyecto Supabase**.
- Todas las rutas operativas quedan protegidas automáticamente cuando se configuran las variables de Supabase.

No ingrese datos reales mientras la aplicación muestre la franja `Modo demostración`.

## Reglas de negocio

- Moneda: CLP entero; no se usan `float` para dinero.
- IVA predeterminado: 19%.
- El IVA se redondea por línea y luego se suma.
- Vigencia predeterminada: 15 días.
- Estados: borrador, emitida, aceptada, vencida y anulada.
- Los datos de cliente, descripción y precio se congelan como snapshot al emitir.
- Una cotización emitida no se edita; las correcciones requieren nueva versión o anulación trazable.

## Stack

- Next.js 16 App Router, React 19 y TypeScript estricto.
- Tailwind CSS 4.
- Supabase Auth + Postgres + RLS.
- Vercel para despliegue.
- Vitest para cálculos contables.

## Desarrollo local

```bash
npm install
npm run dev
```

Validación completa:

```bash
npm run check
```

El build usa Webpack porque el entorno de desarrollo administrado bloquea el puerto interno requerido por el procesador PostCSS de Turbopack. Next.js y Vercel soportan este compilador oficialmente.

## Supabase

1. Crear un proyecto dedicado; no reutilizar bases de otros dominios.
2. Aplicar `supabase/migrations/20260821000000_initial_schema.sql`.
3. Copiar `.env.example` a `.env.local`.
4. Configurar:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Crear el primer usuario en Auth.
6. Autenticarse y ejecutar la función `create_organization(name, rut)` para generar la organización y membresía `owner` de forma atómica.

Nunca exponga `service_role` en el navegador ni la guarde en GitHub o Vercel como variable pública.

### Seguridad del esquema

- RLS activo en todas las tablas del esquema público.
- Aislamiento por organización y roles `owner`, `admin`, `seller`, `viewer`.
- Totales reconciliados y validados también en la base de datos.
- Líneas y contenido de cotizaciones emitidas son inmutables.
- Transiciones de estado validadas en Postgres.
- Auditoría sin copiar correos, teléfonos ni direcciones en metadata.
- Solicitudes de acceso, rectificación, supresión, oposición y portabilidad modeladas desde el inicio.

## Diseño Stitch

- Proyecto privado: `7938908633516703243`.
- Panel de cotizaciones: `8b52e0c6b360461bba1121ca264acf69`.
- Nueva cotización: `488f7f59890342988db036b80fae174b`.
- Sistema visual: `d5005c27a7434732842b8ea374eaeae6`.

Los datos enviados a Stitch fueron anonimizados. El diseño no contiene clientes, usuarios ni montos reales.

## Privacidad

La migración contempla minimización, segregación por organización, auditoría y flujo ARCO+. Antes de producción todavía se debe definir y documentar:

- finalidad y base legal de cada dato;
- plazo de conservación y purga efectiva;
- política de privacidad;
- encargados de tratamiento y transferencias internacionales;
- protocolo de incidentes;
- procedimiento operativo para responder solicitudes de titulares.

La existencia de tablas y políticas no reemplaza estas decisiones organizacionales.
