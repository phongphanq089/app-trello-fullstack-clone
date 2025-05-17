import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const isAuthenticationUser = true

  return isAuthenticationUser ? <Outlet /> : <Navigate to='/auth/login' />
}
export default ProtectedRoute
