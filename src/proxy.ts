import { NextResponse, type NextRequest } from "next/server";
import { knownPaths } from "@/content/routes";

// Unknown lesson, phase or project URLs get a real 404 status, not a 200
// with a "not found" message (search engines index those as real pages).
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/$/, "");
  if (!knownPaths.has(path)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/learn/:phase/:path*", "/projects/:slug"],
};
