'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/store/useAuth'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrgRole, UserRole } from '@/constants/enums'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type OrgUser = {
  id: string
  role: OrgRole
  userId: string
  organizationId: string
  createdAt: string
  user: {
    id: string
    email: string
    name: string
  }
}

type UnassignedUser = {
  id: string
  email: string
}

export default function OrganizationDetailPage() {
  const { id } = useParams()
  const { token, orgRole, user, orgId } = useAuth()

  const [org, setOrg] = useState<any>(null)
  const [users, setUsers] = useState<OrgUser[]>([])
  const [unassignedUsers, setUnassignedUsers] = useState<UnassignedUser[]>([])
  const [loading, setLoading] = useState(true)

  // Add user form
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [role, setRole] = useState<OrgRole>(OrgRole.MEMBER)
  const [adding, setAdding] = useState(false)

  const isAdmin = user?.role === UserRole.SUPERUSER || orgRole === OrgRole.ADMIN

  const fetchUsers = async () => {
    const res = await api.get(`/api/v1/user-organization/members`)
    setUsers(res.data)
  }

  const fetchUnassignedUsers = async () => {
    const res = await api.get(`/api/v1/user-organization/members/unassigned`)
    setUnassignedUsers(res.data)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/v1/organizations/current`)
        setOrg(res.data)

        await fetchUsers()
        await fetchUnassignedUsers()
      } catch (err) {
        console.error('Failed to load organization', err)
        toast.error('Failed to load organization details')
      } finally {
        setLoading(false)
      }
    }

    if (token && id) fetchData()
  }, [token, id, orgId])

  const handleAdd = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user to add')
      return
    }

    try {
      setAdding(true)
      await api.post(`/api/v1/user-organization/members`, {
        userId: selectedUserId,
        role,
      })

      toast.success('User added successfully')
      setSelectedUserId(null)
      setRole(OrgRole.MEMBER)

      await fetchUsers()
      await fetchUnassignedUsers()
    } catch (err) {
      console.error('Add failed:', err)
      toast.error('Failed to add user')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading organization...</p>
      </div>
    )
  }

  if (!loading && orgId !== id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You are not currently viewing this organization. Please switch to this organization first to access its details.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-background">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold">{org?.name}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {users.length > 0 ? (
              <ul className="space-y-3">
                {users.map((u) => (
                  <li
                    key={u.id}
                    className={cn(
                      'flex justify-between items-center border border-border rounded-md px-4 py-3'
                    )}
                  >
                    <span>{u?.user?.email}</span>
                    <span className="text-sm text-muted-foreground">{u.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No members yet.</p>
            )}
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Add User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectedUserId ?? ''} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user email" />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedUsers.length > 0 ? (
                      unassignedUsers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.email}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-users">
                        No available users
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as OrgRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrgRole.MEMBER}>Member</SelectItem>
                    <SelectItem value={OrgRole.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAdd} disabled={adding}>
                {adding ? 'Adding...' : 'Add User'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}