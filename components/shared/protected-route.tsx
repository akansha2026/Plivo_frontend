'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/useAuth'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  // Optional: render nothing or a loading spinner while redirecting
  if (!token) return null

  return <>{children}</>
}

export default ProtectedRoute