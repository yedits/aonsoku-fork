import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MainSidebarMenuButton } from '@/app/components/ui/main-sidebar'
import { useRouteIsActive } from '@/app/hooks/use-route-is-active'
import { ISidebarItem, SidebarItems } from '@/app/layout/sidebar'

export function SidebarMainItem({ item }: { item: ISidebarItem }) {
  const { t } = useTranslation()
  const { isActive } = useRouteIsActive()
  const isHome = item.id === SidebarItems.Home

  return (
    <MainSidebarMenuButton
      asChild
      tooltip={t(item.title)}
      className={clsx(
        !isHome && isActive(item.route) && 'bg-accent',
        isHome && 'hover:bg-transparent group justify-center',
      )}
    >
      <Link
        to={item.route}
        className={clsx(
          isActive(item.route) && 'pointer-events-none',
          isHome && 'flex items-center justify-center',
        )}
      >
        <item.icon />
        {!isHome && t(item.title)}
      </Link>
    </MainSidebarMenuButton>
  )
}
