import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { logoutUser } from '@/redux/slice/authSlice'
import { AppDispatch } from '@/redux/store'

import { RiSettingsLine, RiTeamLine, RiLogoutBoxLine } from '@remixicon/react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

export default function UserDropdown() {
  const dispath = useDispatch<AppDispatch>()

  const handleLogout = () => {
    dispath(logoutUser(true))
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-auto p-0 hover:bg-transparent'>
          <Avatar className='size-8'>
            <AvatarImage
              src='https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/user_sam4wh.png'
              width={32}
              height={32}
              alt='Profile image'
            />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='max-w-64' align='end'>
        <DropdownMenuLabel className='flex min-w-0 flex-col'>
          <span className='truncate text-sm font-medium text-foreground'>Keith Kennedy</span>
          <span className='truncate text-xs font-normal text-muted-foreground'>k.kennedy@originui.com</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link to={'/account-setting'} className='flex items-center gap-2'>
              <RiSettingsLine size={16} className='opacity-60' aria-hidden='true' />
              <span>Account settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RiTeamLine size={16} className='opacity-60' aria-hidden='true' />
            <span>Affiliate area</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <RiLogoutBoxLine size={16} className='opacity-60' aria-hidden='true' />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
