import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    if (pathname === '/') {
        const redirectTo = token ? '/schedule' : '/login'
        return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    const protectedPaths = [
        '/schedule',
        '/product',
        '/project-target',
        '/development-status',
        '/highlight-issue',
        '/photo-update',
        '/recruitment',
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
        '/schedule/:path*',
        '/product/:path*',
        '/project-target/:path*',
        '/development-status/:path*',
        '/highlight-issue/:path*',
        '/photo-update/:path*',
        '/recruitment/:path*',
    ],
}
