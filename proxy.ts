import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as any;
        // attach user id to headers
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("user-id", decoded?.userId);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
  matcher: ["/api/profile/:path*", "/api/notes/:path*", "/api/ai/:path*"],
};
