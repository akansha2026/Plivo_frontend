/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import api from '@/lib/api'
import { OrgRole } from '@/constants/enums'
import { useAuth } from '@/store/useAuth'

const statusColors: Record<string, string> = {
  OPERATIONAL: 'bg-green-500',
  DEGRADED: 'bg-yellow-500',
  PARTIAL_OUTAGE: 'bg-orange-500',
  MAJOR_OUTAGE: 'bg-red-500',
}

export default function PublicDashboardPage() {
  const { orgRole } = useAuth()
  const [services, setServices] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, incidentsRes] = await Promise.all([
          api.get(`/api/v1/services`),
          api.get(`/api/v1/incidents`),
        ])
        setServices(servicesRes.data)
        setIncidents(incidentsRes.data)
      } catch (error) {
        console.error('Error loading services or incidents:', error)
      }
    }

    fetchData()
  }, []) // Ensure useEffect re-runs if setOrgRole changes

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-1 text-gray-900">Status Dashboard</h1>
          <p className="text-muted-foreground text-sm">View live status of all services</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/incidents/new`}>
            <Button>Create Incident</Button>
          </Link>
          {orgRole === OrgRole.ADMIN && (
            <Link href={`/services/new`}>
              <Button variant="outline">Create Service</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Current Service Status */}
      <section>
        <h2 className="text-xl font-medium mb-4 text-gray-900">Current Service Status</h2>
        {services.length === 0 ? (
          <p className="text-muted-foreground">No services found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
              >
                <CardContent className="flex flex-col items-center justify-between p-4">
                  <div className="mb-4 text-center">
                    <p className="font-medium text-lg">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.type}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${statusColors[service.status]}`}
                  >
                    {service.status.replaceAll('_', ' ')}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Active Incidents & Maintenances */}
      <section>
        <h2 className="text-xl font-medium mb-4 text-gray-900">Active Incidents & Maintenances</h2>
        {incidents.length === 0 ? (
          <p className="text-muted-foreground">No active incidents or maintenances.</p>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card
                key={incident.id}
                className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
              >
                <CardContent className="p-4 space-y-2">
                  <Link
                    href={`/incidents/${incident.id}`}
                    className="font-semibold text-blue-600 hover:underline text-lg"
                  >
                    {incident.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Status: {incident.status.replaceAll('_', ' ')} | Affects:{' '}
                    {incident.services?.map((s: any) => s.name).join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(incident.updatedAt))} ago
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator />
    </div>
  )
}