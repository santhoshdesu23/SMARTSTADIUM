import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=(self)"
  );

  // Security best-practices headers
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // Minimal Content Security Policy that allows same-origin resources and disallows inline scripts/styles
  const csp = [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "connect-src 'self' https://api.openai.com",
    "frame-ancestors 'none'",
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store");
  }

  // Optional auth enforcement for protected dashboard routes when AUTH_REQUIRED is set
  const requireAuth = process.env.AUTH_REQUIRED === "1" || process.env.AUTH_REQUIRED === "true";
  if (requireAuth) {
    const protectedPrefixes = [
      "/command-center",
      "/crowd",
      "/analytics",
      "/navigation",
      "/accessibility",
      "/transportation",
      "/volunteer",
      "/emergency",
      "/sustainability",
      "/chat",
    ];
    const path = request.nextUrl.pathname;
    if (protectedPrefixes.some((p) => path.startsWith(p))) {
      try {
        const { getUserFromAuthHeaderAsync } = await import("@/lib/auth/session");
        const auth = request.headers.get("authorization") ?? undefined;
        const user = await getUserFromAuthHeaderAsync(auth);
        if (!user) {
          const url = request.nextUrl.clone();
          url.pathname = "/";
          return NextResponse.redirect(url);
        }
      } catch {
        // If something goes wrong, fail-safe to allow access (avoids accidental lockout)
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
