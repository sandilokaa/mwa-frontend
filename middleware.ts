import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    console.log('middleware is running')
    const token = request.cookies.get('token')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/project-target/:path*', '/development-status/:path*', '/highlight-issue/:path*', '/photo-update/:path*'],
}
