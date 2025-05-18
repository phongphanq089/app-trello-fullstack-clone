import { useAppSelector } from '@/redux/store'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { user } = useAppSelector((state) => state.auth)

  return user ? <Outlet /> : <Navigate to='/auth/login' />
}
export default ProtectedRoute
