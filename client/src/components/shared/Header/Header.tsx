import DarkModeToogle from '../DarkModeToogle'
import Logo from '../Logo'
// import MenuList from './MenuList'
import SearchModal from './SearchBar'
import { Bell, CircleHelp, Filter, Globe, HardDrive, LayoutPanelLeft, UserPlus } from 'lucide-react'
import UserMenu from './UserMenu'
import UserList from './BottomBar/UserList'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const Header = () => {
  return (
    <div className='w-full'>
      <ScrollArea className='w-full whitespace-nowrap py-3 bg-color-1 '>
        <div className='flex justify-between items-center w-full  px-5 '>
          <div className='flex items-center gap-6'>
            <Logo />
            {/* <MenuList /> */}
            <SearchModal />
          </div>

          <div className='flex items-center gap-5'>
            <DarkModeToogle />
            <Bell className='text-white cursor-pointer' />
            <CircleHelp className='text-white cursor-pointer' />
            <UserMenu />
          </div>
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      <ScrollArea className='w-full whitespace-nowrap py-5 mb-5 '>
        <div className='bg-transparent w-full flex justify-between gap-10 items-center px-5 pr-10 '>
          <div className='flex w-ful items-center gap-10'>
            <ListItem title='PhongPhanDev MERN Stack Board' icon={<LayoutPanelLeft />} />
            <ListItem title='Public/Private Workspace' icon={<Globe />} />
            <ListItem title='Add To Google Drive' icon={<HardDrive />} />
            <ListItem title='Filters' icon={<Filter />} />
          </div>
          <div className='flex items-center gap-8'>
            <button className='py-2 px-4 rounded-lg flex items-center gap-2 bg-color-1 text-primary-foreground hover:bg-color-2'>
              <UserPlus />
              <span>Invite</span>
            </button>
            <UserList />
          </div>
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  )
}

export default Header

const ListItem = ({ title, icon }: { title: string; icon: JSX.Element }) => {
  return (
    <div className='flex items-center gap-2 text-white cursor-pointer'>
      {icon}
      {title}
    </div>
  )
}
