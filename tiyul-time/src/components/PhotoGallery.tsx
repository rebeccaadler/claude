import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import type { Photo } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  photos: Photo[];
}

export function PhotoGallery({ photos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 rounded-xl" style={{ border: '1px dashed rgba(106, 171, 122, 0.2)' }}>
        <Camera size={32} style={{ color: '#4a7c59' }} />
        <p className="mt-3 text-sm" style={{ color: '#8aab8f' }}>No photos yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            onClick={() => setLightboxIndex(index)}
          >
            <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white bg-gradient-to-t from-black/60">
                {photo.caption}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              onClick={() => setLightboxIndex(null)}
            >
              <X size={24} color="white" />
            </button>
            {lightboxIndex > 0 && (
              <button
                className="absolute left-4 p-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i ?? 0) - 1); }}
              >
                <ChevronLeft size={24} color="white" />
              </button>
            )}
            {lightboxIndex < photos.length - 1 && (
              <button
                className="absolute right-4 p-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i ?? 0) + 1); }}
              >
                <ChevronRight size={24} color="white" />
              </button>
            )}
            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].caption || ''}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              onClick={e => e.stopPropagation()}
            />
            {photos[lightboxIndex].caption && (
              <p className="absolute bottom-8 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                {photos[lightboxIndex].caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
