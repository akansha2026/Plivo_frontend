'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import api from '@/lib/api'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ServiceStatus, ServiceType } from '@/constants/enums'

export default function CreateServicePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [type, setType] = useState<ServiceType>(ServiceType.OTHER)
  const [status, setStatus] = useState<ServiceStatus>(ServiceStatus.OPERATIONAL)
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Service name is required')
      return
    }

    try {
      setLoading(true)
      await api.post('/api/v1/services', { name, type, status })
      toast.success('Service created successfully')
      router.push('/dashboard')
    } catch (error) {
      console.error('Create service failed', error)
      toast.error('Failed to create service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-xl shadow-lg border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            Create Service
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base text-gray-700">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service name"
              className="text-base p-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base text-gray-700">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ServiceType)}>
              <SelectTrigger className="text-base p-2 border rounded-lg">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ServiceType).map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">
                    {t.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base text-gray-700">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ServiceStatus)}>
              <SelectTrigger className="text-base p-2 border rounded-lg">
                <SelectValue placeholder="Select service status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ServiceStatus).map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-2 text-lg"
          >
            {loading ? 'Creating Service...' : 'Create Service'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}