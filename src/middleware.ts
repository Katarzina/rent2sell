import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET!

export const config = {
  matcher: [
    '/api/rental-items/:function*',
    '/api/favorites/:function*',
    '/api/reviews/:function*'
  ]
}

export async function middleware(request: NextRequest) {
  // Allow GET requests
  if (request.method === 'GET') {
    return NextResponse.next()
  }

  // Check for session token (both development and production cookies)
  const sessionToken = request.cookies.get('next-auth.session-token') ||
                      request.cookies.get('__Secure-next-auth.session-token')
  if (sessionToken) {
    console.log('Session token found:', sessionToken.name);
    // If session token exists, allow the request
    return NextResponse.next()
  }

  // Check for Bearer token as fallback
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    )
  }

  // Verify Bearer token
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Add user info to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', (decoded as any).id)
    requestHeaders.set('x-user-role', (decoded as any).role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    )
  }
}