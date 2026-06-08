import { Chapter, Memory, LoveNote, GalleryItem, VideoItem } from './types';

export const DEFAULT_CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    num: 'CHAPITRE UN',
    title: 'Notre rencontre',
    description: 'Le jour où nos chemins se sont croisés...',
    icon: 'history_edu'
  },
  {
    id: 'ch2',
    num: 'CHAPITRE DEUX',
    title: 'Ces photos qui font mes journées',
    description: 'On n’a pas encore eu de grands moments forts au sens classique, mais les photos que tu m’envoyais embellissaient chacune de mes journées...',
    icon: 'timeline'
  },
  {
    id: 'ch3',
    num: 'CHAPITRE TROIS',
    title: "Pourquoi je t'aime",
    description: '"Parce que tu es ce que je désire le plus au monde..."',
    icon: 'favorite'
  },
  {
    id: 'ch4',
    num: 'CHAPITRE QUATRE',
    title: 'Ta galerie',
    description: '"Tu es une très belle personne et je t\'aime vraiment"',
    icon: 'photo_library'
  },
  {
    id: 'ch5',
    num: 'CHAPITRE CINQ',
    title: 'Joyeux anniversaire',
    description: 'Une célébration de ton sourire, de ta lumière et de notre amour infini.',
    icon: 'celebration'
  }
];

export const DEFAULT_CHAPTER_ONE = {
  quote: '"Juste un regard posé sur toi sans faire exprès, et déjà du monde autour pour nous capter..."',
  paragraphs: [
    "Tout a commencé lors d'une simple soirée. Au tout début, pour être tout à fait honnête, on ne s'est pas vraiment calculé, chacun faisait sa vie dans son coin. Mais à un moment, sans même y réfléchir ou le faire exprès, mes yeux se sont posés sur toi. Je t'ai fixé naturellement, sans grande intention, juste un regard spontané qui s'est accroché au tien.",
    "Ce sont d'ailleurs les gens autour de nous qui l'ont tout de suite remarqué et qui me l'ont fait remarquer ! De ton côté, au début, tu ne m'aimais vraiment pas et tu faisais juste semblant (on se sait !). Et même si aujourd'hui on n'est pas vraiment ensemble au sens classique ou au sens large du terme, ce lien qu'on a construit reste unique, précieux et tellement à nous."
  ],
  imageUrl: 'https://i.ibb.co/4RgkcqFm/31630b9d-f776-424c-81d8-ec3cf97ba5fa.jpg',
  imageAlt: 'Our first glance at a lively gathering'
};

export const DEFAULT_MEMORIES: Memory[] = [
  {
    id: 'm1',
    chapterId: 'ch2',
    date: '',
    title: 'Une pépite absolue',
    description: 'Franchement, quand t’envoies ce genre de photo, tu refais ma journée entière...',
    imageUrl: 'https://i.ibb.co/4RgkcqFm/31630b9d-f776-424c-81d8-ec3cf97ba5fa.jpg',
    imageAlt: 'Sweet selfie shared by Bachira',
    tilt: 'left'
  },
  {
    id: 'm2',
    chapterId: 'ch2',
    date: '',
    title: 'Sourire magique',
    description: 'Regarde-moi cette bouille... Impossible de ne pas craquer en voyant ton visage !',
    imageUrl: 'https://i.ibb.co/nNQYFmQr/IMG-9815.png',
    imageAlt: 'Cute moment sent by Bachira',
    tilt: 'right'
  },
  {
    id: 'm3',
    chapterId: 'ch2',
    date: '',
    title: 'Une beauté à couper le souffle',
    description: 'Regarde-moi cette beauté pure... Tu es absolument magnifique, une vraie merveille pour les yeux !',
    imageUrl: 'https://i.ibb.co/cKP1q7Dv/IMG-9817.png',
    imageAlt: 'Complétement fasciné par ta beauté',
    tilt: 'right'
  },
  {
    id: 'm4',
    chapterId: 'ch2',
    date: '',
    title: 'Quand tu danses la biama...',
    description: 'J’adore tellement quand tu me partages tes vidéos en train de danser la biama. Tu es tellement gracieuse et rayonnante !',
    imageUrl: 'https://i.ibb.co/RTRC6b1S/IMG-9825.png',
    imageAlt: 'Cette vidéo incroyable où tu danses',
    tilt: 'left'
  }
];

export const DEFAULT_LOVE_NOTES: LoveNote[] = [
  {
    id: 'ln1',
    text: "En premier, j'aime trop la façon dont tu rigoles bêtement... C'est mon moment préféré !",
    badge: 'EN PREMIER',
    icon: 'favorite',
    sealText: '1',
    tilt: 'left',
    floatClass: 'note-float'
  },
  {
    id: 'ln2',
    text: "En deuxième, j'adore quand tu te confies à moi et que tu me parles de tes journées, ça me fait tellement plaisir.",
    badge: 'EN DEUXIÈME',
    icon: 'auto_awesome',
    tilt: 'right',
    floatClass: 'note-float-delayed'
  },
  {
    id: 'ln3',
    text: "En troisième, j'aime le fait que tu ne sois pas toute douce là... Ton petit caractère fait tout ton charme !",
    badge: 'EN TROISIÈME',
    icon: 'favorite',
    tilt: 'none',
    floatClass: 'note-float'
  },
  {
    id: 'ln4',
    text: "Et en dernier, je t'aime tout simplement parce que tu es toi, unique et parfaite comme ça.",
    badge: 'EN DERNIER',
    icon: 'celebration',
    sealText: '❤',
    tilt: 'right',
    floatClass: 'note-float-delayed'
  }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Nos premiers pas ensemble',
    imageUrl: 'https://i.ibb.co/4RgkcqFm/31630b9d-f776-424c-81d8-ec3cf97ba5fa.jpg',
    imageAlt: 'Nos premiers pas ensemble',
    videoUrl: 'https://api-f.streamable.com/api/v1/videos/k7tuxl/mp4',
    tilt: 'left',
    comments: []
  },
  {
    id: 'g2',
    title: 'Café et conversations',
    imageUrl: 'https://i.ibb.co/nNQYFmQr/IMG-9815.png',
    imageAlt: 'Café et conversations',
    videoUrl: 'https://api-f.streamable.com/api/v1/videos/cvxixq/mp4',
    tilt: 'right',
    comments: []
  },
  {
    id: 'g3',
    title: 'Le silence partagé',
    imageUrl: 'https://i.ibb.co/cKP1q7Dv/IMG-9817.png',
    imageAlt: 'Le silence partagé',
    videoUrl: 'https://api-f.streamable.com/api/v1/videos/mo68ct/mp4',
    tilt: 'left',
    comments: []
  },
  {
    id: 'g4',
    title: 'Tes éclats de rire',
    imageUrl: 'https://i.ibb.co/RTRC6b1S/IMG-9825.png',
    imageAlt: 'Tes éclats de rire',
    videoUrl: 'https://api-f.streamable.com/api/v1/videos/1bplyt/mp4',
    tilt: 'right',
    comments: []
  },
  {
    id: 'g5',
    title: 'Ton rire si doux',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Ton rire si doux',
    videoUrl: 'https://api-f.streamable.com/api/v1/videos/szmq1g/mp4',
    tilt: 'left',
    comments: []
  },
  {
    id: 'g6',
    title: 'Complices à chaque instant',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Complices à chaque instant',
    videoUrl: 'https://api-f.streamable.com/api/v1/videos/6j2oep/mp4',
    tilt: 'right',
    comments: []
  },
  {
    id: 'g7',
    title: 'Un instant suspendu',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Un instant suspendu',
    videoUrl: 'https://api-f.streamable.com/api/v1/videos/bn3dyi/mp4',
    tilt: 'left',
    comments: []
  },
  {
    id: 'g8',
    title: 'Douce folie',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Douce folie',
    videoUrl: 'https://api-f.streamable.com/api/v1/videos/e5ipaf/mp4',
    tilt: 'right',
    comments: []
  }
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: 'SOIRÉE AU FEU DE BOIS',
    subtitle: 'La chaleur des étincelles sous la voûte céleste.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfci6Oav7kDx7oSQyrGnYsfHKixgS-YdeZJIfa0f9kmeSpzGB7aMHzufBsPAXlMNTyfCfg7RfCZF4UhADfdarcZSOUQhJZHmnibIcZrcNyq9-OzC4jmw6rdAxFWzWAstmcKZk812_fu5yAQuucCXOCxGPhQKTjhIP6Pte5Ppa7f9oiK5TM_GLwYYrfD1SqkNXa-XAjlMoA__U1tYDkewo0JuemL4IKszXf-HddI3ea7qtey-fAkw5atnIXsJfb2OJq3woJaxLzuvk',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // beautiful fallback movie clip!
    imageAlt: 'Peaceful evening campfire in a dark blue night sky'
  },
  {
    id: 'v2',
    title: 'UN APRÈS-MIDI DE PLUIE',
    subtitle: 'Le clapotis des gouttes et ton épaule contre la mienne.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBebCytNbm2U2aDn56xoe-QHsckSHcoGOVc8YSkDzOuEGvgcz0wX6hyStCVBMHhUaiyXw7e8hVoueaqd7hMzCdQFAUzuZR9ZMuBGnd_XaByVum1TNL15XmOr008XdpycNL-3PSEKOc2CLaD7tdvQoJJg_daO4clMCFF7AGL_sLSe1e0XTSjUEJABwVdcGglJ82DYLivTpP44TZ25mXf7xIW744zWMKHl834lUMJIihPekYUnt3GHT1UlG1uKn8QNTd_nazvQuOUCwg',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    imageAlt: 'Raindrops on window pane with blurry cozy warm lighting'
  }
];

export const STICKER_ICONS = [
  { name: 'favorite', label: 'Cœur' },
  { name: 'local_florist', label: 'Fleur' },
  { name: 'celebration', label: 'Célébration' },
  { name: 'auto_awesome', label: 'Étoiles' },
  { name: 'home', label: 'Maison' },
  { name: 'schedule', label: 'Horloge' },
  { name: 'music_note', label: 'Note' },
  { name: 'pets', label: 'Empreintes' }
];
