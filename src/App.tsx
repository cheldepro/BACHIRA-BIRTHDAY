/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Chapter, Memory, LoveNote, GalleryItem, VideoItem } from './types';
import {
  DEFAULT_CHAPTERS,
  DEFAULT_CHAPTER_ONE,
  DEFAULT_MEMORIES,
  DEFAULT_LOVE_NOTES,
  DEFAULT_GALLERY,
  DEFAULT_VIDEOS,
} from './data';
import Sidebar from './components/Sidebar';
import Lightbox from './components/Lightbox';
import MemoryFormModal from './components/MemoryFormModal';
import VideoPlayerModal from './components/VideoPlayerModal';

export default function App() {
  // Navigation & UI States
  const [currentChapterId, setCurrentChapterId] = useState('ch1');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  
  // Custom interactive datasets backed by LocalStorage
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loveNotes, setLoveNotes] = useState<LoveNote[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [wishes, setWishes] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newWishText, setNewWishText] = useState('');

  // Floating Hearts Spawner for Celebration & Likes
  const [hearts, setHearts] = useState<{ id: string; style: React.CSSProperties }[]>([]);

  // Lightbox View State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  // Video Player View State
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [activeVideoItem, setActiveVideoItem] = useState<VideoItem | null>(null);

  // Dynamic nickname that alternates de temps en temps ("Bachira" & "my g")
  const [nickname, setNickname] = useState('Bachira');

  useEffect(() => {
    const nicknames = ['Bachira', 'my g', 'Bachira (my g)', 'my g (Bachira)'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % nicknames.length;
      setNickname(nicknames[index]);
    }, 7000); // cycle every 7 seconds
    return () => clearInterval(interval);
  }, []);

  // Initialize data from LocalStorage
  useEffect(() => {
    const savedMemories = localStorage.getItem('bachira_memories');
    if (savedMemories) {
      try {
        const parsed = JSON.parse(savedMemories) as Memory[];
        
        // Always sync the standard default memories to the current definitions in DEFAULT_MEMORIES
        const updatedMemories = parsed.map(memory => {
          const defaultVersion = DEFAULT_MEMORIES.find(dm => dm.id === memory.id);
          if (defaultVersion) {
            return {
              ...memory,
              ...defaultVersion,
            };
          }
          return memory;
        });

        // Add any missing default memories from the array
        const missingDefaults = DEFAULT_MEMORIES.filter(dm => !updatedMemories.some(m => m.id === dm.id));
        const combined = [...updatedMemories, ...missingDefaults];

        setMemories(combined);
        localStorage.setItem('bachira_memories', JSON.stringify(combined));
      } catch {
        setMemories(DEFAULT_MEMORIES);
        localStorage.setItem('bachira_memories', JSON.stringify(DEFAULT_MEMORIES));
      }
    } else {
      setMemories(DEFAULT_MEMORIES);
      localStorage.setItem('bachira_memories', JSON.stringify(DEFAULT_MEMORIES));
    }

    const savedLoveNotes = localStorage.getItem('bachira_lovenotes');
    if (savedLoveNotes) {
      try {
        const parsed = JSON.parse(savedLoveNotes) as LoveNote[];
        // Sync default love notes to current definitions
        const updatedNotes = parsed.map(note => {
          const defaultVersion = DEFAULT_LOVE_NOTES.find(dn => dn.id === note.id);
          if (defaultVersion) {
            return {
              ...note,
              ...defaultVersion,
            };
          }
          return note;
        });

        const defaultIds = DEFAULT_LOVE_NOTES.map(dn => dn.id);
        const filteredNotes = updatedNotes.filter(n => defaultIds.includes(n.id) || n.isCustom);

        // Add any missing default notes
        const missingDefaults = DEFAULT_LOVE_NOTES.filter(dn => !filteredNotes.some(n => n.id === dn.id));
        const combined = [...filteredNotes, ...missingDefaults];

        setLoveNotes(combined);
        localStorage.setItem('bachira_lovenotes', JSON.stringify(combined));
      } catch {
        setLoveNotes(DEFAULT_LOVE_NOTES);
        localStorage.setItem('bachira_lovenotes', JSON.stringify(DEFAULT_LOVE_NOTES));
      }
    } else {
      setLoveNotes(DEFAULT_LOVE_NOTES);
      localStorage.setItem('bachira_lovenotes', JSON.stringify(DEFAULT_LOVE_NOTES));
    }

    const savedGallery = localStorage.getItem('bachira_gallery');
    if (savedGallery) {
      try {
        const parsed = JSON.parse(savedGallery) as GalleryItem[];
        
        // Sync static polaroids to current definitions (especially the videoUrl field)
        const updatedGallery = parsed.map(item => {
          const defaultVersion = DEFAULT_GALLERY.find(dg => dg.id === item.id);
          if (defaultVersion) {
            return {
              ...item,
              ...defaultVersion,
            };
          }
          return item;
        });

        // Retain only those with valid ID in the default, or if custom, keep them
        const defaultIds = DEFAULT_GALLERY.map(dg => dg.id);
        const filteredGallery = updatedGallery.filter(item => defaultIds.includes(item.id) || item.isCustom);

        // Add any missing defaults
        const missingDefaults = DEFAULT_GALLERY.filter(dg => !filteredGallery.some(item => item.id === dg.id));
        const combined = [...filteredGallery, ...missingDefaults];

        setGalleryItems(combined);
        localStorage.setItem('bachira_gallery', JSON.stringify(combined));
      } catch {
        setGalleryItems(DEFAULT_GALLERY);
        localStorage.setItem('bachira_gallery', JSON.stringify(DEFAULT_GALLERY));
      }
    } else {
      setGalleryItems(DEFAULT_GALLERY);
      localStorage.setItem('bachira_gallery', JSON.stringify(DEFAULT_GALLERY));
    }

    const savedLikes = localStorage.getItem('bachira_likes');
    if (savedLikes) {
      setLikes(JSON.parse(savedLikes));
    }

    const savedWishes = localStorage.getItem('bachira_wishes');
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes));
    } else {
      const defaultWishes = [
        { id: 'w1', text: 'Un pique-nique improvisé sous un saule pleureur 🧺', completed: true },
        { id: 'w2', text: 'Prendre un premier cours de poterie ensemble 🍶', completed: false },
        { id: 'w3', text: 'Manger un gelato artisanal en Italie 🍧', completed: false },
        { id: 'w4', text: 'Écrire un poème à deux mains sous un soir de pluie ✍', completed: false }
      ];
      setWishes(defaultWishes);
      localStorage.setItem('bachira_wishes', JSON.stringify(defaultWishes));
    }
  }, []);

  // Periodic celebration heart spawning on Chapter 5
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentChapterId === 'ch5') {
      interval = setInterval(() => {
        spawnHeart(Math.random() * 100);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [currentChapterId]);

  // Audio tone generator for sweet physical feedback
  const playChimeTone = (frequency1 = 880, frequency2 = 1320, duration = 0.4) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency1, ctx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(frequency2, ctx.currentTime + duration * 0.4);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.05);
    } catch {
      // safe fallback on browser block or iframe block
    }
  };
 
  // Helper to spawn floating hearts
  const spawnHeart = (left: number, isBurst = false) => {
    const id = Math.random().toString();
    const size = isBurst ? Math.random() * 22 + 16 : Math.random() * 26 + 12;
    const duration = isBurst ? Math.random() * 3.5 + 1.5 : Math.random() * 7 + 5;
    const style: React.CSSProperties = {
      position: 'fixed',
      left: `${left}%`,
      bottom: '-50px',
      fontSize: `${size}px`,
      color: ['#ec4899', '#db2777', '#f472b6', '#fbcfe8', '#fda4af', '#f43f5e', '#be185d'][Math.floor(Math.random() * 7)],
      opacity: Math.random() * 0.4 + 0.6,
      pointerEvents: 'none',
      zIndex: 40,
      animation: `floatUp ${duration}s linear forwards`,
      transform: `rotate(${Math.random() * 40 - 20}deg)`
    };

    setHearts((prev) => [...prev, { id, style }]);

    // Clean up heart
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, duration * 1000);
  };

  // Automatically spawn gentle floating background hearts "un peu partout"
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLeft = Math.random() * 95 + 2.5;
      spawnHeart(randomLeft, false);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Hearts burst on like or celebratory trigger
  const triggerBurst = () => {
    playChimeTone(523.25, 1046.50, 0.5); // beautiful octave chime
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
          spawnHeart(Math.random() * 85 + 7.5, true);
        }, i * 35);
    }
  };

  // Like interaction handler
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentLikes = likes[id] || 0;
    const updatedLikes = { ...likes, [id]: currentLikes + 1 };
    setLikes(updatedLikes);
    localStorage.setItem('bachira_likes', JSON.stringify(updatedLikes));
    
    // Play sound and spawn single heart at cursor horizontal
    playChimeTone(783.99, 1174.66, 0.3); // sweet fifth chime
    const rect = e.currentTarget.getBoundingClientRect();
    const percentLeft = (rect.left / window.innerWidth) * 100;
    spawnHeart(percentLeft + 10, true);
  };

  // Add Item handler
  const handleAddMemory = (data: {
    type: 'memory' | 'note' | 'gallery';
    title: string;
    description: string;
    date?: string;
    imageUrl?: string;
    stickerIcon?: string;
    sealText?: string;
    badge?: string;
  }) => {
    playChimeTone(440, 880, 0.4);

    if (data.type === 'memory') {
      const newMemory: Memory = {
        id: `custom_m_${Date.now()}`,
        chapterId: 'ch2',
        date: data.date || 'JUIN 2024',
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
        imageAlt: data.title,
        tilt: Math.random() > 0.5 ? 'right' : 'left',
        isCustom: true,
      };
      const updated = [newMemory, ...memories];
      setMemories(updated);
      localStorage.setItem('bachira_memories', JSON.stringify(updated));
      setCurrentChapterId('ch2');
    } else if (data.type === 'note') {
      const newNote: LoveNote = {
        id: `custom_ln_${Date.now()}`,
        text: data.description,
        icon: data.stickerIcon,
        sealText: data.sealText,
        badge: data.badge,
        tilt: Math.random() > 0.5 ? 'right' : 'left',
        floatClass: ['note-float', 'note-float-delayed', 'note-float-more'][Math.floor(Math.random() * 3)] as any,
        isCustom: true,
      };
      const updated = [newNote, ...loveNotes];
      setLoveNotes(updated);
      localStorage.setItem('bachira_lovenotes', JSON.stringify(updated));
      setCurrentChapterId('ch3');
    } else if (data.type === 'gallery') {
      const newPhoto: GalleryItem = {
        id: `custom_g_${Date.now()}`,
        title: data.title,
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
        imageAlt: data.title,
        tilt: Math.random() > 0.5 ? 'right' : 'left',
        comments: [],
        isCustom: true,
      };
      const updated = [newPhoto, ...galleryItems];
      setGalleryItems(updated);
      localStorage.setItem('bachira_gallery', JSON.stringify(updated));
      setCurrentChapterId('ch4');
    }
  };

  // Add Comment inside gallery item handler
  const handleAddComment = (itemId: string, author: string, text: string) => {
    playChimeTone(659.25, 987.77, 0.35); // sweet third chime
    const updatedGallery = galleryItems.map((item) => {
      if (item.id === itemId) {
        const comments = item.comments || [];
        const dateStr = new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        return {
          ...item,
          comments: [...comments, { author, text, date: dateStr }]
        };
      }
      return item;
    });
    setGalleryItems(updatedGallery);
    localStorage.setItem('bachira_gallery', JSON.stringify(updatedGallery));

    // Live update open lightbox
    const currentlyViewing = updatedGallery.find(g => g.id === itemId);
    if (currentlyViewing) {
      setActiveLightboxItem(currentlyViewing);
    }
  };

  // Interactive Wish List Handlers for Chapter 5
  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishText.trim()) return;
    playChimeTone(587.33, 880, 0.3);
    const newWish = {
      id: `wish_${Date.now()}`,
      text: newWishText.trim(),
      completed: false
    };
    const updated = [...wishes, newWish];
    setWishes(updated);
    localStorage.setItem('bachira_wishes', JSON.stringify(updated));
    setNewWishText('');
  };

  const handleToggleWish = (id: string) => {
    playChimeTone(523.25, 659.25, 0.25);
    const updated = wishes.map((w) => {
      if (w.id === id) {
        return { ...w, completed: !w.completed };
      }
      return w;
    });
    setWishes(updated);
    localStorage.setItem('bachira_wishes', JSON.stringify(updated));
  };

  const handleDeleteWish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = wishes.filter((w) => w.id !== id);
    setWishes(updated);
    localStorage.setItem('bachira_wishes', JSON.stringify(updated));
  };

  // Handlers to open drawers or lightboxes
  const openPhotoLightbox = (item: GalleryItem) => {
    setActiveLightboxItem(item);
    setLightboxOpen(true);
  };

  const openMoviePlayer = (video: VideoItem) => {
    setActiveVideoItem(video);
    setVideoPlayerOpen(true);
  };

  // Scroll to main content area nicely on page change
  const navigateToChapter = (chapterId: string) => {
    setCurrentChapterId(chapterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to determine next chapter index
  const nextChapterMap: Record<string, string> = {
    'ch1': 'ch2',
    'ch2': 'ch3',
    'ch3': 'ch4',
    'ch4': 'ch5',
    'ch5': 'ch1'
  };

  return (
    <div className="bg-background text-on-surface min-h-[101vh] selection:bg-secondary-container selection:text-on-secondary-container custom-scrollbar overflow-x-hidden flex flex-col justify-between">
      
      {/* Immersive heart spawns container */}
      <div className="fixed inset-0 pointer-events-none z-45 overflow-hidden">
        {hearts.map((heart) => (
          <span key={heart.id} className="material-symbols-outlined material-fill" style={heart.style}>
            favorite
          </span>
        ))}
      </div>

      {/* Elegant Header Navbar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-16 bg-surface/90 backdrop-blur-md border-b border-secondary/15 shadow-sm select-none">
        <button 
          onClick={() => navigateToChapter('ch1')}
          className="flex items-center gap-3 active:scale-98 transition-transform text-left"
        >
          <span className="material-symbols-outlined text-primary text-2xl animate-[pulse_3s_infinite]">menu_book</span>
          <h1 className="font-serif text-[18px] md:text-xl font-bold tracking-tight text-secondary leading-none flex items-center gap-1.5">
            {nickname === 'my g' ? "My G's Birthday Book" : nickname === 'my g (Bachira)' ? "My G's (Bachira) Birthday Book" : `${nickname}'s Birthday Book`}
            <span className="text-primary animate-pulse select-none">💖</span>
          </h1>
        </button>

        {/* Desktop Chapter Navigation Tabs */}
        <nav className="hidden md:flex gap-6 items-center">
          {DEFAULT_CHAPTERS.map((ch) => {
            const isActive = currentChapterId === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => navigateToChapter(ch.id)}
                className={`font-epilogue text-[11px] font-semibold uppercase tracking-widest py-[4px] relative active:scale-95 transition-all ${
                  isActive
                    ? 'text-secondary font-bold border-b-2 border-secondary'
                    : 'text-on-surface-variant hover:text-secondary opacity-75'
                }`}
              >
                {ch.title}
              </button>
            );
          })}
        </nav>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMemoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary text-white rounded-full text-xs font-serif font-semibold shadow-xs hover:bg-primary hover:shadow-md active:scale-95 transition-all select-none"
            title="Consigner une nouvelle souvenir"
          >
            <span className="material-symbols-outlined text-sm material-fill">history_edu</span>
            <span className="hidden sm:inline text-[11px]">Écrire</span>
          </button>
          
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-full bg-surface-container-low border border-secondary/10 flex items-center justify-center hover:bg-surface-container hover:shadow-xs active:scale-90 transition-all text-secondary"
            aria-label="Ouvrir le sommaire"
          >
            <span className="material-symbols-outlined text-2xl text-secondary">auto_stories</span>
          </button>
        </div>
      </header>

      {/* Main Container of Book Pages */}
      <main className="flex-grow pt-24 pb-12 w-full max-w-5xl mx-auto px-4 md:px-6 relative select-text" style={{ minHeight: '80vh' }}>
        
        {/* CHAPTER 1 : NOTRE RENCONTRE */}
        {currentChapterId === 'ch1' && (
          <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            <article className="parchment-texture p-6 md:p-10 rounded-2xl shadow-xl border border-secondary/10 relative overflow-hidden ring-1 ring-secondary/5">
              
              {/* Corner Floral Frames */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-secondary/40 rounded-tl-sm"></div>
              <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-secondary/40 rounded-tr-sm"></div>
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-secondary/40 rounded-bl-sm"></div>
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-secondary/40 rounded-br-sm"></div>

              {/* Page Spine highlight effect */}
              <div className="absolute inset-y-0 left-0 w-6 gutter-shadow pointer-events-none opacity-40"></div>

              {/* European Cafe Polaroid Illustration */}
              <div className="mb-8 relative p-2">
                <div className="aspect-[4/5] w-full bg-surface-variant rounded-lg overflow-hidden shadow-lg transform -rotate-1 ring-8 ring-white border border-outline-variant/30">
                  <img
                    src={DEFAULT_CHAPTER_ONE.imageUrl}
                    alt={DEFAULT_CHAPTER_ONE.imageAlt}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Polaroid hand-signed caption */}
                <div className="absolute -bottom-2 right-6 bg-white px-4 py-1.5 shadow-md transform rotate-2 rounded-xs border border-secondary/5 font-handwriting text-primary text-xl font-semibold">
                  Chapitre Un
                </div>
              </div>

              {/* Title Header */}
              <div className="text-center relative z-10 mt-6 px-1">
                <h2 className="font-serif text-2xl font-bold italic tracking-tight text-secondary leading-tight">
                  Le jour où nos chemins se sont croisés...
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent w-4/5 mx-auto my-5"></div>
                
                {/* Book paragraphs */}
                <div className="space-y-6 text-on-surface-variant font-sans font-light leading-relaxed text-sm md:text-base text-justify px-1">
                  {DEFAULT_CHAPTER_ONE.paragraphs.map((p, i) => (
                    <p key={i} className="first-line:font-semibold first-line:text-secondary">
                      {p}
                    </p>
                  ))}
                  
                  {/* Embedded Custom meeting memories added by writer */}
                  {memories.filter(m => m.chapterId === 'ch1').map((m) => (
                    <div key={m.id} className="mt-6 border-t border-secondary/15 pt-5 text-left">
                      <span className="font-sans text-[10px] font-semibold text-secondary tracking-widest uppercase block mb-1">{m.date}</span>
                      <h4 className="font-serif font-bold text-primary text-base mb-1.5">{m.title}</h4>
                      <p className="font-sans text-xs text-on-surface-variant/80 italic leading-relaxed">{m.description}</p>
                    </div>
                  ))}

                  <p className="font-handwriting text-2xl text-primary text-center italic mt-8 leading-relaxed font-semibold">
                    {DEFAULT_CHAPTER_ONE.quote}
                  </p>
                </div>

                <div className="mt-8 flex justify-center">
                  <span className="material-symbols-outlined text-secondary opacity-50 text-2xl animate-bounce">eco</span>
                </div>
              </div>

              {/* Page Number label */}
              <div className="text-center mt-12 font-epilogue text-[10px] font-semibold tracking-widest text-on-surface-variant/50">
                P. 01
              </div>

            </article>
          </div>
        )}

        {/* CHAPTER 2 : NOS MOMENTS FORTS */}
        {currentChapterId === 'ch2' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Chapter Header */}
            <section className="text-center mb-16 px-4">
              <div className="flex justify-center items-center gap-3 mb-3">
                <div className="h-[1px] w-10 bg-secondary/35"></div>
                <span className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold">Chapitre Deux</span>
                <div className="h-[1px] w-10 bg-secondary/35"></div>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary italic leading-tight">
                Ces photos qui font mes journées
              </h2>
              <p className="font-sans font-light text-on-surface-variant text-sm md:text-base max-w-xl mx-auto mt-4 leading-relaxed">
                On n’a pas encore eu de grands moments forts au sens classique, mais les photos que tu m’envoyais embellissaient chacune de mes journées...
              </p>
              <div className="mt-6">
                <span className="material-symbols-outlined text-secondary animate-[pulse_4s_infinite] scale-125">local_florist</span>
              </div>
            </section>

            {/* Staggered Polaroid Memory Cards Stack */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 lg:gap-y-20 select-text">
              {/* Stylized vertical binder divider ring line */}
              <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-secondary/15 -translate-x-1/2">
                <div className="sticky top-1/2 w-2.5 h-2.5 bg-secondary-container border-2 border-secondary rounded-full transform -translate-x-[4.5px]"></div>
              </div>

              {memories.filter(m => m.chapterId === 'ch2').map((memory, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={memory.id}
                    className={`relative w-full aspect-auto ${
                      isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:pt-16 md:text-left'
                    }`}
                  >
                    {/* The elegant card frame */}
                    <article
                      className={`parchment-texture p-4 rounded-xl shadow-lg border border-secondary/10 relative hover:scale-[1.02] active:scale-99 transition-all duration-500 max-w-sm mx-auto ${
                        memory.tilt === 'left' ? 'polaroid-tilt-left' : 'polaroid-tilt-right'
                      }`}
                    >
                      {/* Interactive Heart Pulse on top of memory card */}
                      <button
                        onClick={(e) => handleLike(memory.id, e)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/75 hover:bg-white shadow-xs hover:shadow-md flex items-center justify-center text-red-400 border border-secondary/5 hover:scale-105 active:scale-90 transition-all z-10"
                        title="Aimer ce moment"
                      >
                        <span className="material-symbols-outlined text-sm material-fill text-red-400">favorite</span>
                        {likes[memory.id] > 0 && (
                          <span className="text-[10px] font-bold text-primary font-mono ml-0.5">{likes[memory.id]}</span>
                        )}
                      </button>

                      {/* Polaroid Image Box */}
                      <div className="aspect-[3/4] overflow-hidden rounded-md border border-outline-variant/25 relative shadow-inner bg-surface-container">
                        <img
                          src={memory.imageUrl}
                          alt={memory.imageAlt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-secondary/5 pointer-events-none"></div>
                      </div>

                      {/* Info label */}
                      <div className="space-y-1 text-center mt-4">
                        {memory.date && (
                          <span className="font-sans text-[10px] text-secondary font-bold tracking-widest block uppercase">
                            {memory.date}
                          </span>
                        )}
                        <h3 className="font-serif text-lg font-semibold text-primary">
                          {memory.title}
                        </h3>
                        <p className="font-handwriting text-xl text-on-surface-variant font-medium leading-relaxed max-w-xs mx-auto italic px-2">
                          "{memory.description}"
                        </p>
                      </div>

                      {/* Sticky leaf accent corner frame */}
                      {isEven ? (
                        <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-secondary/35 rounded-tl-sm"></div>
                      ) : (
                        <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-secondary/35 rounded-br-sm"></div>
                      )}
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHAPTER 3 : POURQUOI JE T'AIME */}
        {currentChapterId === 'ch3' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Context Header */}
            <section className="text-center mb-16 relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-5 select-none pointer-events-none">
                <span className="material-symbols-outlined text-[130px] material-fill">favorite</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary italic leading-tight relative z-10">
                Pourquoi je t'aime
              </h2>
              <div className="flex justify-center items-center gap-3 mt-3">
                <div className="h-[1px] w-12 bg-secondary/30"></div>
                <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-secondary">Chapitre Trois</span>
                <div className="h-[1px] w-12 bg-secondary/30"></div>
              </div>
              <p className="mt-6 font-handwriting text-2.5xl leading-relaxed text-secondary/85 max-w-xl mx-auto font-medium">
                "Parce que tu es ce que je désire le plus au monde..."
              </p>
            </section>

            {/* Note cards Staggered Wall with floatings and reaction chimes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative select-text">
              
              {/* Optional background image scattering matching original cafe tables */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-72 h-80 opacity-12 bg-cover bg-center mix-blend-multiply rounded-full select-none pointer-events-none filter sepia"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBJLbhFMkeK77fE98Sn5YBGG6dFUx0jtm8mgNrpUNs7nQAwwNEhg78m_OKRJ-hrHsDFeApK1VOvpu2Zo9okCYrVgwoBaaoVUiKTuVwMVUbV1m79Vsx-vwfWUdPzqPhap-F6Wof167MMrSoyMWzwX0hOGAkTy53Lcs2xBamHrEutPEyCl0jTSzX37XqAc6DtBMqxG-RHTquQhFr06de1ZLs8aEE9H1PMIoLiZAh9qrGW-5TjuDvWXyIV3bccyvxlV7lJ9nlqhKk4ME')" }}
              />

              {loveNotes.map((note) => {
                return (
                  <div
                    key={note.id}
                    onClick={(e) => handleLike(note.id, e)}
                    className={`cursor-pointer transition-all ${note.floatClass}`}
                    title="Cliquer pour aimer ce secret"
                  >
                    <article
                      className={`parchment-texture deckled-edge px-6 py-6 shadow-md hover:shadow-xl border border-secondary/10 hover:border-secondary/25 hover:scale-102 hover:translate-y-[-4px] transition-all duration-300 relative ${
                        note.tilt === 'left' ? 'polaroid-tilt-left' : note.tilt === 'right' ? 'polaroid-tilt-right' : ''
                      }`}
                    >
                      {/* Wax Seal top-right pin or badge */}
                      {note.sealText && (
                        <div className="wax-seal absolute -top-3 -right-2.5 w-10 h-10 rounded-full flex items-center justify-center select-none rotate-6">
                          <span className="text-white text-xs font-serif font-bold uppercase select-none">
                            {note.sealText}
                          </span>
                        </div>
                      )}

                      {/* Sticker badge */}
                      {note.badge && (
                        <span className="absolute -top-3 left-6 shadow-xs bg-secondary hover:bg-primary text-white text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-secondary">
                          {note.badge}
                        </span>
                      )}

                      {/* Floating Indicator icon */}
                      {note.icon && (
                        <span className="material-symbols-outlined text-secondary/35 text-xl mb-3 block material-fill">
                          {note.icon}
                        </span>
                      )}

                      {/* Sweet text content */}
                      <p className="font-handwriting text-2xl text-primary leading-relaxed font-medium">
                        {note.text}
                      </p>

                      {/* Footer interaction count drawer */}
                      <div className="mt-4 pt-3 border-t border-secondary/10 flex justify-between items-center select-none text-[10px] font-sans text-on-surface-variant/70">
                        <span className="italic opacity-80 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">edit_note</span>
                          Note douce
                        </span>
                        <div className="flex items-center gap-1 text-red-400 group">
                          <span className="material-symbols-outlined text-xs material-fill group-hover:scale-125 transition-transform">
                            favorite
                          </span>
                          <span className="font-mono font-bold">
                            {likes[note.id] || 0}
                          </span>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHAPTER 4 : TA GALERIE */}
        {currentChapterId === 'ch4' && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Header intro */}
            <div className="text-center mb-16">
              <div className="flex justify-center items-center gap-3 mb-3">
                <div className="h-px w-10 bg-secondary/35"></div>
                <span className="font-sans text-[10px] tracking-widest text-secondary font-bold uppercase">Chapitre Quatre</span>
                <div className="h-px w-10 bg-secondary/35"></div>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary italic leading-tight">
                Ta galerie
              </h2>
              <p className="font-sans font-light text-on-surface-variant text-sm md:text-base max-w-xl mx-auto mt-4 leading-relaxed">
                "Tu es une très belle personne et je t'aime vraiment"
              </p>
              <p className="text-[11.5px] font-sans font-semibold tracking-wider text-secondary uppercase mt-4 animate-pulse select-none flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-sm animate-bounce">rocket_launch</span>
                <span>Survole un polaroid pour lancer sa vidéo • Clique pour l'agrandir</span>
              </p>
            </div>
 
            {/* Polaroid Masonry layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto select-text pb-12">
              {galleryItems.map((photo, index) => {
                return (
                  <div
                    key={photo.id}
                    onClick={() => openPhotoLightbox(photo)}
                    className="cursor-zoom-in"
                  >
                    <article
                      className={`parchment-texture p-5 rounded-2xl shadow-md hover:shadow-xl border border-secondary/10 relative hover:scale-[1.03] active:scale-99 transition-all duration-300 max-w-sm mx-auto ${
                        photo.tilt === 'left' ? 'polaroid-tilt-left' : photo.tilt === 'right' ? 'polaroid-tilt-right' : ''
                      }`}
                    >
                      {/* Numbering above each video */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-serif text-[11px] font-bold tracking-wider text-secondary flex items-center gap-1 uppercase select-none">
                          <span className="text-secondary/50 font-mono text-[10px]">#</span>{index + 1}
                        </span>
                        <span className="material-symbols-outlined text-secondary/35 text-sm select-none">push_pin</span>
                      </div>

                      {/* Image/Video compartment */}
                      <div className="aspect-square bg-surface-container overflow-hidden rounded-xl border border-outline-variant/15 shadow-inner relative group/video">
                        {photo.videoUrl ? (
                          <div className="w-full h-full relative">
                            {/* Native HTML5 Video Element with poster backing */}
                            <video
                              src={photo.videoUrl}
                              poster={photo.imageUrl}
                              loop
                              playsInline
                              preload="auto"
                              className="w-full h-full object-cover transition-all duration-300"
                              onMouseEnter={(e) => {
                                e.currentTarget.muted = false;
                                e.currentTarget.play().catch(err => console.log('Video play error on hover:', err));
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.pause();
                              }}
                            />
                            {/* Hover overlay hint */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs text-white text-[9.5px] font-sans font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full pointer-events-none select-none group-hover/video:opacity-0 transition-opacity duration-300 shadow-sm">
                              <span className="material-symbols-outlined text-[11px] animate-[pulse_1.5s_infinite] text-secondary">videocam</span>
                              <span>Survoler</span>
                            </div>
                            {/* Playing indicator */}
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover/video:opacity-100 flex items-center gap-1.5 bg-secondary text-white text-[9.5px] font-sans font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full pointer-events-none select-none transition-opacity duration-300 shadow-sm animate-pulse">
                              <span className="material-symbols-outlined text-[10px] animate-[spin_2s_linear_infinite] text-white">sync</span>
                              <span>Lecture</span>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={photo.imageUrl}
                            alt={photo.imageAlt}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            style={{ contentVisibility: 'auto' }}
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>

                      {/* Comment badges indicators */}
                      {photo.comments && photo.comments.length > 0 && (
                        <div className="absolute top-3 left-3 flex items-center justify-center bg-secondary text-white text-[10px] font-mono font-bold w-6 h-6 rounded-full ring-2 ring-white shadow-md">
                          {photo.comments.length}
                        </div>
                      )}
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHAPTER 5 : CELEBRATION JOYEUX ANNIVERSAIRE */}
        {currentChapterId === 'ch5' && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            {/* Celebration mock header */}
            <section className="text-center mb-12 select-none relative z-10">
              <div className="mb-4 opacity-75">
                <span className="material-symbols-outlined text-secondary scale-150 animate-[spin_10s_linear_infinite]">local_florist</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-extrabold gold-foil-text leading-tight tracking-tight mb-4">
                Joyeux anniversaire {nickname}
              </h2>
              <div className="flex justify-center items-center gap-3">
                <div className="h-px w-12 bg-secondary/30"></div>
                <span className="font-sans text-[11px] font-bold tracking-widest text-secondary uppercase">Chapitre Cinq</span>
                <div className="h-px w-12 bg-secondary/30"></div>
              </div>
            </section>

            {/* Immersive Scroll Letter and Wishes Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative select-text mb-12">
              
              {/* Romantic Letter Scroll column */}
              <div className="lg:col-span-7">
                <article className="parchment-texture px-6 py-8 md:p-10 rounded-2xl shadow-xl border border-secondary/15 relative overflow-hidden">
                  
                  {/* Subtle Spine fold shadow */}
                  <div className="absolute inset-y-0 left-0 w-8 gutter-shadow pointer-events-none opacity-45"></div>

                  <div className="mb-6 border-b border-secondary/15 pb-4 text-center">
                    <span className="material-symbols-outlined text-secondary animate-[pulse_2s_infinite]">celebration</span>
                    <h3 className="font-serif font-bold text-lg text-primary uppercase tracking-wider mt-1">
                      Une lettre douce pour toi
                    </h3>
                  </div>

                  <div className="font-handwriting text-2xl text-primary leading-relaxed space-y-6 text-justify">
                    <p className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                      Chaque instant à tes côtés est un cadeau précieux que je chéris plus que tout au monde.
                    </p>
                    <p className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                      Aujourd'hui, nous célébrons non seulement ta naissance, mais aussi la lumière merveilleuse que tu apportes dans ma vie chaque jour. Ton sourire efface mes doutes et tes bras me redonnent de la force.
                    </p>
                    <p className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                      Je t'aime infiniment, maintenant et pour tous les jours à venir. Joyeux anniversaire, mon amour, ma douceur.
                    </p>
                    <p className="text-right font-bold text-secondary mt-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
                      Ton Amour ❤
                    </p>
                  </div>
                  
                  {/* Floral footer watermark ornament */}
                  <div className="mt-8 pt-4 border-t border-secondary/10 text-center opacity-40 select-none">
                    <span className="material-symbols-outlined text-3xl">local_florist</span>
                  </div>
                </article>

                {/* Call to action confetti burster */}
                <div className="mt-6 flex flex-col items-center select-none">
                  <button
                    onClick={triggerBurst}
                    className="group px-6 py-3.5 bg-secondary hover:bg-primary text-white rounded-full font-serif font-semibold text-sm shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:scale-95 flex items-center gap-2 transition-all duration-300"
                  >
                    <span className="material-symbols-outlined text-lg material-fill">celebration</span>
                    Chanter et souffler la bougie !
                  </button>
                  <span className="text-[10px] font-sans text-on-surface-variant/60 mt-2.5">
                    (Cliquez ci-dessus pour déclencher une averse de cœurs et de carillons !)
                  </span>
                </div>
              </div>

              {/* Bachira Couple Wish Book Pool Column */}
              <div className="lg:col-span-5 relative">
                <div className="bg-surface border border-secondary/10 shadow-lg rounded-2xl p-6 relative">
                  <div className="border-b border-secondary/15 pb-3 mb-4">
                    <h3 className="font-serif text-lg font-bold text-secondary flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl material-fill">spa</span>
                      Notre Boîte à Rêves
                    </h3>
                    <p className="text-xs text-on-surface-variant font-sans mt-1">
                      Une liste partagée de vœux, aventures, et moments à programmer ou accomplir ensemble cette année !
                    </p>
                  </div>

                  {/* Add Wish form input */}
                  <form onSubmit={handleAddWish} className="mb-4 flex gap-2">
                    <input
                      type="text"
                      maxLength={60}
                      required
                      placeholder="Nouveau vœu (ex: Regarder les étoiles)"
                      value={newWishText}
                      onChange={(e) => setNewWishText(e.target.value)}
                      className="flex-grow bg-white/75 px-3 py-2 border border-outline-variant/60 text-xs rounded-xl text-primary focus:outline-none focus:border-secondary placeholder:text-on-surface-variant/40"
                    />
                    <button
                      type="submit"
                      className="bg-secondary hover:bg-primary text-white text-xs font-semibold px-3 py-2 rounded-xl"
                      title="Ajouter un vœu"
                    >
                      Ajouter
                    </button>
                  </form>

                  {/* Wishes pool stream checklist */}
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 select-text custom-scrollbar">
                    {wishes.length === 0 ? (
                      <div className="text-center py-6 text-xs text-on-surface-variant/60 italic font-handwriting">
                        Aucun vœu formulé... note ton premier souhait !
                      </div>
                    ) : (
                      wishes.map((wish) => (
                        <div
                          key={wish.id}
                          onClick={() => handleToggleWish(wish.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                            wish.completed
                              ? 'bg-secondary/10 border-secondary/15 text-on-surface-variant line-through opacity-70'
                              : 'bg-surface-container-lowest border-secondary/5 hover:border-secondary/20 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-sm text-secondary">
                              {wish.completed ? 'check_box' : 'check_box_outline_blank'}
                            </span>
                            <span className="text-xs font-sans font-medium line-clamp-2">
                              {wish.text}
                            </span>
                          </div>
                          
                          <button
                            onClick={(e) => handleDeleteWish(wish.id, e)}
                            className="text-on-surface-variant/60 hover:text-red-500 hover:scale-105 active:scale-90 transition-transform p-1"
                            title="Supprimer ce vœu"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Staggered Floating polaroid mockup illustrations in Chapter 5 background */}
                <div className="absolute top-[410px] left-[-32px] w-36 h-44 bg-white p-2 pb-8 shadow-md rotate-[-8deg] border border-secondary/10 pointer-events-none select-none hidden lg:block">
                  <div className="w-full h-full bg-surface-container overflow-hidden rounded-xs">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJeXlQBP1j_M2Tpyawp42SNEeHrq-eAhEvhNGgvkWauuoLGjtnseu9aW3DknXVa3jJ6XzQcile0yOTjuZHlsl4gzwdyvnEA8vCQSdYm0YsIYQleOInKR7P5CP5CB48zBQpXI6FNnoTw8ig5Fg_4aNjGjrQf47HqjmJ612P24vSX4IDGiiLiN10G5mjho39jk-chUp_hZiME4mSBcL5Tbpjqc3Ks_-s8BiUh-pudsxelyMskJGrpRJGq0kQm2jEQ_qOLFkj4ytZ668"
                      alt="Nostalgic retro couples sunset"
                      className="w-full h-full object-cover rounded-xs"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="absolute top-[370px] right-[-32px] w-36 h-44 bg-white p-2 pb-8 shadow-md rotate-[6deg] border border-secondary/10 pointer-events-none select-none hidden lg:block">
                  <div className="w-full h-full bg-surface-container overflow-hidden rounded-xs">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTTz2m-klljt_joh9aHV9EuvEaBmu8_x4jXzvLFYng-HvT8EtrFKfQjeAzD6y0anHWa6NeILDUlQQ5RscQpLxRW-VWlMyKJFfzqBFuQceOtrVBk1ou5X7pGZUiiW54nYYKq1BKUy2iKec6tMBFWW6b7OsRJJv47BIXfs3ZF0YG8DpLeokeX10nozFJoRIgb5Ru_4nieYR6BWJlanTBZZOMnBs081qD8S7De8OHagxHfkZBTNULi2F9grai2IXFhZXc-nIIdJ1AxT4"
                      alt="Holding hands close-up sunset"
                      className="w-full h-full object-cover rounded-xs"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Dynamic page navigator controls */}
        <div className="mt-16 pt-8 border-t border-secondary/10 flex flex-col items-center gap-4 select-none">
          <div className="h-6 w-[1px] bg-secondary/30"></div>
          
          <button
            onClick={() => navigateToChapter(nextChapterMap[currentChapterId])}
            className="group flex flex-col items-center gap-2 hover:opacity-85 active:scale-98 transition-all"
            aria-label="Tourner la page de l'album"
          >
            <span className="font-epilogue text-[10px] font-semibold tracking-widest text-on-surface-variant uppercase">
              {currentChapterId === 'ch5' ? 'RECOMMENCER L\'HISTOIRE' : 'TOURNER LA PAGE'}
            </span>
            <span className="material-symbols-outlined text-secondary hover:text-primary animate-bounce text-xl">
              {currentChapterId === 'ch5' ? 'double_arrow_up' : 'keyboard_double_arrow_down'}
            </span>
          </button>
        </div>

      </main>

      {/* Elegant Page Footer */}
      <footer className="w-full py-6 mt-12 bg-surface/35 border-t border-secondary/15 flex flex-col items-center gap-2 select-none">
        <p className="font-epilogue text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
          Fait avec amour pour {nickname} • 9 Juin 2026
        </p>
        <div className="flex gap-4 items-center text-xs font-sans text-on-surface-variant/75 text-[10px] font-semibold uppercase tracking-wider">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-secondary transition-colors">
            Mentions Légales
          </a>
          <span className="text-secondary/40 select-none">•</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-secondary transition-colors">
            Confidentialité
          </a>
        </div>
      </footer>

      {/* SOMMAIRE DRAWER SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chapters={DEFAULT_CHAPTERS}
        currentChapterId={currentChapterId}
        onSelectChapter={navigateToChapter}
      />

      {/* NEW DISK SUBMISSION MODAL FORM */}
      <MemoryFormModal
        isOpen={memoryModalOpen}
        onClose={() => setMemoryModalOpen(false)}
        onAddMemory={handleAddMemory}
      />

      {/* DETAIL LIGHTBOX COMPONENT FOR PHOTOS */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        item={activeLightboxItem}
      />

      {/* EMBEDDED MEMORY MOVIES PLAYER MODAL */}
      <VideoPlayerModal
        isOpen={videoPlayerOpen}
        onClose={() => setVideoPlayerOpen(false)}
        video={activeVideoItem}
      />

      {/* CUTE FLOATING PINK HEART BURST BUTTON */}
      <button
        onClick={triggerBurst}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-secondary hover:shadow-xl hover:scale-110 active:scale-90 transition-all duration-300 z-50 animate-pulse cursor-pointer group"
        aria-label="Pluie de cœurs"
        title="Clique pour une pluie de cœurs !"
      >
        <span className="material-symbols-outlined text-2xl material-fill group-hover:animate-ping absolute opacity-30">
          favorite
        </span>
        <span className="material-symbols-outlined text-2xl material-fill z-10">
          favorite
        </span>
      </button>

    </div>
  );
}
