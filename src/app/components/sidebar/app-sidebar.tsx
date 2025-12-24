import { useNavigate } from 'react-router-dom'
import CommandMenu from '@/app/components/command/command-menu'
import {
  MainSidebar,
  MainSidebarContent,
  MainSidebarHeader,
  MainSidebarRail,
} from '@/app/components/ui/main-sidebar'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { appName } from '@/utils/appName'
import { ROUTES } from '@/routes/routesList'
import { MiniSidebarSearch } from './mini-search'
import { SidebarMiniSeparator } from './mini-separator'
import { MobileCloseButton } from './mobile-close-button'
import { NavLibrary } from './nav-library'
import { NavMain } from './nav-main'
import { NavPlaylists } from './nav-playlists'

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof MainSidebar>) {
  const navigate = useNavigate()

  return (
    <MainSidebar collapsible="icon" {...props}>
      <MobileCloseButton />
      <MainSidebarHeader>
        <div className="flex items-center justify-center px-2 pb-2">
          <SimpleTooltip text="Home" side="right" delay={200}>
            <Button
              variant="ghost"
              className="group relative h-auto w-auto p-2 hover:bg-transparent transition-all duration-300"
              onClick={() => navigate(ROUTES.LIBRARY.HOME)}
            >
              <img
                src="/resources/icons/yedits-YE-logo-white1.webp"
                alt={appName}
                className="h-8 w-auto object-contain transition-all duration-300 group-hover:scale-110 group-hover:brightness-125 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              />
            </Button>
          </SimpleTooltip>
        </div>
        <CommandMenu />
      </MainSidebarHeader>
      <MiniSidebarSearch />
      <NavMain />
      <SidebarMiniSeparator />
      <MainSidebarContent className="max-h-fit flex-none overflow-x-clip">
        <NavLibrary />
      </MainSidebarContent>
      <NavPlaylists />
      <MainSidebarRail />
    </MainSidebar>
  )
}
