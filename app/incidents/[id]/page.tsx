/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDistanceToNow } from 'date-fns'
import api from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const statuses = ['INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED']

export default function IncidentDetailPage() {
  const { id } = useParams()
  const [incident, setIncident] = useState<any>(null)
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('INVESTIGATING')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const [incidentRes, updatesRes] = await Promise.all([
          api.get(`/api/v1/incidents/${id}`),
          api.get(`/api/v1/updates/incident/${id}`),
        ])
        setIncident(incidentRes.data)
        setUpdates(updatesRes.data)
      } catch (error) {
        console.error('Failed to load incident detail', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchIncidentData()
  }, [id])

  const handlePostUpdate = async () => {
    if (!message.trim()) return
    setSubmitting(true)
    try {
      await api.post(`/api/v1/updates/incident/${id}`, {
        incidentId: id,
        message,
        status,
      })
      setMessage('')
      setStatus('INVESTIGATING')
      setShowForm(false)

      const res = await api.get(`/api/v1/updates/incident/${id}`)
      setUpdates(res.data)
    } catch (error) {
      console.error('Error posting update:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-600">Loading incident details...</div>
  if (!incident) return <div className="text-center py-10 text-red-600">Incident not found.</div>

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800">{incident.title}</h1>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </Link>
      </div>

      <p className="text-muted-foreground">Status: {incident.status.replaceAll('_', ' ')}</p>
      <p className="text-sm text-muted-foreground">
        Affected Services: {incident.services?.map((s: any) => s.name).join(', ') || 'None'}
      </p>

      <Separator />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Incident Updates</h2>
        <Button onClick={() => setShowForm((prev) => !prev)} variant="secondary">
          <PlusCircle className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Post Update'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 space-y-4">
          <Textarea
            placeholder="Write your update message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handlePostUpdate} disabled={submitting}>
              {submitting ? 'Posting...' : 'Submit Update'}
            </Button>
          </div>
        </Card>
      )}

      {updates.length === 0 ? (
        <p className="text-muted-foreground">No updates found for this incident.</p>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardContent className="space-y-2 p-4">
                <p className="text-gray-800">{update.message}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {update.status.replaceAll('_', ' ')} | Updated{' '}
                  {formatDistanceToNow(new Date(update.createdAt))} ago
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}