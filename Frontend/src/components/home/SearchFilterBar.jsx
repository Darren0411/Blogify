import React from 'react';
import { SearchIcon, BookOpenIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  resultCount,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-6 -mt-px">
      <div className="border border-border bg-card rounded-lg p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-muted-foreground whitespace-nowrap">
          <BookOpenIcon className="h-4 w-4" />
          {resultCount} articles
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;