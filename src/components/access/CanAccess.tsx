'use client'

import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

interface CanAccessProps {
    roles: string[]
    children: ReactNode
    fallback?: ReactNode
}

export default function CanAccess({ roles, children, fallback = null }: CanAccessProps) {
    const userRole = useSelector((state: RootState) => state.auth.user?.role)

    if (!userRole || !roles.includes(userRole)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
