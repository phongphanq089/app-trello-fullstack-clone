import { AppSidebar } from '@/components/layout/AppSideBar'
import TopSidebar from '@/components/layout/TopSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/SiderBar'
import { useAppSelector } from '@/redux/store'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { user } = useAppSelector((state) => state.auth)

  return user ? (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='overflow-hidden px-4 md:px-6 lg:px-8'>
        <TopSidebar />
        <div className='flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6'>
          <div className='min-h-[100vh] flex-1 md:min-h-min'>
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <Navigate to='/auth/login' />
  )
}
export default ProtectedRoute
