import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    if (pathname === '/') {
        const redirectTo = token ? '/dashboard' : '/login'
        return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    const protectedPaths = [
        '/dashboard',
        '/project-target',
        '/development-status',
        '/highlight-issue',
        '/photo-update',
    ]
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/project-target/:path*',
        '/development-status/:path*',
        '/highlight-issue/:path*',
        '/photo-update/:path*',
    ],
}
