import { SidebarTrigger } from '../ui/SiderBar'
import { Separator } from '../ui/Separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../ui/breadcrumb'
import { RiScanLine } from '@remixicon/react'
import DarkModeToogle from '../shared/DarkModeToogle'
import UserDropdown from '../shared/UserDropdown'

const TopSidebar = () => {
  return (
    <header className='flex h-16 shrink-0 items-center gap-2 border-b'>
      <div className='flex flex-1 items-center gap-2 px-3'>
        <SidebarTrigger className='-ms-4' />
        <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink href='#'>
                <RiScanLine size={22} aria-hidden='true' />
                <span className='sr-only'>Dashboard</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>Contacts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex gap-3 ml-auto'>
        <DarkModeToogle />
        <UserDropdown />
      </div>
    </header>
  )
}

export default TopSidebar
