import { useState } from 'react';
import { MapPin, Clock, Bus, CheckCircle, Trash2, ChevronDown } from 'lucide-react';
import type { WishlistHike, Hike } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  hike: WishlistHike;
  onMoveToHikes: (wishlistId: string, completedHike: Hike) => void;
  onDelete: (id: string) => void;
  onClick: (hike: WishlistHike) => void;
}

const priorityColor: Record<string, string> = {
  High: '#a78bfa',
  Medium: '#60a5fa',
  Low: '#9ca3af',
};

export function WishlistCard({ hike, onMoveToHikes, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const weather = useWeather(hike.coordinates[0], hike.coordinates[1]);
  const color = priorityColor[hike.priority];

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
      className="row-card"
      style={{ borderTopColor: color }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-xl font-bold truncate mb-3" style={{ color: '#e8f0e9' }}>{hike.name}</h3>

          <div className="flex flex-wrap items-center gap-2">
            <span className="pill pill-neutral">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {hike.priority} Priority
            </span>
            <span className="pill pill-neutral">
              <MapPin size={12} />
              {hike.location}
            </span>
            <a href={hike.moovitLink} target="_blank" rel="noopener noreferrer" className="pill pill-moovit" onClick={e => e.stopPropagation()}>
              <Bus size={12} />
              Moovit
            </a>
            <span className="pill pill-neutral">
              <Clock size={12} />
              {hike.duration}
            </span>
          </div>
        </div>

        {weather && (
          <div className="weather-box">
            <span style={{ fontSize: 20 }}>{weather.emoji}</span>
            <span className="text-sm font-semibold" style={{ color: '#e8f0e9' }}>{weather.tempF}°F</span>
            <span className="text-[10px]" style={{ color: '#8aab8f' }}>{weather.condition}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs font-medium"
        style={{ color: '#8aab8f', borderTop: '1px solid rgba(106, 171, 122, 0.12)' }}
      >
        {expanded ? 'Show less' : 'Show more'}
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-5 space-y-4" style={{ borderTop: '1px solid rgba(106, 171, 122, 0.12)' }}>
              {hike.description && (
                <p className="text-sm leading-relaxed" style={{ color: '#b0c8b5' }}>{hike.description}</p>
              )}
              {hike.notes && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8aab8f' }}>Notes</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#b0c8b5' }}>{hike.notes}</p>
                </div>
              )}

              <div className="flex gap-3 flex-wrap pt-1">
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ml-auto"
                  style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', color: '#f87171' }}
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
