import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/signin") ||
                       req.nextUrl.pathname.startsWith("/register")
    const isOnboardingPage = req.nextUrl.pathname.startsWith("/onboarding")
    const onboardingCompleted = token?.onboardingCompleted

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      if (!onboardingCompleted) {
        return NextResponse.redirect(new URL("/onboarding", req.url))
      }
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Redirect to onboarding if user hasn't completed it
    if (isAuth && !onboardingCompleted && !isOnboardingPage && !isAuthPage) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }

    // Redirect to dashboard if user tries to access onboarding but already completed it
    if (isAuth && onboardingCompleted && isOnboardingPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/signin") ||
            req.nextUrl.pathname.startsWith("/register")) {
          return true
        }
        // Require token for all other pages
        return !!token
      },
    },
    pages: {
      signIn: "/signin",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/analyze/:path*",
    "/onboarding",
    "/signin",
    "/register",
  ],
}
