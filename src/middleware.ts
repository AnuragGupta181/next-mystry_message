import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  // Redirect authenticated users away from sign-in, sign-up, or verify pages
  if (
    token &&
    (
      url.pathname === '/sign-in' ||
      url.pathname === '/sign-up' ||
      url.pathname.startsWith('/verify')
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

// Paths that middleware should apply to
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
    '/messages/:path*',
  ],
}
