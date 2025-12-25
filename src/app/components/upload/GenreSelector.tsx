import { useState, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/app/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const POPULAR_GENRES = [
  { category: 'Rock', genres: ['Rock', 'Alternative Rock', 'Hard Rock', 'Indie Rock', 'Progressive Rock', 'Punk Rock'] },
  { category: 'Electronic', genres: ['Electronic', 'House', 'Techno', 'Trance', 'Dubstep', 'EDM', 'Ambient'] },
  { category: 'Pop', genres: ['Pop', 'Indie Pop', 'Synth Pop', 'K-Pop', 'J-Pop'] },
  { category: 'Hip Hop', genres: ['Hip Hop', 'Rap', 'Trap', 'Lo-fi Hip Hop'] },
  { category: 'Jazz & Blues', genres: ['Jazz', 'Blues', 'Smooth Jazz', 'Bebop', 'Swing'] },
  { category: 'Classical', genres: ['Classical', 'Baroque', 'Romantic', 'Contemporary Classical'] },
  { category: 'Metal', genres: ['Metal', 'Heavy Metal', 'Death Metal', 'Black Metal', 'Power Metal'] },
  { category: 'Other', genres: ['Country', 'Folk', 'Reggae', 'R&B', 'Soul', 'Funk', 'Disco', 'Latin'] },
];

interface GenreSelectorProps {
  value?: string;
  onChange: (genre: string) => void;
  multiple?: boolean;
}

export function GenreSelector({ value, onChange, multiple = false }: GenreSelectorProps) {
  const [open, setOpen] = useState(false);
  const [customGenre, setCustomGenre] = useState('');
  
  const selectedGenres = useMemo(() => {
    if (!value) return [];
    return value.split(',').map(g => g.trim()).filter(Boolean);
  }, [value]);

  const allGenres = useMemo(() => {
    return POPULAR_GENRES.flatMap(cat => 
      cat.genres.map(g => ({ value: g, label: g, category: cat.category }))
    );
  }, []);

  const handleSelect = (genre: string) => {
    if (multiple) {
      const genres = selectedGenres.includes(genre)
        ? selectedGenres.filter(g => g !== genre)
        : [...selectedGenres, genre];
      onChange(genres.join(', '));
    } else {
      onChange(genre);
      setOpen(false);
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    const genres = selectedGenres.filter(g => g !== genreToRemove);
    onChange(genres.join(', '));
  };

  const handleCustomGenre = () => {
    if (customGenre.trim()) {
      handleSelect(customGenre.trim());
      setCustomGenre('');
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedGenres.length > 0 ? (
              <span className="truncate">
                {multiple ? `${selectedGenres.length} selected` : selectedGenres[0]}
              </span>
            ) : (
              "Select genre..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search genres or type custom..." 
              value={customGenre}
              onValueChange={setCustomGenre}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-2">
                  <p className="text-sm text-muted-foreground mb-2">No genre found.</p>
                  {customGenre && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full"
                      onClick={handleCustomGenre}
                    >
                      Add "{customGenre}"
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              {POPULAR_GENRES.map((category) => (
                <CommandGroup key={category.category} heading={category.category}>
                  {category.genres.map((genre) => (
                    <CommandItem
                      key={genre}
                      value={genre}
                      onSelect={() => handleSelect(genre)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedGenres.includes(genre) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {genre}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {multiple && selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <Badge key={genre} variant="secondary" className="gap-1">
              {genre}
              <button
                type="button"
                onClick={() => handleRemoveGenre(genre)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}