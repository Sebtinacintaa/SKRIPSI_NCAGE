import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require authentication (company users)
const COMPANY_PATHS = [
  "/pendaftaran-ncage",
  "/pantau-status",
  "/notifications",
];

// Auth pages — logged-in users should NOT be able to access these
const AUTH_PAGES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to beranda (public page)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/beranda", request.url));
  }

  // /admin/login: only accessible when NOT logged in
  if (pathname.startsWith("/admin/login")) {
    const response = NextResponse.next({ request: { headers: request.headers } });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Already logged in — check if admin or company
      const { data: adminRecord } = await supabase
        .from("admins")
        .select("id")
        .eq("id", user.id)
        .single();
      return NextResponse.redirect(
        new URL(adminRecord ? "/admin/dashboard" : "/beranda", request.url),
      );
    }
    return NextResponse.next();
  }

  const isCompanyRoute = COMPANY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isAuthPage = AUTH_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  // Not a guarded route
  if (!isCompanyRoute && !isAdminRoute && !isAuthPage) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── A. Already logged in → block access to auth pages ────────────────────
  if (isAuthPage) {
    if (user) {
      // Check if they are admin
      const { data: adminRecord } = await supabase
        .from("admins")
        .select("id")
        .eq("id", user.id)
        .single();

      return NextResponse.redirect(
        new URL(adminRecord ? "/admin/dashboard" : "/beranda", request.url),
      );
    }
    return NextResponse.next();
  }


  // ── B. Not authenticated ─────────────────────────────────────────────────
  if (!user) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── 2. Enforce 1-hour session via login_time cookie ──────────────────────
  const loginTimeCookie = request.cookies.get("ncage_login_time")?.value;
  if (!loginTimeCookie) {
    const target = isAdminRoute
      ? new URL("/admin/login?expired=true", request.url)
      : new URL("/login?expired=true", request.url);
    const res = NextResponse.redirect(target);
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name.startsWith("sb-")) {
        res.cookies.delete(cookie.name);
      }
    });
    return res;
  }

  // ── 3. Role check: only admins can access /admin/* ────────────────────────
  if (isAdminRoute) {
    const { data: adminRecord } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!adminRecord) {
      return NextResponse.redirect(new URL("/beranda", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/pendaftaran-ncage/:path*",
    "/pantau-status/:path*",
    "/notifications/:path*",
    "/admin/login",
    "/admin/:path*",
  ],
};
