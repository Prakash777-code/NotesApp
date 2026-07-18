import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET as string
      )

      const {payload} = await jwtVerify(accessToken,secret)
      console.log("From middleware",payload)
      return NextResponse.next();
    } catch (error) {
      console.error(error)
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
