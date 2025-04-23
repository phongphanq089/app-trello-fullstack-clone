import { useLocation } from 'react-router-dom'
import FormRegister from './FormRegister'
import FormLogin from './FormLogin'

const LayoutAuth = () => {
  const location = useLocation()

  const isLogin = location.pathname === '/auth/login'
  const isRegister = location.pathname === '/auth/register'
  return (
    <section
      className={`relative flex size-full h-screen items-center justify-center bg-[url('http://localhost:8015/Cover.png')] bg-cover px-2 py-6 md:px-12 lg:justify-end lg:p-0`}
    >
      {isLogin && <FormLogin />}
      {isRegister && <FormRegister />}
    </section>
  )
}

export default LayoutAuth
