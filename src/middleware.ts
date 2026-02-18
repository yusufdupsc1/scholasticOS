import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check for auth token from cookie or Authorization header
    const authToken = request.cookies.get('auth_token')?.value || 
                      request.headers.get('authorization')?.replace('Bearer ', '');

    const isAuthenticated = !!authToken;
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isApiAuth = request.nextUrl.pathname === '/api/auth';
    const isRoot = request.nextUrl.pathname === '/';
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    // Allow auth API routes
    if (isApiAuth || isLoginPage) {
        return NextResponse.next();
    }

    // Redirect to login if accessing root or dashboard without auth
    if (!isAuthenticated && (isRoot || isDashboard)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if already authenticated and on login page
    if (isAuthenticated && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
