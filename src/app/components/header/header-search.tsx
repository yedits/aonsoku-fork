import { SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { useAppStore } from '@/store/app.store'
import { usePlayerSonglist } from '@/store/player.store'

export function HeaderSearch() {
  const setOpen = useAppStore((state) => state.command.setOpen)
  const { t } = useTranslation()
  const { currentList, currentSongIndex, currentSong } = usePlayerSonglist()

  const isPlaylistEmpty = currentList.length === 0

  function formatSongCount() {
    const currentPosition = currentSongIndex + 1
    const listLength = currentList.length
    return `[${currentPosition}/${listLength}]`
  }

  function getCurrentSongInfo() {
    return `${currentSong.artist} - ${currentSong.title}`
  }

  return (
    <div className="col-span-2 flex justify-center items-center px-8">
      <Button
        variant="outline"
        className="w-full max-w-2xl h-11 justify-start text-muted-foreground hover:text-foreground electron-no-drag group"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4 shrink-0" />
        <span className="flex-1 truncate text-left">
          {isPlaylistEmpty ? (
            t('sidebar.miniSearch')
          ) : (
            <span className="flex items-center gap-2">
              <span className="text-xs opacity-70">{formatSongCount()}</span>
              <span className="truncate">{getCurrentSongInfo()}</span>
            </span>
          )}
        </span>
        <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </div>
  )
}
