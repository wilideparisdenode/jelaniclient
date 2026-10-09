import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StateMessage from './StateMessage'

// Gate for authenticated (and optionally admin-only) routes.
export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, isAdmin, user, loading } = useAuth()
  const location = useLocation()

  if (loading || (isAuthenticated && !user)) return <StateMessage loading />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
