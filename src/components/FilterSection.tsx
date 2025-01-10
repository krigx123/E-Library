import React from 'react';
import { Search, Filter as FilterIcon } from 'lucide-react';
import { Filter } from '../types';

interface FilterSectionProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  availableGenres: string[];
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filter,
  onFilterChange,
  availableGenres,
}) => {
  const handleGenreToggle = (genre: string) => {
    const newGenres = filter.genres.includes(genre)
      ? filter.genres.filter(g => g !== genre)
      : [...filter.genres, genre];
    onFilterChange({ ...filter, genres: newGenres });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={filter.search}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Genres
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter.genres.includes(genre)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Status</h3>
          <select
            value={filter.status}
            onChange={(e) => onFilterChange({ ...filter, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Books</option>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="taken">Taken</option>
          </select>
        </div>
      </div>
    </div>
  );
};