import { useState, useEffect } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MetadataEditorEnhanced } from './MetadataEditorEnhanced';
import { songService, type Song } from '@/api/songService';
import { tagWriterService } from '@/api/tagWriterService';
import type { MusicMetadata } from '@/types/upload';
import {
  Search,
  Music,
  Edit,
  Loader2,
  Clock,
  AlertCircle,
  X,
  CheckCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { getCoverArtUrl } from '@/api/httpClient';
import { cn } from '@/lib/utils';

export function ExistingSongEditor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [updatingSongs, setUpdatingSongs] = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState(false);

  useEffect(() => {
    loadRecentSongs();
    checkScanStatus();
    checkServiceHealth();
  }, []);

  const checkServiceHealth = async () => {
    const available = await tagWriterService.checkHealth();
    setServiceAvailable(available);
    if (!available) {
      console.warn('Tag writer service not available at http://localhost:3001');
    }
  };

  const loadRecentSongs = async () => {
    try {
      const songs = await songService.getRecentSongs(20);
      setRecentSongs(songs);
    } catch (error) {
      console.error('Failed to load recent songs:', error);
    }
  };

  const checkScanStatus = async () => {
    try {
      const status = await songService.getScanStatus();
      setIsScanning(status.scanning);
    } catch (error) {
      console.error('Failed to check scan status:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await songService.searchSongs(searchQuery, 50);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info('No songs found matching your search');
      }
    } catch (error) {
      toast.error('Failed to search songs');
    } finally {
      setIsSearching(false);
    }
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setIsEditorOpen(true);
  };

  const handleSaveMetadata = async (metadata: MusicMetadata, coverArt?: File) => {
    if (!editingSong) return;

    if (!serviceAvailable) {
      toast.error(
        <div>
          <strong>Tag Writer Service Not Available</strong>
          <p className="text-xs mt-1">
            Please start the tag-writer-service. See console for details.
          </p>
        </div>
      );
      return;
    }

    setUpdatingSongs((prev) => new Set(prev).add(editingSong.id));

    try {
      const result = await tagWriterService.updateSongTags(
        editingSong.id,
        metadata,
        coverArt
      );

      if (result.success) {
        toast.success(
          <div>
            <strong>Tags updated successfully!</strong>
            <p className="text-xs mt-1">
              Navidrome is rescanning your library...
            </p>
          </div>,
          { autoClose: 3000 }
        );

        // Poll for scan completion
        setIsScanning(true);
        const pollInterval = setInterval(async () => {
          const status = await songService.getScanStatus();
          if (!status.scanning) {
            clearInterval(pollInterval);
            setIsScanning(false);
            
            // Refresh the song lists
            await loadRecentSongs();
            if (searchQuery.trim()) {
              await handleSearch();
            }
            
            toast.success('Library rescan complete! Metadata refreshed.');
          }
        }, 2000);

        setIsEditorOpen(false);
        setEditingSong(null);
      } else {
        toast.error(
          <div>
            <strong>Failed to update tags</strong>
            <p className="text-xs mt-1">{result.message}</p>
          </div>
        );
      }
    } catch (error) {
      toast.error('An error occurred while updating tags');
    } finally {
      setUpdatingSongs((prev) => {
        const next = new Set(prev);
        next.delete(editingSong.id);
        return next;
      });
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const SongCard = ({ song }: { song: Song }) => {
    const isUpdating = updatingSongs.has(song.id);

    return (
      <Card className={cn("transition-all", isUpdating && "opacity-50")}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Cover Art */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                {song.coverArt ? (
                  <img
                    src={getCoverArtUrl(song.coverArt, 'album', '100')}
                    alt="Cover art"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate text-sm">
                    {song.title}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {song.artist}
                    {song.album && ` • ${song.album}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditSong(song)}
                  disabled={isUpdating || !serviceAvailable}
                >
                  {isUpdating ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Edit className="w-3 h-3 mr-1" />
                  )}
                  Edit
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {song.year && <span>{song.year}</span>}
                {song.genre && (
                  <Badge variant="outline" className="text-xs">
                    {song.genre}
                  </Badge>
                )}
                {song.duration && <span>{formatDuration(song.duration)}</span>}
                {song.bitRate && (
                  <span>{Math.round(song.bitRate / 1000)} kbps</span>
                )}
                {song.size && <span>{formatFileSize(song.size)}</span>}
              </div>

              {song.track && (
                <p className="text-xs text-muted-foreground mt-1">
                  Track {song.track}
                  {song.discNumber && ` • Disc ${song.discNumber}`}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const displaySongs = searchQuery.trim() ? searchResults : recentSongs;

  return (
    <div className="space-y-6">
      {/* Service Status Banner */}
      {!serviceAvailable && (
        <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium mb-1">Tag Writer Service Not Running</h4>
              <p className="text-sm text-muted-foreground mb-2">
                The tag writing service is required to edit metadata. Please start it:
              </p>
              <code className="block bg-black/10 p-2 rounded text-xs font-mono">
                cd tag-writer-service && npm install && npm start
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                See tag-writer-service/README.md for setup instructions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="p-4 border rounded-lg bg-card">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium mb-1">Edit Existing Song Tags</h4>
            <p className="text-sm text-muted-foreground">
              Search for songs and edit their metadata directly. Tags are written to the audio files
              and Navidrome automatically rescans to reflect changes.
            </p>
            {serviceAvailable && (
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500 font-medium">Service Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scan Status */}
      {isScanning && (
        <div className="p-3 border rounded-lg bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="text-sm font-medium">Library scan in progress...</span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, artist, or album..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Search
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {searchQuery.trim() ? (
              <>
                <Search className="w-5 h-5" />
                Search Results
              </>
            ) : (
              <>
                <Clock className="w-5 h-5" />
                Recently Added
              </>
            )}
          </h3>
          {displaySongs.length > 0 && (
            <Badge variant="secondary">
              {displaySongs.length} song{displaySongs.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : displaySongs.length > 0 ? (
          <div className="grid gap-3">
            {displaySongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No songs found matching "{searchQuery}"</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent songs to display</p>
            <p className="text-sm mt-1">Search for songs to edit their tags</p>
          </div>
        )}
      </div>

      {/* Metadata Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Song Tags</DialogTitle>
            <DialogDescription>
              {editingSong?.title} - {editingSong?.artist}
            </DialogDescription>
          </DialogHeader>
          {editingSong && (
            <MetadataEditorEnhanced
              initialMetadata={songService.songToMetadata(editingSong)}
              onSave={handleSaveMetadata}
              onCancel={() => setIsEditorOpen(false)}
              fileName={editingSong.title}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
