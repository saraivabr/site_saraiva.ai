import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (process.env.SITE_COMING_SOON === "false") {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/coming-soon") {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|brand|favicon.ico|robots.txt|sitemap.xml).*)"],
};
