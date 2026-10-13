/**
 * ============================================================================
 * CENTRAL WEDDING CONFIGURATION FILE
 * ============================================================================
 * Edit this file to customize all names, dates, venue coordinates, timeline,
 * entourage lists, dress code swatches, photos, and reminders.
 * ============================================================================
 */

export interface TimelineItem {
  time: string;
  title: string;
  subtitle: string;
  icon: 'rings' | 'camera' | 'utensils' | 'cake' | 'music' | 'sparkles';
}

export interface SponsorPair {
  ninang: string;
  ninong: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
  attireTip: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category: 'filmstrip-1' | 'filmstrip-2' | 'featured' | 'polaroid';
  aspect?: 'portrait' | 'landscape';
  chapterTag?: string;
  storyNote?: string;
}

export interface StoryChapter {
  id: string;
  chapterNumber: string;
  seasonTag: string;
  title: string;
  story: string;
  quote: string;
  layout: 'polaroid-note' | 'scrapbook-duo' | 'cinema-strip' | 'forever-arch';
  photos: {
    id: string;
    url: string;
    caption: string;
    frameCode?: string;
  }[];
}

export interface GuestWish {
  id: string;
  name: string;
  relationship: string;
  message: string;
  attendance: 'attending' | 'regrets';
  guestsCount: number;
  songRequest?: string;
  createdAt: string;
}

export interface LyricLine {
  time: number; // Start time in seconds
  text: string;
}

