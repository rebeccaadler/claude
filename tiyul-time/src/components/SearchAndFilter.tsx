import { Search, SlidersHorizontal } from 'lucide-react';
import type { Difficulty, SortBy } from '../types';

interface Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  difficultyFilter: Difficulty | 'All';
  setDifficultyFilter: (d: Difficulty | 'All') => void;
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
}

const difficulties: (Difficulty | 'All')[] = ['All', 'Easy', 'Moderate', 'Hard'];

export function SearchAndFilter({ searchQuery, setSearchQuery, difficultyFilter, setDifficultyFilter, sortBy, setSortBy }: Props) {
  return (
    <div className="space-y-3 mb-6">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8aab8f' }} />
        <input
          type="text"
          placeholder="Search hikes, locations, tags..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: 'rgba(15, 35, 20, 0.7)',
            border: '1px solid rgba(106, 171, 122, 0.2)',
            color: '#e8f0e9',
          }}
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: difficultyFilter === d ? 'rgba(201, 168, 76, 0.25)' : 'rgba(15, 35, 20, 0.7)',
                color: difficultyFilter === d ? '#c9a84c' : '#8aab8f',
                border: difficultyFilter === d ? '1px solid rgba(201, 168, 76, 0.5)' : '1px solid rgba(106, 171, 122, 0.15)',
              }}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <SlidersHorizontal size={14} style={{ color: '#8aab8f' }} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="text-xs rounded-lg px-2 py-1.5 outline-none"
            style={{
              background: 'rgba(15, 35, 20, 0.7)',
              border: '1px solid rgba(106, 171, 122, 0.15)',
              color: '#8aab8f',
            }}
          >
            <option value="date">Sort: Recent</option>
            <option value="name">Sort: Name</option>
            <option value="location">Sort: Location</option>
            <option value="duration">Sort: Duration</option>
          </select>
        </div>
      </div>
    </div>
  );
}
