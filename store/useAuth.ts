import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string
  name: string
  email: string
  role: string
}

type OrgRole = 'ADMIN' | 'MEMBER' | null // Add possible values for orgRole

interface AuthState {
  token: string | null
  user: User | null
  orgId: string | null
  orgRole: OrgRole // Add orgRole to the state
  setAuth: (token: string, user: User, orgId: string, orgRole: OrgRole) => void // Update the setAuth function to accept orgRole
  clearAuth: () => void
  setOrgId: (orgId: string) => void
  setOrgRole: (orgRole: OrgRole) => void // Add function to set orgRole
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      orgId: null,
      orgRole: null, // Initialize orgRole
      setAuth: (token, user, orgId, orgRole) => set({ token, user, orgId, orgRole }), // Update setAuth
      clearAuth: () => set({ token: null, user: null, orgId: null, orgRole: null }), // Clear orgRole on logout
      setOrgId: (orgId) => set({ orgId }),
      setOrgRole: (orgRole) => set({ orgRole }), // Function to update orgRole
    }),
    {
      name: 'app-storage', // localStorage key
    }
  )
)