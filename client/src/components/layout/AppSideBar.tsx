import * as React from 'react'

import {
  RiScanLine,
  RiBardLine,
  RiUserFollowLine,
  RiCodeSSlashLine,
  RiLoginCircleLine,
  RiLayoutLeftLine,
  RiSettings3Line,
  RiLeafLine,
  RiLogoutBoxLine
} from '@remixicon/react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '../ui/SiderBar'
import { SearchForm } from '../shared/SearchForm'
import { TeamSwitcher } from '../shared/TeamSwitcher'
import { Link } from 'react-router-dom'
import { Image } from 'lucide-react'

// This is sample data.
const data = {
  teams: [
    {
      name: 'Trello',
      logo: 'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/logo-01_kp2j8x.png'
    },
    {
      name: 'Acme Corp.',
      logo: 'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/logo-01_kp2j8x.png'
    },
    {
      name: 'Evil Corp.',
      logo: 'https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/logo-01_kp2j8x.png'
    }
  ],
  navMain: [
    {
      title: 'Sections',
      url: '#',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: RiScanLine
        },
        {
          title: 'List board',
          url: '/list-board',
          icon: RiBardLine
        },
        {
          title: 'Gallery',
          url: '/gallery',
          icon: Image,
          isActive: true
        },
        {
          title: 'Tools',
          url: '#',
          icon: RiCodeSSlashLine
        },
        {
          title: 'Integration',
          url: '#',
          icon: RiLoginCircleLine
        },
        {
          title: 'Layouts',
          url: '#',
          icon: RiLayoutLeftLine
        },
        {
          title: 'Reports',
          url: '#',
          icon: RiLeafLine
        }
      ]
    },
    {
      title: 'Other',
      url: '#',
      items: [
        {
          title: 'Settings',
          url: '#',
          icon: RiSettings3Line
        },
        {
          title: 'Help Center',
          url: '#',
          icon: RiLeafLine
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <hr className='border-t border-border mx-2 -mt-px' />
        <SearchForm className='mt-3' />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className='uppercase text-muted-foreground/60'>{item.title} </SidebarGroupLabel>
            <SidebarGroupContent className='px-2'>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className='group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto'
                      isActive={item.isActive}
                    >
                      <Link to={item.url}>
                        {item.icon && (
                          <item.icon
                            className='text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary'
                            size={22}
                            aria-hidden='true'
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <hr className='border-t border-border mx-2 -mt-px' />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className='font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto'>
              <RiLogoutBoxLine
                className='text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary'
                size={22}
                aria-hidden='true'
              />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
