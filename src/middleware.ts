import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Custom logic if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // API routes protection
        if (pathname.startsWith("/api")) {
          // Public API routes
          const publicApiRoutes = [
            "/api/auth",
            "/api/rental-items",
            "/api/swagger"
          ]
          
          // Check if it's a public route
          const isPublicRoute = publicApiRoutes.some(route => 
            pathname.startsWith(route)
          )

          if (isPublicRoute) {
            // Check protected methods for public routes
            const protectedApiRoutes = [
              { path: "/api/rental-items", methods: ["POST", "PATCH", "DELETE"], role: "ADMIN" },
            ]

            for (const route of protectedApiRoutes) {
              if (pathname.startsWith(route.path) && route.methods.includes(req.method)) {
                // Need to check method and role
                if (!token) return false
                if (route.role === "ADMIN" && token.role !== "ADMIN") return false
                if (route.role === "AGENT" && !["AGENT", "ADMIN"].includes(token.role as string)) return false
              }
            }
            return true
          }
        }

        // Page routes protection
        if (pathname.startsWith("/dashboard")) {
          return !!token
        }

        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }

        return true
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/:path*",
  ]
}