import { useAppSelector } from '@/redux/store'
import { Navigate, Outlet } from 'react-router-dom'

const LayoutAuthProtected = () => {
  const { user } = useAppSelector((state) => state.auth)
  return <>{user ? <Navigate to='/' /> : <Outlet />}</>
}

export default LayoutAuthProtected
