import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent } from '@/app/components/ui/card';
import { SlidersHorizontal } from 'lucide-react';

type SortOption = 'date' | 'views' | 'likes' | 'title';
type FilterOption = 'all' | 'recent' | 'popular';

interface FiltersProps {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  filterBy: FilterOption;
  setFilterBy: (filter: FilterOption) => void;
}

export function YouTubeFilters({ sortBy, setSortBy, filterBy, setFilterBy }: FiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Sort by:</label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Filter:</label>
              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Videos</SelectItem>
                  <SelectItem value="recent">This Week</SelectItem>
                  <SelectItem value="popular">Popular (10K+ views)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}