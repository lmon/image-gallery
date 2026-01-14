import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // This function only runs if the user is authenticated
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === "/admin/login") {
          return true
        }
        
        // For all other /admin routes, require authentication
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }
        
        // Allow all other routes
        return true
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}
