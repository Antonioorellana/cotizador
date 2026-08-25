import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/** Refreshes Supabase cookies and protects operational routes once configured. */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims && request.nextUrl.pathname !== "/acceso") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/acceso";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (data?.claims && request.nextUrl.pathname === "/acceso") {
    return NextResponse.redirect(new URL("/cotizaciones", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/cotizaciones/:path*",
    "/clientes/:path*",
    "/productos/:path*",
    "/configuracion/:path*",
    "/establecer-clave",
    "/acceso",
  ],
};
