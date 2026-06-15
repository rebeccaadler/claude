import { useState } from 'react';
import { ArrowLeft, Heart, Star, MapPin, Clock, Calendar, Bus, Map, ExternalLink, Edit2 } from 'lucide-react';
import type { Hike } from '../types';
import { PhotoGallery } from './PhotoGallery';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  hike: Hike;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (hike: Hike) => void;
}

type DetailTab = 'overview' | 'trail' | 'photos' | 'notes';

export function HikeDetail({ hike, onClose, onToggleFavorite, onEdit }: Props) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const difficultyClass = {
    Easy: 'difficulty-easy',
    Moderate: 'difficulty-moderate',
    Hard: 'difficulty-hard',
  }[hike.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, #0a1a0f 0%, #0d2218 50%, #0a1a0f 100%)' }}
    >
      {/* Hero Image */}
      <div className="relative h-[40vh] overflow-hidden">
        <img src={hike.coverPhoto} alt={hike.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(10,26,15,0.95) 100%)' }} />

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <button
            onClick={onClose}
            className="p-2 rounded-full flex items-center gap-2 text-sm font-medium"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', color: 'white' }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(hike)}
              className="p-2 rounded-full"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', color: 'white' }}
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onToggleFavorite(hike.id)}
              className="p-2 rounded-full"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}
            >
              <Heart size={18} fill={hike.isFavorite ? '#ef4444' : 'none'} color={hike.isFavorite ? '#ef4444' : 'white'} />
            </button>
          </div>
        </div>

        {/* Hike Name overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-2 ${difficultyClass}`}>
            {hike.difficulty}
          </span>
          <h1 className="font-serif text-4xl font-bold text-white">{hike.name}</h1>
          <p className="text-sm mt-1" style={{ color: '#8aab8f' }}>{hike.location}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-20 -mt-4">
        {/* Meta Row */}
        <div className="glass-card p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: '#c9a84c' }} />
            <span className="text-sm" style={{ color: '#e8f0e9' }}>{hike.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} style={{ color: '#c9a84c' }} />
            <span className="text-sm" style={{ color: '#e8f0e9' }}>{hike.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} style={{ color: '#c9a84c' }} />
            <span className="text-sm" style={{ color: '#e8f0e9' }}>{new Date(hike.dateCompleted).toLocaleDateString('en-IL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={16} fill={s <= hike.rating ? '#c9a84c' : 'none'} stroke={s <= hike.rating ? '#c9a84c' : '#4a7c59'} />
            ))}
          </div>
        </div>

        {/* Transport Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <a href={hike.moovitLink} target="_blank" rel="noopener noreferrer" className="moovit-btn flex-1 justify-center">
            <Bus size={16} />
            Get there with Moovit
          </a>
          {hike.googleMapsLink && (
            <a
              href={hike.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: 'rgba(74, 124, 89, 0.3)', border: '1px solid rgba(106, 171, 122, 0.3)', color: '#6aab7a' }}
            >
              <Map size={16} />
              Google Maps
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(15, 35, 20, 0.6)', border: '1px solid rgba(106, 171, 122, 0.15)' }}>
          {(['overview', 'trail', 'photos', 'notes'] as DetailTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: activeTab === tab ? 'rgba(201, 168, 76, 0.2)' : 'transparent',
                color: activeTab === tab ? '#c9a84c' : '#8aab8f',
                border: activeTab === tab ? '1px solid rgba(201, 168, 76, 0.3)' : '1px solid transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="glass-card p-5">
                  <h3 className="font-serif text-lg font-semibold mb-3" style={{ color: '#c9a84c' }}>About this Hike</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#e8f0e9' }}>{hike.description}</p>
                </div>
                {hike.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hike.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(74, 124, 89, 0.2)', color: '#6aab7a', border: '1px solid rgba(106, 171, 122, 0.2)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {hike.additionalLinks.length > 0 && (
                  <div className="glass-card p-4">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: '#8aab8f' }}>Additional Resources</h4>
                    <div className="space-y-2">
                      {hike.additionalLinks.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:underline"
                          style={{ color: '#6aab7a' }}>
                          <ExternalLink size={14} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'trail' && (
              <div className="space-y-4">
                <div className="glass-card p-5">
                  <h3 className="font-serif text-lg font-semibold mb-3" style={{ color: '#c9a84c' }}>Trail Description</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#e8f0e9' }}>{hike.trailDescription}</p>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-semibold mb-2 text-sm" style={{ color: '#8aab8f' }}>Trail Markers</h3>
                  <p className="text-sm" style={{ color: '#e8f0e9' }}>{hike.trailMarkers}</p>
                </div>
              </div>
            )}
            {activeTab === 'photos' && (
              <PhotoGallery photos={hike.photos} />
            )}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                {hike.notes && (
                  <div className="glass-card p-5">
                    <h3 className="font-serif text-lg font-semibold mb-3" style={{ color: '#c9a84c' }}>Notes</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#e8f0e9' }}>{hike.notes}</p>
                  </div>
                )}
                {hike.personalComments && (
                  <div className="glass-card p-5">
                    <h3 className="font-serif text-lg font-semibold mb-3" style={{ color: '#c9a84c' }}>Personal Comments</h3>
                    <p className="text-sm leading-relaxed italic" style={{ color: '#e8f0e9' }}>{hike.personalComments}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
