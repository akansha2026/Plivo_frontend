'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/store/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import api from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'

type Org = {
  id: string
  name: string
}

const Navbar = () => {
  const { user, orgId, setOrgId, clearAuth, token, setOrgRole } = useAuth()
  const [orgs, setOrgs] = useState<Org[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchOrgsAndRole = async () => {
      try {
        const res = await api.get('/api/v1/organizations')
        setOrgs(res.data || [])

        if (res.data?.length === 0) {
          router.push('/organizations')
        }

        // Automatically set orgRole when orgId is selected
        if (orgId) {
          const roleRes = await api.get(`/api/v1/user-organization/role`)
          setOrgRole(roleRes.data?.role || null)
        }
      } catch (err) {
        console.error('Failed to load organizations or role', err)
      }
    }

    if (token) fetchOrgsAndRole()
  }, [token, user, orgId, router, setOrgRole])

  const handleOrgChange = async (id: string) => {
    setOrgId(id)
    try {
      const roleRes = await api.get(`/api/v1/user-organization/role`, {
        params: { orgId: id },
      })
      setOrgRole(roleRes.data?.role || null)
    } catch (error) {
      console.error('Failed to fetch role for org', error)
      setOrgRole(null)
    }
    router.refresh()
  }

  const handleLogout = () => {
    clearAuth()
    toast.success('Logged out')
    router.push('/login')
  }

  if (!user) return null

  const currentOrg = orgs.find((org) => org.id === orgId)

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-xl font-semibold text-gray-700 hover:text-gray-600 transition-colors">
          StatusApp
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Links */}
        <Link href="/organizations" className="text-sm  text-gray-700 hover:underline">
          Organizations
        </Link>
        <Link href="/dashboard" className="text-sm  text-gray-700 hover:underline">
          Dashboard
        </Link>

        {/* Org Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm px-4 py-2 text-gray-700 border-gray-300 hover:border-gray-500 transition-colors">
              {currentOrg?.name ?? 'Select Organization'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-gray-700 border-gray-300">
            {orgs.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleOrgChange(org.id)}
                className={org.id === orgId ? 'font-semibold' : ''}
              >
                {org.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-gray-600">
              {user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-gray-700 border-gray-300">
            <DropdownMenuItem disabled className="opacity-80">
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default Navbar