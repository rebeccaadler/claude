import { useState } from 'react';
import { X } from 'lucide-react';
import type { Hike, WishlistHike, Difficulty, Priority } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

interface Props {
  mode: 'hike' | 'wishlist';
  initialData?: Hike | null;
  onSave: (data: Hike | WishlistHike) => void;
  onClose: () => void;
}

const inputStyle = {
  background: 'rgba(15, 35, 20, 0.5)',
  border: '1px solid rgba(106, 171, 122, 0.2)',
  color: '#e8f0e9',
  borderRadius: '10px',
  padding: '10px 14px',
  width: '100%',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: '#8aab8f',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export function AddHikeModal({ mode, initialData, onSave, onClose }: Props) {
  const isEdit = !!initialData;
  const isHike = mode === 'hike';

  const [name, setName] = useState(initialData?.name || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialData?.difficulty || 'Easy');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [coverPhoto, setCoverPhoto] = useState(initialData?.coverPhoto || '');
  const [lat, setLat] = useState(initialData?.coordinates[0]?.toString() || '31.5');
  const [lng, setLng] = useState(initialData?.coordinates[1]?.toString() || '35.0');
  const [moovitLink, setMoovitLink] = useState(initialData?.moovitLink || '');
  const [googleMapsLink, setGoogleMapsLink] = useState(initialData?.googleMapsLink || '');
  const [priority, setPriority] = useState<Priority>('Medium');

  // Hike-only fields
  const [trailDescription, setTrailDescription] = useState((initialData as Hike)?.trailDescription || '');
  const [trailMarkers, setTrailMarkers] = useState((initialData as Hike)?.trailMarkers || '');
  const [personalComments, setPersonalComments] = useState((initialData as Hike)?.personalComments || '');
  const [rating, setRating] = useState((initialData as Hike)?.rating || 0);
  const [dateCompleted, setDateCompleted] = useState((initialData as Hike)?.dateCompleted || new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState(((initialData as Hike)?.tags || []).join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coords: [number, number] = [parseFloat(lat) || 31.5, parseFloat(lng) || 35.0];

    if (isHike) {
      const hike: Hike = {
        id: initialData?.id || uuidv4(),
        name, location, difficulty, duration, description,
        trailDescription, trailMarkers, notes, personalComments,
        rating, dateCompleted,
        photos: (initialData as Hike)?.photos || [],
        coverPhoto: coverPhoto || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        isFavorite: (initialData as Hike)?.isFavorite || false,
        coordinates: coords,
        moovitLink, googleMapsLink,
        additionalLinks: (initialData as Hike)?.additionalLinks || [],
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      onSave(hike);
    } else {
      const wishlist: WishlistHike = {
        id: initialData?.id || uuidv4(),
        name, location, difficulty, duration, notes, description,
        photos: [],
        coverPhoto: coverPhoto || 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800',
        priority, coordinates: coords, moovitLink, googleMapsLink,
      };
      onSave(wishlist);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl overflow-y-auto"
        style={{ background: '#0d2218', border: '1px solid rgba(106, 171, 122, 0.2)', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(106, 171, 122, 0.15)' }}>
          <h2 className="font-serif text-xl font-bold" style={{ color: '#e8f0e9' }}>
            {isEdit ? 'Edit' : 'Add'} {isHike ? 'Hike' : 'Wishlist Hike'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ background: 'rgba(15, 35, 20, 0.6)', color: '#8aab8f' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Hike Name *</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Sataf" />
            </div>
            <div>
              <label style={labelStyle}>Location *</label>
              <input style={inputStyle} value={location} onChange={e => setLocation(e.target.value)} required placeholder="e.g. Jerusalem Hills" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Difficulty</label>
              <select style={inputStyle} value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Duration</label>
              <input style={inputStyle} value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 3-4 hours" />
            </div>
          </div>

          {!isHike && (
            <div>
              <label style={labelStyle}>Priority</label>
              <select style={inputStyle} value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          )}

          {isHike && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Date Completed</label>
                <input type="date" style={inputStyle} value={dateCompleted} onChange={e => setDateCompleted(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Rating (1-5)</label>
                <div className="flex gap-2 mt-2">
                  {[1,2,3,4,5].map(s => (
                    <button type="button" key={s} onClick={() => setRating(s)}>
                      <span style={{ color: s <= rating ? '#c9a84c' : '#4a7c59', fontSize: '22px' }}>★</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="What makes this hike special?" />
          </div>

          {isHike && (
            <>
              <div>
                <label style={labelStyle}>Trail Description</label>
                <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={trailDescription} onChange={e => setTrailDescription(e.target.value)} placeholder="Describe the trail route..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Trail Markers</label>
                  <input style={inputStyle} value={trailMarkers} onChange={e => setTrailMarkers(e.target.value)} placeholder="e.g. Blue trail" />
                </div>
                <div>
                  <label style={labelStyle}>Tags (comma separated)</label>
                  <input style={inputStyle} value={tags} onChange={e => setTags(e.target.value)} placeholder="springs, loop, family" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Personal Comments</label>
                <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={personalComments} onChange={e => setPersonalComments(e.target.value)} placeholder="Your personal thoughts..." />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tips, warnings, what to bring..." />
          </div>

          <div>
            <label style={labelStyle}>Cover Photo URL</label>
            <input style={inputStyle} value={coverPhoto} onChange={e => setCoverPhoto(e.target.value)} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Latitude</label>
              <input style={inputStyle} value={lat} onChange={e => setLat(e.target.value)} placeholder="31.7767" />
            </div>
            <div>
              <label style={labelStyle}>Longitude</label>
              <input style={inputStyle} value={lng} onChange={e => setLng(e.target.value)} placeholder="35.1245" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Moovit Link</label>
              <input style={inputStyle} value={moovitLink} onChange={e => setMoovitLink(e.target.value)} placeholder="https://moovit.com/..." />
            </div>
            <div>
              <label style={labelStyle}>Google Maps Link</label>
              <input style={inputStyle} value={googleMapsLink} onChange={e => setGoogleMapsLink(e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold text-sm" style={{ background: 'rgba(15, 35, 20, 0.6)', color: '#8aab8f', border: '1px solid rgba(106, 171, 122, 0.15)' }}>
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl font-semibold text-sm" style={{ background: 'rgba(201, 168, 76, 0.25)', color: '#c9a84c', border: '1px solid rgba(201, 168, 76, 0.4)' }}>
              {isEdit ? 'Save Changes' : 'Add Hike'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
