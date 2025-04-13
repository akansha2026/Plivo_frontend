/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { SetStateAction, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { IncidentStatus } from '@/constants/enums'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CreateIncidentPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<IncidentStatus>(IncidentStatus.INVESTIGATING)
  const [description, setDescription] = useState('')
  const [serviceId, setServiceId] = useState<string>('') // State for selected serviceId
  const [services, setServices] = useState<any[]>([]) // State to hold the list of services
  const [loading, setLoading] = useState(false)

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/api/v1/services') // Fetch the services
        setServices(response.data) // Update the services state
      } catch (error) {
        console.error('Failed to fetch services', error)
        toast.error('Failed to load services')
      }
    }

    fetchServices()
  }, [])

  const handleCreate = async () => {
    if (!title || !description || !serviceId) {
      toast.error('Title, description, and service are required')
      return
    }

    try {
      setLoading(true)
      // Modify the API call to use serviceId in the URL
      await api.post(`/api/v1/incidents/service/${serviceId}`, { title, status, description })
      toast.success('Incident created successfully')
      router.push('/dashboard')
    } catch (error) {
      console.error('Create incident failed', error)
      toast.error('Failed to create incident')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-lg w-full shadow-lg border border-gray-200 rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">Create Incident</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-700">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the incident title"
              className="text-base p-2 border rounded-lg w-full"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-700">Description</Label>
            <Textarea
              value={description}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setDescription(e.target.value)}
              placeholder="Describe the incident in detail"
              className="text-base p-2 border rounded-lg w-full h-32"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-700">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as IncidentStatus)}>
              <SelectTrigger className="text-base p-2 border rounded-lg w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(IncidentStatus).map((s) => (
                  <SelectItem key={s} value={s} className="text-base">
                    {s.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-700">Service</Label>
            {/* Service selection dropdown */}
            <Select value={serviceId} onValueChange={(v) => setServiceId(v)}>
              <SelectTrigger className="text-base p-2 border rounded-lg w-full">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {/* Dynamically load services from the API */}
                {services.length === 0 ? (
                  <SelectItem value="empty" className="text-base">
                    Select Service
                  </SelectItem>
                ) : (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.id} className="text-base">
                      {service.name} {/* Display service name */}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleCreate}
              variant="default"
              disabled={loading}
              className="w-full py-2 text-lg"
            >
              {loading ? 'Creating Incident...' : 'Create Incident'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}