import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isHrRoute = pathname.startsWith("/hr") || pathname.startsWith("/api/hr")
  if (!isHrRoute) return NextResponse.next()

  const role = req.auth?.user?.role
  if (role !== "HR" && role !== "ADMIN") {
    if (pathname.startsWith("/api/hr")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/hr/:path*", "/api/hr/:path*"],
}
