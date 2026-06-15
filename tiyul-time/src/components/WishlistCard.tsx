import { MapPin, Clock, Bus, CheckCircle, Trash2 } from 'lucide-react';
import type { WishlistHike, Hike } from '../types';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  hike: WishlistHike;
  onMoveToHikes: (wishlistId: string, completedHike: Hike) => void;
  onDelete: (id: string) => void;
  onClick: (hike: WishlistHike) => void;
}

const priorityStyle: Record<string, { bg: string; color: string; border: string }> = {
  High: { bg: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.35)' },
  Medium: { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.35)' },
  Low: { bg: 'rgba(156, 163, 175, 0.15)', color: '#9ca3af', border: 'rgba(156, 163, 175, 0.25)' },
};

const difficultyClass: Record<string, string> = {
  Easy: 'difficulty-easy',
  Moderate: 'difficulty-moderate',
  Hard: 'difficulty-hard',
};

export function WishlistCard({ hike, onMoveToHikes, onDelete, onClick }: Props) {
  const ps = priorityStyle[hike.priority];

  const handleMoveToHikes = (e: React.MouseEvent) => {
    e.stopPropagation();
    const completedHike: Hike = {
      id: uuidv4(),
      name: hike.name,
      location: hike.location,
      difficulty: hike.difficulty,
      duration: hike.duration,
      description: hike.description || '',
      trailDescription: '',
      trailMarkers: '',
      notes: hike.notes,
      personalComments: '',
      rating: 0,
      dateCompleted: new Date().toISOString().split('T')[0],
      photos: hike.photos,
      coverPhoto: hike.coverPhoto,
      isFavorite: false,
      coordinates: hike.coordinates,
      moovitLink: hike.moovitLink,
      googleMapsLink: hike.googleMapsLink || '',
      additionalLinks: [],
      tags: [],
    };
    onMoveToHikes(hike.id, completedHike);
  };

  return (
    <motion.div
      className="glass-card overflow-hidden cursor-pointer group"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
        <img
          src={hike.coverPhoto}
          alt={hike.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onClick={() => onClick(hike)}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,26,15,0.95) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

        {/* Priority Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>
            {hike.priority} Priority
          </span>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyClass[hike.difficulty]}`}>
            {hike.difficulty}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4" onClick={() => onClick(hike)}>
          <h3 className="font-serif text-xl font-bold text-white mb-1">{hike.name}</h3>
          <div className="flex items-center gap-1.5">
            <MapPin size={13} style={{ color: '#8aab8f' }} />
            <span className="text-xs" style={{ color: '#8aab8f' }}>{hike.location}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <Clock size={13} style={{ color: '#8aab8f' }} />
          <span className="text-xs" style={{ color: '#8aab8f' }}>{hike.duration}</span>
        </div>
        {hike.notes && (
          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: '#8aab8f' }}>{hike.notes}</p>
        )}

        <div className="flex gap-2 flex-wrap">
          <a
            href={hike.moovitLink}
            target="_blank"
            rel="noopener noreferrer"
            className="moovit-btn text-xs py-2"
            onClick={e => e.stopPropagation()}
          >
            <Bus size={13} />
            Moovit
          </a>
          <button
            onClick={handleMoveToHikes}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(74, 222, 128, 0.15)', border: '1px solid rgba(74, 222, 128, 0.3)', color: '#4ade80' }}
          >
            <CheckCircle size={13} />
            Done!
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(hike.id); }}
            className="p-2 rounded-lg ml-auto"
            style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', color: '#f87171' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
