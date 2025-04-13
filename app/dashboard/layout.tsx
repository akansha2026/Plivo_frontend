import Navbar from '@/components/shared/navbar'
import ProtectedRoute from '@/components/shared/protected-route'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return <ProtectedRoute>
        <Navbar />
        {children}
    </ProtectedRoute>
}