import axios from 'axios'
import { useAuth } from '@/store/useAuth' 
import { useRouter } from 'next/router'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
  const { token, orgId } = useAuth.getState()
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (orgId) config.headers['org-id'] = orgId
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      // Clear authentication state on 403
      useAuth.getState().clearAuth()

      // Redirect to login page
      const router = useRouter()
      router.push('/login')

      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default api