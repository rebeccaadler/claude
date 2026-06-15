import { Heart, MapPin, Clock, Star, Bus, Map, ArrowRight } from 'lucide-react';
import type { Hike } from '../types';
import { motion } from 'framer-motion';

interface Props {
  hike: Hike;
  onToggleFavorite: (id: string) => void;
  onClick: (hike: Hike) => void;
}

export function HikeCard({ hike, onToggleFavorite, onClick }: Props) {
  const difficultyClass = {
    Easy: 'difficulty-easy',
    Moderate: 'difficulty-moderate',
    Hard: 'difficulty-hard',
  }[hike.difficulty];

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

        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full z-10"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
          onClick={e => { e.stopPropagation(); onToggleFavorite(hike.id); }}
        >
          <Heart size={16} fill={hike.isFavorite ? '#ef4444' : 'none'} color={hike.isFavorite ? '#ef4444' : 'white'} />
        </button>

        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyClass}`}>
            {hike.difficulty}
          </span>
        </div>

        {/* Title overlay */}
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={13} fill={s <= hike.rating ? '#c9a84c' : 'none'} stroke={s <= hike.rating ? '#c9a84c' : '#4a7c59'} />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} style={{ color: '#8aab8f' }} />
            <span className="text-xs" style={{ color: '#8aab8f' }}>{hike.duration}</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: '#8aab8f' }}>
          {hike.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <a
            href={hike.moovitLink}
            target="_blank"
            rel="noopener noreferrer"
            className="moovit-btn flex-1 justify-center text-xs py-2"
            onClick={e => e.stopPropagation()}
          >
            <Bus size={13} />
            Moovit
          </a>
          {hike.googleMapsLink && (
            <a
              href={hike.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold"
              style={{ background: 'rgba(74, 124, 89, 0.2)', border: '1px solid rgba(106, 171, 122, 0.25)', color: '#6aab7a' }}
              onClick={e => e.stopPropagation()}
            >
              <Map size={13} />
              Maps
            </a>
          )}
          <button
            onClick={() => onClick(hike)}
            className="px-3 py-2 rounded-lg flex items-center gap-1 text-xs font-semibold ml-auto"
            style={{ background: 'rgba(201, 168, 76, 0.15)', border: '1px solid rgba(201, 168, 76, 0.3)', color: '#c9a84c' }}
          >
            Details
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
