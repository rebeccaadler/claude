import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Mountain } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { HikeCard } from './components/HikeCard';
import { HikeDetail } from './components/HikeDetail';
import { WishlistCard } from './components/WishlistCard';
import { MapView } from './components/MapView';
import { SearchAndFilter } from './components/SearchAndFilter';
import { AddHikeModal } from './components/AddHikeModal';
import { useHikeStore } from './store/useHikeStore';
import type { Hike, WishlistHike } from './types';

export default function App() {
  const store = useHikeStore();
  const [selectedHike, setSelectedHike] = useState<Hike | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'hike' | 'wishlist'>('hike');
  const [editingHike, setEditingHike] = useState<Hike | null>(null);

  const handleAddHike = (data: Hike | WishlistHike) => {
    if (addMode === 'hike') {
      const hike = data as Hike;
      if (editingHike) {
        store.updateHike(hike);
        if (selectedHike?.id === hike.id) setSelectedHike(hike);
      } else {
        store.addHike(hike);
      }
    } else {
      store.addWishlistHike(data as WishlistHike);
    }
    setShowAddModal(false);
    setEditingHike(null);
  };

  const handleEdit = (hike: Hike) => {
    setEditingHike(hike);
    setAddMode('hike');
    setShowAddModal(true);
    setSelectedHike(null);
  };

  const openAdd = (mode: 'hike' | 'wishlist') => {
    setAddMode(mode);
    setEditingHike(null);
    setShowAddModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1a0f 0%, #0d2218 50%, #0a1a0f 100%)' }}>
      <Navigation activeTab={store.activeTab} setActiveTab={store.setActiveTab} />

      <main className="pb-24 max-w-3xl mx-auto px-4">
        {/* Hikes Tab */}
        {store.activeTab === 'hikes' && (
          <div>
            <div className="flex items-center justify-between mb-6 mt-4">
              <div>
                <h2 className="font-serif text-2xl font-bold" style={{ color: '#e8f0e9' }}>My Hikes</h2>
                <p className="text-sm mt-1" style={{ color: '#8aab8f' }}>{store.hikes.length} adventures logged</p>
              </div>
              <button
                onClick={() => openAdd('hike')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(201, 168, 76, 0.2)', border: '1px solid rgba(201, 168, 76, 0.4)', color: '#c9a84c' }}
              >
                <Plus size={16} />
                Add Hike
              </button>
            </div>

            <SearchAndFilter
              searchQuery={store.searchQuery}
              setSearchQuery={store.setSearchQuery}
              difficultyFilter={store.difficultyFilter}
              setDifficultyFilter={store.setDifficultyFilter}
              sortBy={store.sortBy}
              setSortBy={store.setSortBy}
            />

            {store.filteredHikes.length === 0 ? (
              <div className="text-center py-20">
                <Mountain size={48} style={{ color: '#4a7c59', margin: '0 auto 16px' }} />
                <p className="font-serif text-xl" style={{ color: '#8aab8f' }}>No hikes found</p>
                <p className="text-sm mt-2" style={{ color: '#4a7c59' }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {store.filteredHikes.map(hike => (
                  <HikeCard
                    key={hike.id}
                    hike={hike}
                    onToggleFavorite={store.toggleFavorite}
                    onClick={setSelectedHike}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {store.activeTab === 'wishlist' && (
          <div>
            <div className="flex items-center justify-between mb-6 mt-4">
              <div>
                <h2 className="font-serif text-2xl font-bold" style={{ color: '#e8f0e9' }}>Wishlist</h2>
                <p className="text-sm mt-1" style={{ color: '#8aab8f' }}>{store.wishlist.length} hikes to do</p>
              </div>
              <button
                onClick={() => openAdd('wishlist')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#a78bfa' }}
              >
                <Plus size={16} />
                Add to Wishlist
              </button>
            </div>

            <SearchAndFilter
              searchQuery={store.searchQuery}
              setSearchQuery={store.setSearchQuery}
              difficultyFilter={store.difficultyFilter}
              setDifficultyFilter={store.setDifficultyFilter}
              sortBy={store.sortBy}
              setSortBy={store.setSortBy}
            />

            {store.filteredWishlist.length === 0 ? (
              <div className="text-center py-20">
                <Mountain size={48} style={{ color: '#4a7c59', margin: '0 auto 16px' }} />
                <p className="font-serif text-xl" style={{ color: '#8aab8f' }}>Wishlist is empty</p>
                <p className="text-sm mt-2" style={{ color: '#4a7c59' }}>Add hikes you want to do!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {store.filteredWishlist.map(hike => (
                  <WishlistCard
                    key={hike.id}
                    hike={hike}
                    onMoveToHikes={store.moveToHikes}
                    onDelete={store.deleteWishlistHike}
                    onClick={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map Tab */}
        {store.activeTab === 'map' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold" style={{ color: '#e8f0e9' }}>Map View</h2>
                <p className="text-sm mt-1" style={{ color: '#8aab8f' }}>
                  <span style={{ color: '#c9a84c' }}>●</span> Completed &nbsp;
                  <span style={{ color: '#8b5cf6' }}>●</span> Wishlist
                </p>
              </div>
            </div>
            <MapView
              hikes={store.hikes}
              wishlist={store.wishlist}
              onHikeClick={setSelectedHike}
            />
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40"
        style={{ background: 'linear-gradient(135deg, #c9a84c, #e0c06a)', boxShadow: '0 8px 32px rgba(201, 168, 76, 0.4)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => openAdd(store.activeTab === 'wishlist' ? 'wishlist' : 'hike')}
      >
        <Plus size={24} color="#0a1a0f" strokeWidth={2.5} />
      </motion.button>

      {/* Hike Detail Overlay */}
      <AnimatePresence>
        {selectedHike && (
          <HikeDetail
            hike={selectedHike}
            onClose={() => setSelectedHike(null)}
            onToggleFavorite={id => { store.toggleFavorite(id); setSelectedHike(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null); }}
            onEdit={handleEdit}
          />
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddHikeModal
            mode={addMode}
            initialData={editingHike}
            onSave={handleAddHike}
            onClose={() => { setShowAddModal(false); setEditingHike(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
