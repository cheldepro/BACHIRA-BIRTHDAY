import { useState } from 'react';
import { VideoItem } from '../types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoItem | null;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  video,
}: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen || !video) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-on-surface/90 backdrop-blur-md transition-opacity duration-300"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-surface hover:text-secondary-container transition-colors focus:outline-none"
        aria-label="Fermer la vidéo"
      >
        <span className="material-symbols-outlined text-4xl">close</span>
      </button>

      <div
        className="w-full max-w-3xl bg-surface rounded-2xl overflow-hidden shadow-2xl border border-secondary/10 relative p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cinematic frame container */}
        <div className="bg-inverse-surface rounded-xl overflow-hidden aspect-video relative flex items-center justify-center group shadow-inner">
          {isPlaying ? (
            <iframe
              src={`${video.videoUrl}?autoplay=1&mute=1&loop=1`}
              title={video.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 p-4">
              <span className="material-symbols-outlined text-white text-5xl mb-3 animate-pulse">pause_circle</span>
              <p className="text-white text-sm font-sans font-medium">Lecture mise en pause</p>
            </div>
          )}

          {/* Real Playback controls simulation overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20 flex items-center justify-between transition-opacity duration-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white flex items-center justify-center transition-all duration-200 active:scale-90"
              >
                <span className="material-symbols-outlined text-xl material-fill">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              
              <div className="flex flex-col text-left">
                <p className="text-white font-serif font-semibold text-sm tracking-wide">
                  {video.title}
                </p>
                <p className="text-white/60 font-sans text-xs line-clamp-1">
                  {video.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white/85">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-sans">
                <span className="material-symbols-outlined text-xs text-secondary-container material-fill animate-ping">
                  ambient_screen
                </span>
                Projeteur Intime
              </div>
            </div>
          </div>
        </div>

        {/* Captions and annotation pad */}
        <div className="p-5 text-center mt-3 border-t border-secondary/10 bg-surface-container-low/40 rounded-b-xl">
          <p className="font-serif italic text-lg text-primary text-secondary">
            "{video.title}"
          </p>
          <p className="font-handwriting text-2xl text-on-surface-variant/90 leading-relaxed mt-2.5 max-w-2xl mx-auto italic">
            {video.subtitle}
          </p>
          <p className="font-sans text-[11px] text-on-surface-variant/50 uppercase tracking-widest mt-4">
            — Enregistrement souvenir • Bachira’s Birthday Book —
          </p>
        </div>
      </div>
    </div>
  );
}
