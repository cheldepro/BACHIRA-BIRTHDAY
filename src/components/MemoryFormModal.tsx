import React, { useState, useRef } from 'react';
import { STICKER_ICONS } from '../data';

interface MemoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (data: {
    type: 'memory' | 'note' | 'gallery';
    title: string;
    description: string;
    date?: string;
    imageUrl?: string;
    stickerIcon?: string;
    sealText?: string;
    badge?: string;
  }) => void;
}

export default function MemoryFormModal({
  isOpen,
  onClose,
  onAddMemory,
}: MemoryFormModalProps) {
  const [type, setType] = useState<'memory' | 'note' | 'gallery'>('memory');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stickerIcon, setStickerIcon] = useState('favorite');
  const [sealText, setSealText] = useState('');
  const [badge, setBadge] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("S'il vous plaît, ajoutez un fichier image valide.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("S'il vous plaît, écrivez quelques mots de description.");
      return;
    }

    if (type === 'memory' && (!title.trim() || !date.trim())) {
      alert("S'il vous plaît, remplissez le titre et la date du souvenir.");
      return;
    }

    if (type === 'gallery' && !imageUrl) {
      alert("S'il vous plaît, ajoutez une photo pour le polaroid.");
      return;
    }

    onAddMemory({
      type,
      title: title.trim(),
      description: description.trim(),
      date: date.trim() || undefined,
      imageUrl: imageUrl || undefined,
      stickerIcon: type === 'note' ? stickerIcon : undefined,
      sealText: type === 'note' && sealText.trim() ? sealText.trim() : undefined,
      badge: type === 'note' && badge.trim() ? badge.trim() : undefined,
    });

    // Reset state & Close
    setType('memory');
    setTitle('');
    setDescription('');
    setDate('');
    setImageUrl('');
    setStickerIcon('favorite');
    setSealText('');
    setBadge('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-surface rounded-2xl overflow-hidden shadow-2xl flex flex-col parchment-texture border border-secondary/15 relative ring-1 ring-secondary/20 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top header fold bar */}
        <div className="px-6 py-5 border-b border-secondary/15 flex justify-between items-center bg-surface-container/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2.5xl">history_edu</span>
            <h3 className="font-serif font-bold text-xl text-primary">Inscrire de Nouvelles Pages</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
          {/* Section choice (Tabsstyled) */}
          <div className="flex flex-col gap-1.5 border-b border-outline-variant/30 pb-4">
            <label className="text-xs font-serif font-bold tracking-widest text-secondary block uppercase">
              Où ajouter cette page ?
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setType('memory')}
                className={`py-2 px-3 rounded-xl border text-xs font-serif font-semibold tracking-wide transition-all ${
                  type === 'memory'
                    ? 'bg-secondary text-white border-secondary shadow-md scale-102'
                    : 'border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant'
                }`}
              >
                Moments Forts (Timeline)
              </button>
              <button
                type="button"
                onClick={() => setType('note')}
                className={`py-2 px-3 rounded-xl border text-xs font-serif font-semibold tracking-wide transition-all ${
                  type === 'note'
                    ? 'bg-secondary text-white border-secondary shadow-md scale-102'
                    : 'border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant'
                }`}
              >
                Mots Doux (Sticky notes)
              </button>
              <button
                type="button"
                onClick={() => setType('gallery')}
                className={`py-2 px-3 rounded-xl border text-xs font-serif font-semibold tracking-wide transition-all ${
                  type === 'gallery'
                    ? 'bg-secondary text-white border-secondary shadow-md scale-102'
                    : 'border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant'
                }`}
              >
                Album Photo (Galerie)
              </button>
            </div>
          </div>

          {/* Conditional Input Fields */}
          {type === 'memory' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-serif font-bold tracking-wider text-on-surface-variant block uppercase">
                  Quel moment ? (Titre)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Notre premier baiser"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/80 border border-outline-variant/80 rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-serif font-bold tracking-wider text-on-surface-variant block uppercase">
                  Date du souvenir
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: JUIN 2024"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/80 border border-outline-variant/80 rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>
          )}

          {type === 'gallery' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-serif font-bold tracking-wider text-on-surface-variant block uppercase">
                Titre de l'Image
              </label>
              <input
                type="text"
                required
                placeholder="ex: Éclats de rires au parc"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/80 border border-outline-variant/80 rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
          )}

          {type === 'note' && (
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col col-span-2 gap-1.5">
                <label className="text-xs font-serif font-bold tracking-wider text-on-surface-variant block uppercase">
                  Sous-titre / Badge (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="ex: Note Secrète, LA N°4"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-white/80 border border-outline-variant/80 rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="flex flex-col col-span-1 gap-1.5">
                <label className="text-xs font-serif font-bold tracking-wider text-on-surface-variant block uppercase">
                  Sceau (Initiales)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="ex: B ou ❤"
                  value={sealText}
                  onChange={(e) => setSealText(e.target.value)}
                  className="w-full bg-white/80 border border-outline-variant/80 rounded-xl px-3 py-2 text-sm text-center text-primary font-bold placeholder:font-normal focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>
          )}

          {/* Description Text Box (Diary style) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-serif font-bold tracking-wider text-on-surface-variant block uppercase">
              {type === 'note' ? 'Mots d\'amour / Lettre' : 'Description du souvenir / Notes'}
            </label>
            <textarea
              required
              rows={4}
              placeholder={
                type === 'note'
                  ? "Rédige tes adorables mots ici... ils s'animeront comme une lettre manuscrite à la plume."
                  : "Chaque détail de cet instant fut gravé..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/80 font-handwriting text-xl border border-outline-variant/80 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary placeholder:text-on-surface-variant/30 select-text"
            />
          </div>

          {/* Sticker Choice for sticky love note */}
          {type === 'note' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-serif font-bold tracking-wider text-on-surface-variant block uppercase">
                Icône du médaillon
              </label>
              <div className="flex flex-wrap gap-2.5 mt-1 select-none">
                {STICKER_ICONS.map((sticker) => (
                  <button
                    key={sticker.name}
                    type="button"
                    onClick={() => setStickerIcon(sticker.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium uppercase text-[11px] font-sans transition-all active:scale-95 ${
                      stickerIcon === sticker.name
                        ? 'bg-secondary/15 text-secondary border-secondary scale-102 font-semibold'
                        : 'border-outline-variant/40 hover:bg-white bg-white/30 text-on-surface-variant/80'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm material-fill">
                      {sticker.name}
                    </span>
                    {sticker.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* File uploader and preview for photos */}
          {type !== 'note' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-serif font-bold tracking-wider text-on-surface-variant block uppercase">
                Ajouter une photo polaroid
              </label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative ${
                  isDragging
                    ? 'border-secondary bg-secondary/5 scale-[1.01]'
                    : imageUrl
                    ? 'border-secondary/15 bg-surface-container/10'
                    : 'border-outline-variant/70 hover:border-secondary/40 hover:bg-surface-container-low/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {imageUrl ? (
                  <div className="w-full flex flex-col items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Aperçu du polaroid"
                      className="max-h-40 rounded-lg object-contain shadow-md border border-secondary/10"
                    />
                    <div className="flex items-center gap-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full px-3 py-1 text-xs font-sans">
                      <span className="material-symbols-outlined text-sm material-fill">check_circle</span>
                      Photo chargée avec succès !
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl('');
                        }}
                        className="text-xs underline ml-2 hover:text-primary font-bold"
                      >
                        Enlever
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
                      photo_camera
                    </span>
                    <p className="text-sm text-on-surface font-sans font-medium">
                      Glisser-déposer votre photo ici, ou cliquer pour parcourir
                    </p>
                    <p className="text-xs text-on-surface-variant/60 font-sans mt-1">
                      Supporte les fichiers PNG, JPEG, WEBP ou base64
                    </p>
                    
                    {/* fallback manual enter URL option */}
                    <div className="mt-4 pt-4 border-t border-secondary/10 w-full" onClick={(e) => e.stopPropagation()}>
                      <p className="text-[11px] font-sans font-semibold text-secondary uppercase tracking-wider mb-1.5">
                        OU coller l'adresse URL d'une image web
                      </p>
                      <input
                        type="url"
                        placeholder="https://exemple.com/mon-image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-white border border-outline-variant/80 rounded-lg px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary placeholder:text-on-surface-variant/40"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buttons pad */}
          <div className="pt-4 border-t border-secondary/15 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-full border border-outline/50 hover:bg-surface-container text-on-surface-variant text-sm font-sans font-semibold active:scale-95 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-full bg-secondary text-white hover:bg-primary shadow-lg font-serif font-semibold text-sm active:scale-95 flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-base material-fill">history_edu</span>
              Consigner dans le Livre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
