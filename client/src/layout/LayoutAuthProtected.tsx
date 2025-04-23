import { Navigate, Outlet } from 'react-router-dom'

const LayoutAuthProtected = () => {
  const isAuthenticationUser = false
  return <>{isAuthenticationUser ? <Navigate to='/' /> : <Outlet />}</>
}

export default LayoutAuthProtected
