// import Header from './components/shared/Header/Header'
// import PreviewModernGlassyAlert from './components/shared/PreviewModernGlassyAlert'
import { Navigate, Route, Routes } from 'react-router-dom'
import BoardLayout from './layout/BoardLayout'
import LayoutAuth from './page/auth/LayoutAuth'
import ProtectedRoute from './layout/ProtectedRoute'
import LayoutAuthProtected from './layout/LayoutAuthProtected'

function App() {
  return (
    <Routes>
      <Route path='/auth' element={<LayoutAuthProtected />}>
        <Route path='login' element={<LayoutAuth />} />
        <Route path='register' element={<LayoutAuth />} />
      </Route>

      <Route path='/' element={<ProtectedRoute />}>
        <Route path='' element={<Navigate to={'boards/67f78e83fabfe0894a3089e1'} replace={true} />} />
        <Route path='boards/:boardId' element={<BoardLayout />} />
      </Route>

      <Route path='*' element={<div>Page not found</div>} />
    </Routes>
  )
}

export default App
