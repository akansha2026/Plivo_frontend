/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useAuth } from '@/store/useAuth'
import Link from 'next/link'

const LoginPage = () => {
  const router = useRouter()
  const { token, setAuth, setOrgRole } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  // 👇 Redirect to home if already logged in
  useEffect(() => {
    if (token) {
      router.push('/dashboard')
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/api/v1/users/login', form)
      const { token, user, orgId } = res.data
      setAuth(token, user, orgId, null)

      // 👇 Fetch org role immediately after login
      try {
        const roleRes = await api.get(`/api/v1/user-organization/role`)
        const role = roleRes.data?.role ?? null
        setOrgRole(role)
      } catch (error) {
        console.log('No user role found')
      }

      toast.success('Logged in successfully')
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline font-medium text-primary">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right: Inspirational text */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-muted p-10">
        <h2 className="text-5xl font-bold text-center leading-tight">
          Welcome back. <br /> Keep your team informed.
        </h2>
      </div>
    </div>
  )
}

export default LoginPage