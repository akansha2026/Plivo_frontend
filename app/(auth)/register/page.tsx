/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import api from '@/lib/api'
import Link from 'next/link'
import { useAuth } from '@/store/useAuth'

const RegisterPage = () => {
  const router = useRouter()
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  // 👇 Redirect if already authenticated
  useEffect(() => {
    if (token) {
      router.push('/dashboard')
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/api/v1/users/register', form)
      if (res.status === 201 || res.status === 200) {
        toast.success('Registered successfully')
        router.push('/login')
      }
    } catch (err: any) {
      if (err.response?.data?.error?.length) {
        err.response.data.error.forEach((e: any) => {
          toast.error(e.message)
        })
      } else {
        toast.error('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Register</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
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
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline font-medium text-primary">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right: Inspiration text */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-muted p-10">
        <h2 className="text-5xl font-bold text-center leading-tight">
          Join us and stay<br />informed in real-time.
        </h2>
      </div>
    </div>
  )
}

export default RegisterPage