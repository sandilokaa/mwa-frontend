import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

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
        '/recruitment',
    ]
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

    if (token) {
        try {
            jwt.verify(token, process.env.NEXT_PUBLIC_SECRET!)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            return NextResponse.redirect(new URL('/logout', request.url))
        }
    }

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
        '/recruitment/:path*',
    ],
}
