import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StateMessage from './StateMessage'

// Gate for authenticated routes. `adminOnly` restricts to admins; `roles` restricts
// to an explicit list (e.g. ['admin', 'tutor'] for the tutor studio).
export default function ProtectedRoute({ adminOnly = false, roles }) {
  const { isAuthenticated, isAdmin, isTutor, role, user, loading } = useAuth()
  const location = useLocation()

  if (loading || (isAuthenticated && !user)) return <StateMessage loading />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (adminOnly && !isAdmin) return <Navigate to={isTutor ? '/tutor' : '/dashboard'} replace />
  if (roles && !roles.includes(role)) return <Navigate to={isAdmin ? '/admin' : isTutor ? '/tutor' : '/dashboard'} replace />
  return <Outlet />
}
