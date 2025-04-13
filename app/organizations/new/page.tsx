'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/store/useAuth'
import { UserRole } from '@/constants/enums'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function NewOrganizationPage() {
  const router = useRouter()
  const currentUser = useAuth((state) => state.user)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Organization name is required')
      return
    }

    try {
      setLoading(true)
      await api.post('/api/v1/organizations', { name })
      toast.success('Organization created')
      router.push(`/organizations`)
    } catch (err) {
      console.error('Failed to create organization:', err)
      toast.error('Failed to create organization')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser || currentUser.role !== UserRole.SUPERUSER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You must be a superuser to create a new organization.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Create New Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Organization name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleCreate} disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Organization'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}