export const weddingConfig = {
  // 1. COUPLE DETAILS
  couple: {
    groomFirstName: 'Cydrill',
    groomFullName: 'Cydrill Geneza',
    groomLastName: 'Geneza',
    brideFirstName: 'Mary Grace',
    brideFullName: 'Mary Grace Ramos Terminez',
    brideLastName: 'Terminez',
    displayTitle: 'Cydrill and Mary Grace',
    nuptialTitle: 'Geneza – Terminez',
    monogram: 'C & M',
    tagline: 'are getting married!',
    envelopeGreeting: 'You are invited!',
    envelopePrompt: 'Tap and hold the wax seal to open your invitation',
    hashtag: '#AmazingGRACEWithCYDRILL',
    closingMessage: 'We would be honoured to share this special day with you!',
    storyQuote:
      '“And over all these virtues put on love, which binds them all together in perfect unity.” — Colossians 3:14',
  },

  // 1B. BACKGROUND MUSIC & SCRIPTURE REFLECTIONS
  music: {
    title: 'Goodness of God',
    artist: 'Piano & Cello Instrumental',
    displayLabel: '“Goodness of God” (Piano & Cello)',
    audioUrl: '/audio/goodness-of-god-piano-cello.mp3',
    youtubeUrl: 'https://www.youtube.com/watch?v=hmDb8oq8osI',
    lyrics: [
      { time: 0.0, text: '♪ Goodness of God • Piano & Cello Instrumental ♪' },
      {
        time: 18.0,
        text: '“I love You, Lord, for Your mercy never fails me; all my days, I’ve been held in Your hands.”',
      },
      {
        time: 55.0,
        text: '“From the moment that I wake up until I lay my head, oh, I will sing of the goodness of God.”',
      },
      {
        time: 95.0,
        text: '“All my life You have been faithful, and all my life You have been so, so good.”',
      },
      {
        time: 135.0,
        text: '“With every breath that I am able, oh, I will sing of the goodness of God.”',
      },
      {
        time: 175.0,
        text: '“Your goodness is running after, it’s running after me.”',
      },
      {
        time: 210.0,
        text: '♪ Cydrill and Mary Grace • December 21, 2026 ♪',
      },
    ] as LyricLine[],
  },

  // 2. DATE & TIME DETAILS
  schedule: {
    // ISO date string for the live countdown & calendar invite
    isoDate: '2026-12-21T14:30:00+08:00',
    endIsoDate: '2026-12-21T20:30:00+08:00',
    dayOfWeek: 'MONDAY',
    dateFormatted: '21st DECEMBER 2026',
    timeFormatted: 'at 2:30 in the afternoon',
    shortDate: '12 . 21 . 2026',
  },

  // 3. VENUE & LOCATION GUIDE
  location: {
    sectionTitle: 'Location Guide',
    subtitle: 'Ceremony and Reception will be held at:',
    venueName: "SHAIRA'S PLACE RESORT",
    addressLine1: "Shaira's Hall • Nibaliw West Vidal Street",
    addressLine2: 'San Fabian, Pangasinan',
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Shaira's+Place+Resort+Nibaliw+West+San+Fabian+Pangasinan",
    embedMapUrl:
      "https://www.google.com/maps?q=Shaira's+Place+Resort,+Nibaliw+West,+San+Fabian,+Pangasinan&output=embed",
    travelNote:
      "Both Ceremony and Reception will take place at Shaira's Hall (Shaira's Place Resort) along Vidal Street, Nibaliw West, San Fabian, Pangasinan. Ceremony begins promptly at 2:30 PM.",
    venuePhoto: '/photos/shairas-hall-exterior.jpg',
    leftPhoto: '/photos/shairas-hall-ceremony.jpg',
    rightPhoto: '/photos/shairas-hall-exterior.jpg',
  },

  // 4. WEDDING TIMELINE (Moved 30 minutes earlier, starting at 2:30 PM)
  timeline: [
    {
      time: '2:30 PM',
      title: 'Ceremony',
      subtitle: 'Exchange of marriage vows',
      icon: 'rings',
    },
    {
      time: '3:30 PM',
      title: 'Photo Session',
      subtitle: 'Portraits with family & entourage',
      icon: 'camera',
    },
    {
      time: '4:00 PM',
      title: 'Program',
      subtitle: 'Grand entrance, toasts & program',
      icon: 'music',
    },
    {
      time: '5:30 PM',
      title: 'Dinner',
      subtitle: 'Wedding feast & fellowship',
      icon: 'utensils',
    },
    {
      time: '6:30 PM',
      title: 'Celebration',
      subtitle: 'Music, dancing & sparkling send-off',
      icon: 'sparkles',
    },
  ] as TimelineItem[],

  // 5. ENTOURAGE / NUPTIAL ROLL
  entourage: {
    groomGrandparents: [] as { name: string; place: string }[],
    brideGrandparents: [] as { name: string; place: string }[],
    groomParents: [
      'RUFINO GENEZA JR. (+)',
      'CRESENCIA GENEZA',
    ],
    brideParents: [
      'HERMOGENEZ TERMINEZ SR. (+)',
      'REMEDIOS TERMINEZ',
    ],
    brideParentsPlace: '',
    principalSponsorsSubtitle: 'TO STAND AS PRINCIPAL WITNESS TO OUR EXCHANGE OF VOWS',
    principalSponsors: [
      { ninong: 'VICE MAYOR CONSTANTE AGBAYANI', ninang: 'EMILY CASILLA' },
      { ninong: 'ALVIN IDION', ninang: 'BRENDA IDION' },
      { ninong: 'PTR. VICTORIANO GARCIA', ninang: 'JACEL ADELA' },
      { ninong: 'ROLANDO DAMIAN', ninang: 'EDENIA DAMIAN' },
      { ninong: 'ROLAND GAJUSAN', ninang: 'LOURDES BUSTAMANTE' },
      { ninong: 'FERNANDO CORPUZ', ninang: 'ZENAIDA CORPUZ' },
      { ninong: '', ninang: 'PRISCILLA BATO-ESCAMA' },
    ] as SponsorPair[],
    secondarySponsorsSubtitle: 'TO ASSIST US IN OUR NEEDS & GUIDE US IN OUR WAY',
    bestMan: 'MARLON LIBAO',
    matronsOfHonor: [
      'JUNAREIN BRUSAS',
      'KARLA MAE ANCHETA',
    ],
    candle: {
      title: 'CANDLE',
      subtitle: 'To light our path',
      members: ['BRYAN SERVITO', 'EMMIE LOU PARISTA'],
    },
    veil: {
      title: 'VEIL',
      subtitle: 'To clothe us as one',
      members: ['JAN DREX FABIA', 'HANNAH MAE MARZAN'],
    },
    cord: {
      title: 'CORD',
      subtitle: 'To bind us together',
      members: ['JOSHUA FLORES', 'AMELIA JOY DE VERA'],
    },
    groomsmen: [
      'BRYAN SERVITO',
      'DIOSDADO BATRINA',
      'JAN DREX FABIA',
      'JOSHUA FLORES',
    ],
    bridesmaids: [
      'EMMIE LOU PARISTA',
      'MELODY TERMINEZ',
      'HANNAH MAE MARZAN',
      'AMELIA JOY DE VERA',
    ],
    bearers: {
      ring: {
        title: 'RING BEARER',
        subtitle: 'To carry our symbol of love & God’s sacred covenant',
        name: 'EZRAEL TERMINEZ',
      },
      coin: {
        title: 'COIN BEARER',
        subtitle: 'To carry our symbol of God’s provision & shared stewardship',
        name: 'HART ANGELO CORTEZ',
      },
      bible: {
        title: 'BIBLE BEARER',
        subtitle: 'To carry the Word of God as the foundation of our home',
        name: 'CASPER PAGALING',
      },
    },
    flowerGirls: {
      title: 'Flower Girls',
      subtitle: 'To shower our aisle with flowers',
      members: [
        'ISAIAH LEANNE ANCHETA',
        'JARRAH RAELYN RAMOS',
        'SHEKINAH HALOG',
      ],
    },
    petOfHonor: null as { role: string; name: string; breedOrNote: string } | null,
  },

  // 6. DRESS CODE & COLOR PALETTE (Exact 4 colors from the couple's Details card)
  dressCode: {
    guests: {
      title: 'DRESS CODE',
      subtitle: 'SEMI-FORMAL / FORMAL ATTIRE',
      note: 'We kindly encourage our guests to wear semi-formal/formal attire with these colors on our special day.',
    },
    sponsors: {
      title: 'PRINCIPAL SPONSORS',
      subtitle: 'NINONG & NINANG ATTIRE GUIDE',
      ninang: {
        title: 'Ninangs',
        attire: 'Floor-length formal gowns in Champagne, Rose Gold, or Rose Beige.',
        note: 'We kindly ask to leave Sage Green for the bridesmaids.',
      },
      ninong: {
        title: 'Ninongs',
        attire: 'Barong Tagalog or a Charcoal Grey / Black Suit with a Blush Pink necktie.',
      },
    },
    swatches: [
      {
        name: 'Soft Blush Pink',
        hex: '#EACCCE',
        role: 'Blush Motif',
        attireTip: 'Romantic blush chiffon gowns, soft petal dresses, or delicate floral-toned coordinates.',
      },
      {
        name: 'Warm Coral Rose',
        hex: '#DF7F66',
        role: 'Coral Rose Motif',
        attireTip: 'Warm coral-rose dresses, terracotta-peach silk separates, or statement ties and pocket squares.',
      },
      {
        name: 'Deep Olive Sage',
        hex: '#6D7156',
        role: 'Deep Sage Motif',
        attireTip: 'Elegant floor-length olive-sage gowns, tailored blazers, or formal dark-sage coordinates.',
      },
      {
        name: 'Warm Moss Green',
        hex: '#9B9968',
        role: 'Botanical Olive',
        attireTip: 'Soft moss-olive dresses, light formal coordinates, or subtle botanical accessories.',
      },
    ] as ColorSwatch[],
  },

  // 7. REMINDERS (Gift Note, Unplugged Ceremony, Hashtag)
  reminders: {
    giftNote: {
      title: 'A NOTE ON GIFTS',
      message:
        'With all that we have, we’ve been truly blessed. Your presence and prayers are all that we request, but if you desire to give us nonetheless, a monetary gift is one we humbly request.',
      bankDetails: [] as { provider: string; accountName: string; accountNumber: string }[],
    },
    unplugged: {
      title: 'UNPLUGGED CEREMONY',
      message:
        'The greatest gift you can give us today is to be truly present. During the ceremony, please silence and tuck away all phones and cameras so our photographers can capture this sacred moment with you.',
    },
    hashtagNote: {
      title: 'OUR HASHTAG',
      message:
        'Help us capture the love! Please tag your photos and reels using our official wedding hashtag to help us document our best day ever!',
    },
  },

  // 8. PHOTOGRAPHY & GALLERY (All 46 Studio Prenup Portraits)
  photos: {
    heroPortrait: '/photos/grace-cydrill-enhanced-01.jpg',
    cameoPortrait: '/photos/grace-cydrill-04.jpg',
    heroSlides: [
      '/photos/grace-cydrill-enhanced-01.jpg',
      '/photos/grace-cydrill-04.jpg',
      '/photos/grace-cydrill-14.jpg',
      '/photos/grace-cydrill-33.jpg',
      '/photos/grace-cydrill-41.jpg',
      '/photos/grace-cydrill-enhanced-02.jpg',
    ],
    saveTheDateTriptych: [
      {
        url: '/photos/grace-cydrill-04.jpg',
        caption: 'Two hearts, one prayer',
      },
      {
        url: '/photos/grace-cydrill-enhanced-01.jpg',
        caption: 'Walking into forever',
      },
      {
        url: '/photos/grace-cydrill-33.jpg',
        caption: 'Always right beside you',
      },
    ],
    entourageBanner: '/photos/grace-cydrill-07.jpg',
    footerBanner: '/photos/grace-cydrill-45.jpg',
    storyIntro:
      'Every love story is beautiful, pero ours will always be our favorite—written in quiet prayers, patient waiting, and the unmistakable grace of God’s perfect timing.',
    storyChapters: [
      {
        id: 'chapter-1',
        chapterNumber: 'Chapter I',
        seasonTag: 'The Whispered Prayer',
        title: 'Before Our Hearts Even Met',
        story:
          'Long before our paths crossed, we were already praying for each other in our own quiet seasons. Hindi pa namin alam noon when or how our story would begin—ang prayer lang talaga namin kay Lord was for someone gentle, faithful, and true to walk through life with.',
        quote: '“Before I knew your voice, I prayed your heart…”',
        layout: 'polaroid-note',
        photos: [
          {
            id: 'photo-14',
            url: '/photos/grace-cydrill-14.jpg',
            caption: 'Two separate prayers, one shared story',
            frameCode: 'FRM 01A • THE BEGINNING',
          },
          {
            id: 'photo-05',
            url: '/photos/grace-cydrill-05.jpg',
            caption: 'Every whispered prayer led me to you',
            frameCode: 'FRM 01B • ANSWERED PRAYER',
          },
        ],
      },
      {
        id: 'chapter-2',
        chapterNumber: 'Chapter II',
        seasonTag: 'When Our Paths Crossed',
        title: 'A Simple Hello That Felt Like Home',
        story:
          'It started with easy conversations and effortless laughter, hanggang sa hindi na namin namalayan that we had become each other’s safe space. From our everyday kulitan to the quiet moments in between, being together never felt forced—ang gaan lang sa pakiramdam, like finally coming home.',
        quote: '“With you, kahit the simplest days feel like golden hour.”',
        layout: 'scrapbook-duo',
        photos: [
          {
            id: 'photo-01',
            url: '/photos/grace-cydrill-01.jpg',
            caption: 'Effortless laughter from day one',
            frameCode: 'FRM 02A • FIRST SPARK',
          },
          {
            id: 'photo-02',
            url: '/photos/grace-cydrill-02.jpg',
            caption: 'Every smile is brighter with you',
            frameCode: 'FRM 02B • PURE JOY',
          },
          {
            id: 'photo-34',
            url: '/photos/grace-cydrill-34.jpg',
            caption: 'Walking in step, laughing out loud',
            frameCode: 'FRM 02C • EASY RHYTHM',
          },
          {
            id: 'photo-35',
            url: '/photos/grace-cydrill-35.jpg',
            caption: 'Best friends & partners for life',
            frameCode: 'FRM 02D • BEST FRIENDS',
          },
        ],
      },
      {
        id: 'chapter-3',
        chapterNumber: 'Chapter III',
        seasonTag: 'Through Every Season',
        title: 'Rooted in Grace, Tested by Time',
        story:
          'Real love isn’t just about the kilig and the easy days—it’s built in choosing each other every single day. Through busy weeks, pagod, and every season of growth in between, we learned to be patient, keep God at the center, and build a love na pang-forever talaga.',
        quote: '“He wrote our story line by line, and called it holy, yours and mine.”',
        layout: 'cinema-strip',
        photos: [
          {
            id: 'photo-18',
            url: '/photos/grace-cydrill-18.jpg',
            caption: 'Still making each other kilig every day',
            frameCode: '35MM • 03A',
          },
          {
            id: 'photo-19',
            url: '/photos/grace-cydrill-19.jpg',
            caption: 'A love that still gives me butterflies',
            frameCode: '35MM • 03B',
          },
          {
            id: 'photo-22',
            url: '/photos/grace-cydrill-22.jpg',
            caption: 'Holding hands through every season',
            frameCode: '35MM • 03C',
          },
          {
            id: 'photo-28',
            url: '/photos/grace-cydrill-28.jpg',
            caption: 'Peace in every quiet moment with you',
            frameCode: '35MM • 03D',
          },
          {
            id: 'photo-38',
            url: '/photos/grace-cydrill-38.jpg',
            caption: 'Side by side, steady and true',
            frameCode: '35MM • 03E',
          },
          {
            id: 'photo-40',
            url: '/photos/grace-cydrill-40.jpg',
            caption: 'Always each other’s safe place',
            frameCode: '35MM • 03F',
          },
        ],
      },
      {
        id: 'chapter-4',
        chapterNumber: 'Chapter IV',
        seasonTag: 'The Answered Prayer',
        title: 'Two Souls Made One by Boundless Grace',
        story:
          'Looking back now, kitang-kita talaga ang kamay ni Lord in every detail that led us here. Kaya when the question of forever finally came, it was the easiest “Yes” of our lives. On December 21, 2026, we’re finally stepping into the covenant we once only whispered in prayer.',
        quote: '“God kept His word and brought me you.”',
        layout: 'forever-arch',
        photos: [
          {
            id: 'photo-41',
            url: '/photos/grace-cydrill-41.jpg',
            caption: 'The easiest “Yes” of our lives',
            frameCode: 'FRM 04A • THE PROMISE',
          },
          {
            id: 'photo-46',
            url: '/photos/grace-cydrill-enhanced-02.jpg',
            caption: 'Forever starts on December 21, 2026',
            frameCode: 'FRM 04B • OUR FOREVER',
          },
        ],
      },
    ] as StoryChapter[],
    gallery: [
      { id: 'photo-01', url: '/photos/grace-cydrill-01.jpg', caption: 'Effortless laughter from day one', category: 'filmstrip-1', chapterTag: 'Chapter II • First Spark', storyNote: 'Endless kulitan and easy laughter right from the very start.' },
      { id: 'photo-02', url: '/photos/grace-cydrill-02.jpg', caption: 'Every smile is brighter with you', category: 'filmstrip-1', chapterTag: 'Chapter II • Pure Joy', storyNote: 'With you, kahit the simplest moments turn into core memories.' },
      { id: 'photo-03', url: '/photos/grace-cydrill-03.jpg', caption: 'Reaching for your hand, always', category: 'filmstrip-1', chapterTag: 'Studio Session • Set I', storyNote: 'Two hearts learning to walk in the same rhythm.' },
      { id: 'photo-04', url: '/photos/grace-cydrill-04.jpg', caption: 'Two hearts, one prayer', category: 'featured', chapterTag: 'Save the Date • Portrait', storyNote: 'Standing side by side in the beauty of God’s perfect timing.' },
      { id: 'photo-05', url: '/photos/grace-cydrill-05.jpg', caption: 'Every whispered prayer led me to you', category: 'polaroid', chapterTag: 'Chapter I • The Whispered Prayer', storyNote: 'A promise held gently between our hands.' },
      { id: 'photo-06', url: '/photos/grace-cydrill-06.jpg', caption: 'Always right behind you', category: 'filmstrip-1', chapterTag: 'Studio Session • Set I', storyNote: 'A quiet promise that we’ll always have each other’s back.' },
      { id: 'photo-07', url: '/photos/grace-cydrill-07.jpg', caption: 'My safest place is beside you', category: 'featured', chapterTag: 'Nuptial Portrait • Set I', storyNote: 'Peace, warmth, and the joy of an answered prayer.' },
      { id: 'photo-08', url: '/photos/grace-cydrill-08.jpg', caption: 'Steady shoulders, gentle heart', category: 'filmstrip-1', chapterTag: 'Studio Session • Set I', storyNote: 'So grateful for a love that truly feels like home.' },
      { id: 'photo-09', url: '/photos/grace-cydrill-09.jpg', caption: 'Radiant in your love', category: 'filmstrip-1', chapterTag: 'Studio Session • Set I', storyNote: 'Counting down the days hanggang sa ating “I do.”' },
      { id: 'photo-10', url: '/photos/grace-cydrill-10.jpg', caption: 'The groom & the bouquet', category: 'filmstrip-1', chapterTag: 'Groom Portrait • Set I', storyNote: 'Ready to bring you flowers and laughter for a lifetime.' },
      { id: 'photo-11', url: '/photos/grace-cydrill-11.jpg', caption: 'A bride clothed in grace', category: 'filmstrip-1', chapterTag: 'Bridal Portrait • Set I', storyNote: 'Stepping into this new season with a grateful heart.' },
      { id: 'photo-12', url: '/photos/grace-cydrill-12.jpg', caption: 'Blush roses & bridal dreams', category: 'filmstrip-1', chapterTag: 'Bridal Portrait • Set I', storyNote: 'Every detail we once prayed for is finally coming to life.' },
      { id: 'photo-13', url: '/photos/grace-cydrill-13.jpg', caption: 'Under the bridal veil', category: 'filmstrip-1', chapterTag: 'Chapter I • The Beginning', storyNote: 'Looking ahead to the aisle that awaits us.' },
      { id: 'photo-14', url: '/photos/grace-cydrill-14.jpg', caption: 'Two separate prayers, one shared story', category: 'polaroid', chapterTag: 'Chapter I • The Whispered Prayer', storyNote: 'Long before our paths crossed, pinagpi-pray na namin ang isa’t isa.' },
      { id: 'photo-15', url: '/photos/grace-cydrill-15.jpg', caption: 'Proudly walking beside my bride', category: 'filmstrip-1', chapterTag: 'Studio Session • Set I', storyNote: 'Two souls made one by God’s boundless grace.' },
      { id: 'photo-16', url: '/photos/grace-cydrill-16.jpg', caption: 'Wrapped in love & answered prayers', category: 'filmstrip-1', chapterTag: 'Studio Session • Set I', storyNote: 'God kept His word and brought us to this moment.' },
      { id: 'photo-17', url: '/photos/grace-cydrill-17.jpg', caption: 'Sassy bride, proud groom', category: 'filmstrip-1', chapterTag: 'Studio Session • Set I', storyNote: 'Never a dull moment basta magkasama tayong dalawa.' },
      { id: 'photo-18', url: '/photos/grace-cydrill-18.jpg', caption: 'Still making each other kilig every day', category: 'filmstrip-2', chapterTag: 'Chapter III • Everyday Magic', storyNote: 'Always finding simple ways to make each other smile.' },
      { id: 'photo-19', url: '/photos/grace-cydrill-19.jpg', caption: 'A love that still gives me butterflies', category: 'filmstrip-2', chapterTag: 'Chapter III • Pure Surprise', storyNote: 'From the first flower hanggang sa forever.' },
      { id: 'photo-20', url: '/photos/grace-cydrill-20.jpg', caption: 'Cool kids in love', category: 'filmstrip-2', chapterTag: 'Sunglasses Series • Set I', storyNote: 'Bringing our own kulit and style into forever.' },
      { id: 'photo-21', url: '/photos/grace-cydrill-21.jpg', caption: 'Hand in hand, chill & blessed', category: 'filmstrip-2', chapterTag: 'Sunglasses Series • Set I', storyNote: 'Ready for every adventure waiting ahead of us.' },
      { id: 'photo-22', url: '/photos/grace-cydrill-22.jpg', caption: 'Holding hands through every season', category: 'filmstrip-2', chapterTag: 'Chapter III • Through Every Season', storyNote: 'Side by side in our own easy rhythm.' },
      { id: 'photo-23', url: '/photos/grace-cydrill-23.jpg', caption: 'Future Mr. & Mrs. Geneza', category: 'filmstrip-2', chapterTag: 'Sunglasses Series • Set I', storyNote: 'Stepping happily into our next chapter together.' },
      { id: 'photo-24', url: '/photos/grace-cydrill-enhanced-01.jpg', caption: 'Walking into forever', category: 'featured', chapterTag: 'Signature Portrait • Enhanced', storyNote: 'Two hearts, one promise, endless grace.' },
      { id: 'photo-25', url: '/photos/grace-cydrill-25.jpg', caption: 'Partners in everything', category: 'filmstrip-2', chapterTag: 'Sunglasses Series • Set I', storyNote: 'Together will always be our favorite place to be.' },
      { id: 'photo-26', url: '/photos/grace-cydrill-26.jpg', caption: 'The groom in classic white', category: 'filmstrip-2', chapterTag: 'Groom Solo • Set I', storyNote: 'Counting down the days to December 21, 2026.' },
      { id: 'photo-27', url: '/photos/grace-cydrill-27.jpg', caption: 'Serene bridal glow', category: 'filmstrip-2', chapterTag: 'Bridal Solo • Set I', storyNote: 'A quiet smile for the future waiting ahead.' },
      { id: 'photo-28', url: '/photos/grace-cydrill-28.jpg', caption: 'Peace in every quiet moment with you', category: 'filmstrip-2', chapterTag: 'Chapter III • Bridal Veil', storyNote: 'Holding onto the promise we waited and prayed for.' },
      { id: 'photo-29', url: '/photos/grace-cydrill-29.jpg', caption: 'Whispers beneath the veil', category: 'filmstrip-2', chapterTag: 'Bridal Solo • Set I', storyNote: 'Every bit of waiting was worth it for this day.' },
      { id: 'photo-30', url: '/photos/grace-cydrill-30.jpg', caption: 'Blooming with gratitude', category: 'filmstrip-2', chapterTag: 'Bridal Solo • Set I', storyNote: '“And over all these virtues put on love, which binds them all together in perfect unity.” — Colossians 3:14' },
      { id: 'photo-31', url: '/photos/grace-cydrill-31.jpg', caption: 'Ready for my bride', category: 'filmstrip-2', chapterTag: 'Groom Solo • Set I', storyNote: 'All eyes on the one God prepared for me.' },
      { id: 'photo-32', url: '/photos/grace-cydrill-32.jpg', caption: 'Warm earth tones & warmer hearts', category: 'filmstrip-2', chapterTag: 'Studio Session • Set II', storyNote: 'Matched in style, united in love.' },
      { id: 'photo-33', url: '/photos/grace-cydrill-33.jpg', caption: 'My favorite place is beside you', category: 'featured', chapterTag: 'Save the Date • Set II', storyNote: 'Resting in the warmth of a love that feels like home.' },
      { id: 'photo-34', url: '/photos/grace-cydrill-34.jpg', caption: 'Walking in step, laughing out loud', category: 'filmstrip-1', chapterTag: 'Chapter II • Easy Rhythm', storyNote: 'Every step forward is sweeter kapag ikaw ang kasabay.' },
      { id: 'photo-35', url: '/photos/grace-cydrill-35.jpg', caption: 'Best friends & partners for life', category: 'filmstrip-1', chapterTag: 'Chapter II • Best Friends', storyNote: 'Kahit sa playful kulitan, we both win.' },
      { id: 'photo-36', url: '/photos/grace-cydrill-36.jpg', caption: 'Side by side in quiet confidence', category: 'filmstrip-2', chapterTag: 'Studio Session • Set II', storyNote: 'Building a life rooted in faith and friendship.' },
      { id: 'photo-37', url: '/photos/grace-cydrill-37.jpg', caption: 'Poised for our next chapter', category: 'filmstrip-2', chapterTag: 'Studio Session • Set II', storyNote: 'Two lives woven together by God’s grace.' },
      { id: 'photo-38', url: '/photos/grace-cydrill-38.jpg', caption: 'Side by side, steady and true', category: 'filmstrip-2', chapterTag: 'Chapter III • Tested by Time', storyNote: 'Choosing patience, kindness, and each other every single day.' },
      { id: 'photo-39', url: '/photos/grace-cydrill-39.jpg', caption: 'Always leaning on you', category: 'filmstrip-2', chapterTag: 'Studio Session • Set II', storyNote: 'Through every season, ikaw ang pahinga at sandalan ko.' },
      { id: 'photo-40', url: '/photos/grace-cydrill-40.jpg', caption: 'Always each other’s safe place', category: 'filmstrip-2', chapterTag: 'Chapter III • Rooted in Grace', storyNote: 'Unshakeable as long as we stand together.' },
      { id: 'photo-41', url: '/photos/grace-cydrill-41.jpg', caption: 'The easiest “Yes” of our lives', category: 'featured', chapterTag: 'Chapter IV • The Proposal', storyNote: 'Down on one knee with a heart full of promises.' },
      { id: 'photo-42', url: '/photos/grace-cydrill-42.jpg', caption: 'A promise for all our tomorrows', category: 'featured', chapterTag: 'Chapter IV • The Proposal', storyNote: 'From this moment on, never walking alone.' },
      { id: 'photo-43', url: '/photos/grace-cydrill-43.jpg', caption: 'Held close in your care', category: 'filmstrip-2', chapterTag: 'Studio Session • Set II', storyNote: 'Gentle strength and unwavering love.' },
      { id: 'photo-44', url: '/photos/grace-cydrill-44.jpg', caption: 'Portrait of forever', category: 'filmstrip-2', chapterTag: 'Studio Session • Set II', storyNote: 'Grateful for every road that led us right here.' },
      { id: 'photo-45', url: '/photos/grace-cydrill-45.jpg', caption: 'We can’t wait to celebrate with you', category: 'featured', chapterTag: 'Closing Portrait • Set II', storyNote: 'See you on December 21, 2026!' },
      { id: 'photo-46', url: '/photos/grace-cydrill-enhanced-02.jpg', caption: 'Forever starts on December 21, 2026', category: 'featured', chapterTag: 'Chapter IV • Two Souls Made One', storyNote: 'Sealed with a ring, a bouquet, and a lifetime vow.' },
    ] as GalleryPhoto[],
  },

  // 9. RSVP & LIVE GOOGLE SHEETS INTEGRATION
  rsvp: {
    // Paste your deployed Google Apps Script Web App URL here (or set VITE_GOOGLE_SHEET_WEB_APP_URL in .env)
    googleSheetWebAppUrl:
      (import.meta as unknown as { env?: Record<string, string> }).env
        ?.VITE_GOOGLE_SHEET_WEB_APP_URL ||
      'https://script.google.com/macros/s/AKfycbxmyYwioApINP3Y3pdhRIJJm0ooXl9kzqkAgWLQDToyGNt_QrU0PsxE0APKvqfUZ6U09Q/exec',
    deadlineText:
      'A favor of your reply is requested on or before December 1, 2026 • Message Mary Grace Terminez at 0916-345-5595 or thru FB/Messenger',
  },

  // 10. INITIAL GUESTBOOK WISHES (Empty so only real Google Sheet RSVPs are shown)
  initialWishes: [] as GuestWish[],
};
