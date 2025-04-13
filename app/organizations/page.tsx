/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/useAuth'
import api from '@/lib/api'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { UserRole } from '@/constants/enums'

const OrganizationListPage = () => {
  const { token, user } = useAuth()
  const [orgs, setOrgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await api.get('/api/v1/organizations')
        setOrgs(res.data || [])
      } catch (err) {
        console.error('Failed to load organizations', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchOrgs()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading organizations...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Organizations</h1>
            <p className="text-muted-foreground text-sm mt-1">
              These are the organizations you&apos;re a part of.
            </p>
          </div>
          {user?.role === UserRole.SUPERUSER && (
            <Link
              href="/organizations/new"
              className="inline-block text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition"
            >
              Create Organization
            </Link>
          )}
        </div>

        {orgs.length > 0 ? (
          <ul className="grid md:grid-cols-2 gap-6">
            {orgs.map((org) => (
              <Link href={`/organizations/${org.id}`} key={org.id}>
                <li
                  className={cn(
                    'p-5 border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-muted cursor-pointer'
                  )}
                >
                  <h2 className="text-xl font-semibold">{org.name}</h2>
                  {org.description && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {org.description}
                    </p>
                  )}
                </li>
              </Link>
            ))}
          </ul>
        ) : user?.role === UserRole.SUPERUSER ? (
          <div className="text-center pt-10 space-y-4">
            <h2 className="text-2xl font-bold">No Organizations Found</h2>
            <p className="text-muted-foreground">
              You haven&apos;t created any organizations yet.
            </p>
          </div>
        ) : (
          <div className="text-center pt-10 space-y-4">
            <h2 className="text-2xl font-bold">No Organization Assigned</h2>
            <p className="text-muted-foreground">
              You are not part of any organization. Please contact your administrator to be added.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizationListPage