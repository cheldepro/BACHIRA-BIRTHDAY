import { Chapter } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  chapters,
  currentChapterId,
  onSelectChapter,
}: SidebarProps) {
  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div
          id="drawer-overlay"
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        id="drawer"
        className={`fixed top-0 right-0 h-full w-80 bg-surface-container-low border-l border-outline-variant/30 shadow-2xl z-55 transition-transform duration-300 ease-in-out flex flex-col py-8 rounded-l-3xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-8 mb-8 flex justify-between items-center border-b border-secondary/15 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">menu_book</span>
            <h2 className="font-serif font-semibold text-xl text-primary">Sommaire</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined size-5">close</span>
          </button>
        </div>

        {/* Chapters list in old book style with dotted leaders */}
        <nav className="flex-1 flex flex-col gap-3 px-4 overflow-y-auto">
          {chapters.map((chapter, index) => {
            const isActive = currentChapterId === chapter.id;
            return (
              <button
                key={chapter.id}
                onClick={() => {
                  onSelectChapter(chapter.id);
                  onClose();
                }}
                className={`w-full group text-left px-4 py-3 rounded-xl transition-all duration-300 flex flex-col gap-1 active:scale-98 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container border border-secondary/20 shadow-md translate-x-[-4px]'
                    : 'hover:bg-surface-container/50 text-on-surface-variant hover:text-primary'
                }`}
              >
                <div className="flex items-center justify-between w-full font-serif text-sm font-semibold tracking-wider font-epilogue uppercase text-[11px] text-secondary/70">
                  <span>{chapter.num}</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    {isActive ? '● En cours' : `CH. 0${index + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1 pr-1">
                  <span
                    className={`material-symbols-outlined size-6 text-xl transition-colors ${
                      isActive ? 'text-primary material-fill' : 'text-on-surface-variant/60 group-hover:text-primary'
                    }`}
                  >
                    {chapter.icon}
                  </span>
                  <span className="font-serif text-base font-semibold leading-tight flex-grow truncate">
                    {chapter.title}
                  </span>
                </div>
                
                {/* Subtle description */}
                <span className="text-[11px] font-sans text-on-surface-variant/70 pl-9 line-clamp-1">
                  {chapter.description.replace(/"/g, '')}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Cozy footer annotation */}
        <div className="px-8 mt-6 pt-6 border-t border-secondary/10 text-center">
          <p className="font-sans text-[11px] text-on-surface-variant/60 italic">
            "Chaque chapitre est un battement de cœur."
          </p>
          <div className="mt-2 flex justify-center gap-1 opacity-40">
            <span className="material-symbols-outlined text-[10px] material-fill text-secondary">favorite</span>
            <span className="material-symbols-outlined text-[10px] material-fill text-secondary">local_florist</span>
            <span className="material-symbols-outlined text-[10px] material-fill text-secondary">favorite</span>
          </div>
        </div>
      </aside>
    </>
  );
}
