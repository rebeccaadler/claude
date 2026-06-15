import { useState, useEffect } from 'react';
import type { Hike, WishlistHike, ActiveTab, SortBy, Difficulty } from '../types';
import { sampleHikes, sampleWishlist } from '../data/sampleHikes';

const STORAGE_KEY = 'tiyul-time-data';

interface StoreState {
  hikes: Hike[];
  wishlist: WishlistHike[];
  activeTab: ActiveTab;
  searchQuery: string;
  difficultyFilter: Difficulty | 'All';
  sortBy: SortBy;
}

function loadFromStorage(): Partial<StoreState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

function saveToStorage(state: Partial<StoreState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useHikeStore() {
  const stored = loadFromStorage();

  const [hikes, setHikes] = useState<Hike[]>(stored.hikes ?? sampleHikes);
  const [wishlist, setWishlist] = useState<WishlistHike[]>(stored.wishlist ?? sampleWishlist);
  const [activeTab, setActiveTab] = useState<ActiveTab>('hikes');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  useEffect(() => {
    saveToStorage({ hikes, wishlist });
  }, [hikes, wishlist]);

  const addHike = (hike: Hike) => setHikes(prev => [hike, ...prev]);
  const updateHike = (hike: Hike) => setHikes(prev => prev.map(h => h.id === hike.id ? hike : h));
  const deleteHike = (id: string) => setHikes(prev => prev.filter(h => h.id !== id));
  const toggleFavorite = (id: string) => setHikes(prev => prev.map(h => h.id === id ? { ...h, isFavorite: !h.isFavorite } : h));

  const addWishlistHike = (hike: WishlistHike) => setWishlist(prev => [hike, ...prev]);
  const updateWishlistHike = (hike: WishlistHike) => setWishlist(prev => prev.map(h => h.id === hike.id ? hike : h));
  const deleteWishlistHike = (id: string) => setWishlist(prev => prev.filter(h => h.id !== id));

  const moveToHikes = (wishlistId: string, completedHike: Hike) => {
    setWishlist(prev => prev.filter(h => h.id !== wishlistId));
    setHikes(prev => [completedHike, ...prev]);
  };

  const filteredHikes = hikes
    .filter(h => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.tags.some(t => t.toLowerCase().includes(q));
      const matchDiff = difficultyFilter === 'All' || h.difficulty === difficultyFilter;
      return matchSearch && matchDiff;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime();
      if (sortBy === 'location') return a.location.localeCompare(b.location);
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      return 0;
    });

  const filteredWishlist = wishlist.filter(h => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q);
    const matchDiff = difficultyFilter === 'All' || h.difficulty === difficultyFilter;
    return matchSearch && matchDiff;
  });

  return {
    hikes, wishlist, activeTab, searchQuery, difficultyFilter, sortBy,
    setActiveTab, setSearchQuery, setDifficultyFilter, setSortBy,
    addHike, updateHike, deleteHike, toggleFavorite,
    addWishlistHike, updateWishlistHike, deleteWishlistHike, moveToHikes,
    filteredHikes, filteredWishlist,
  };
}
