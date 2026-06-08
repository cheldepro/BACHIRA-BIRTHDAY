import React from 'react';
import { GalleryItem } from '../types';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryItem | null;
}

export default function Lightbox({
  isOpen,
  onClose,
  item,
}: LightboxProps) {
  if (!isOpen || !item) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-on-surface/90 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-surface hover:text-secondary-container transition-colors focus:outline-none"
        aria-label="Fermer la vue"
      >
        <span className="material-symbols-outlined text-4xl">close</span>
      </button>

      <div
        className="w-full max-w-md bg-surface p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center ring-1 ring-secondary/20 parchment-texture animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-surface-container-lowest p-5 pb-10 shadow-xl border border-secondary/15 relative w-full rounded-xl">
          {/* Corner styling accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-secondary/25"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-secondary/25"></div>

          <div className="aspect-square bg-surface-container-low overflow-hidden rounded-xl border border-outline-variant/10 flex items-center justify-center relative shadow-inner">
            {item.videoUrl ? (
              <video
                src={item.videoUrl}
                poster={item.imageUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <img
                src={item.imageUrl}
                alt={item.imageAlt}
                className="w-full h-full object-cover rounded-xl"
                style={{ contentVisibility: 'auto' }}
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
