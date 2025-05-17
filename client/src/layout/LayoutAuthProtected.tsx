import { Navigate, Outlet } from 'react-router-dom'

const LayoutAuthProtected = () => {
  const isAuthenticationUser = true
  return <>{isAuthenticationUser ? <Navigate to='/' /> : <Outlet />}</>
}

export default LayoutAuthProtected
