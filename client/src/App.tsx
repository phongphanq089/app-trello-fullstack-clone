import { Navigate, Route, Routes } from 'react-router-dom'
import LayoutAuth from './page/auth/LayoutAuth'
import ProtectedRoute from './layout/ProtectedRoute'
import LayoutAuthProtected from './layout/LayoutAuthProtected'
import VerifyEmail from './page/auth/VerifyEmail'
import ForgotPasswordPage from './page/auth/ForgotPasswordPage'
import VerifyForgotPassword from './page/auth/VerifyForgotPassword'
import BoardPage from './page/board-detail/BoardPage'
import { PageAccountSetting } from './page/account-setting/PageAccountSetting'

function App() {
  return (
    <Routes>
      <Route path='/auth' element={<LayoutAuthProtected />}>
        <Route path='login' element={<LayoutAuth />} />
        <Route path='register' element={<LayoutAuth />} />
        <Route path='verify-email' element={<VerifyEmail />} />
        <Route path='forgot-password' element={<ForgotPasswordPage />} />
        <Route path='verify-forgot-password' element={<VerifyForgotPassword />} />
      </Route>

      <Route path='/' element={<ProtectedRoute />}>
        <Route path='' element={<Navigate to={'boards/67f78e83fabfe0894a3089e1'} replace={true} />} />
        <Route path='boards/:boardId' element={<BoardPage />} />
        <Route path='/account-setting' element={<PageAccountSetting />} />
      </Route>

      <Route path='*' element={<div>Page not found</div>} />
    </Routes>
  )
}

export default App
