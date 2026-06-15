import { useState } from 'react';
import { Heart, MapPin, Clock, Star, Bus, Map, ChevronDown, ArrowRight, Route } from 'lucide-react';
import type { Hike } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { PhotoGallery } from './PhotoGallery';

interface Props {
  hike: Hike;
  onToggleFavorite: (id: string) => void;
  onClick: (hike: Hike) => void;
}

const difficultyColor: Record<string, string> = {
  Easy: '#4ade80',
  Moderate: '#fbbf24',
  Hard: '#f87171',
};

export function HikeCard({ hike, onToggleFavorite, onClick }: Props) {
  const [expanded, setExpanded] = useState(false);
  const weather = useWeather(hike.coordinates[0], hike.coordinates[1]);
  const color = difficultyColor[hike.difficulty];

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
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-serif text-xl font-bold truncate" style={{ color: '#e8f0e9' }}>{hike.name}</h3>
            <button
              onClick={e => { e.stopPropagation(); onToggleFavorite(hike.id); }}
              className="p-1 rounded-full flex-shrink-0"
            >
              <Heart size={15} fill={hike.isFavorite ? '#ef4444' : 'none'} color={hike.isFavorite ? '#ef4444' : '#4a7c59'} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="pill pill-neutral">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {hike.difficulty}
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

          {hike.trailMarkers && (
            <div className="flex flex-wrap gap-2">
              <span className="pill pill-neutral">
                <Route size={12} />
                {hike.trailMarkers}
              </span>
            </div>
          )}
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
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} fill={s <= hike.rating ? '#c9a84c' : 'none'} stroke={s <= hike.rating ? '#c9a84c' : '#4a7c59'} />
                ))}
              </div>

              {hike.description && (
                <p className="text-sm leading-relaxed" style={{ color: '#b0c8b5' }}>{hike.description}</p>
              )}

              {hike.trailDescription && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8aab8f' }}>Trail</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#b0c8b5' }}>{hike.trailDescription}</p>
                </div>
              )}

              {hike.notes && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8aab8f' }}>Notes</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#b0c8b5' }}>{hike.notes}</p>
                </div>
              )}

              {hike.personalComments && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#8aab8f' }}>Personal Comments</h4>
                  <p className="text-sm leading-relaxed italic" style={{ color: '#b0c8b5' }}>{hike.personalComments}</p>
                </div>
              )}

              {hike.photos.length > 0 && <PhotoGallery photos={hike.photos} />}

              <div className="flex gap-3 flex-wrap pt-1">
                {hike.googleMapsLink && (
                  <a
                    href={hike.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: 'rgba(74, 124, 89, 0.2)', border: '1px solid rgba(106, 171, 122, 0.25)', color: '#6aab7a' }}
                  >
                    <Map size={13} />
                    Google Maps
                  </a>
                )}
                <button
                  onClick={() => onClick(hike)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ml-auto"
                  style={{ background: 'rgba(201, 168, 76, 0.15)', border: '1px solid rgba(201, 168, 76, 0.3)', color: '#c9a84c' }}
                >
                  Full Details
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
