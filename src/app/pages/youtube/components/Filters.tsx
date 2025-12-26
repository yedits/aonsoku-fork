import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent } from '@/app/components/ui/card';
import { SlidersHorizontal } from 'lucide-react';

type SortOption = 'date' | 'views' | 'likes' | 'title' | 'duration' | 'comments';
type FilterOption = 'all' | 'recent' | 'popular' | 'thisMonth' | 'thisYear';
type DurationFilter = 'all' | 'short' | 'medium' | 'long';

interface FiltersProps {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  filterBy: FilterOption;
  setFilterBy: (filter: FilterOption) => void;
  durationFilter: DurationFilter;
  setDurationFilter: (duration: DurationFilter) => void;
}

export function YouTubeFilters({ 
  sortBy, 
  setSortBy, 
  filterBy, 
  setFilterBy,
  durationFilter,
  setDurationFilter 
}: FiltersProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-3 flex-1">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[130px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="comments">Most Comments</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Time:</label>
              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
                <SelectTrigger className="w-[130px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="recent">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                  <SelectItem value="popular">Popular (10K+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Duration:</label>
              <Select value={durationFilter} onValueChange={(value) => setDurationFilter(value as DurationFilter)}>
                <SelectTrigger className="w-[130px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Length</SelectItem>
                  <SelectItem value="short">Short (&lt; 4 min)</SelectItem>
                  <SelectItem value="medium">Medium (4-20 min)</SelectItem>
                  <SelectItem value="long">Long (&gt; 20 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}