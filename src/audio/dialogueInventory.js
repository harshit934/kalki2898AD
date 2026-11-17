export const DIALOGUE_EVENTS = Object.freeze({
  bujjiAssist: 'bujjiAssist',
  bossEncounter: 'bossEncounter',
  enemyEncounter: 'enemyEncounter',
  crystalCollect: 'crystalCollect',
  playerAttack: 'playerAttack',
  enemyDefeat: 'enemyDefeat',
  playerDamage: 'playerDamage',
  nearDeath: 'nearDeath',
  specialAttack: 'specialAttack',
  bossDefeat: 'bossDefeat',
  levelComplete: 'levelComplete',
  gameOver: 'gameOver',
})

export const DIALOGUE_INVENTORY = Object.freeze([
  {
    id: 'bhairava_overdrive_voice',
    character: 'Bhairava',
    identification: 'Overdrive voice',
    context: 'Plays when Bhairava activates Overdrive.',
    memeCategory: 'Combat',
    suggestedTriggers: [DIALOGUE_EVENTS.specialAttack],
    file: '/audio/kalki/bhairava/overdrive-voice.ogg',
    subtitleTe: '',
    verification: 'Audio from the supplied recording.',
    automaticTriggerAllowed: true,
    sources: [],
    priority: 3,
  },
  {
    id: 'bujji_support_voice',
    character: 'Bujji',
    identification: 'Support pulse voice',
    context: 'Plays when Bujji assists in combat.',
    memeCategory: 'Companion',
    suggestedTriggers: [DIALOGUE_EVENTS.bujjiAssist],
    file: '/audio/kalki/bujji/support-voice.ogg',
    subtitleTe: '',
    verification: 'Audio from the supplied recording.',
    automaticTriggerAllowed: true,
    sources: [],
    priority: 2,
  },
  {
    id: 'bhairava_undefeated_fighter',
    character: 'Bhairava',
    identification: 'Undefeated-fighter boast (user-identified line)',
    context: 'A boast about his fight record; exact scene and Telugu wording need verification against the feature film.',
    memeCategory: 'Confident / bravado',
    suggestedTriggers: [DIALOGUE_EVENTS.enemyEncounter, DIALOGUE_EVENTS.specialAttack],
    file: '/audio/kalki/bhairava/confident/undefeated-fighter.ogg',
    subtitleTe: 'Okka fight kuda odipoledu',
    verification: 'User supplied the identification and transliteration; not independently confirmed.',
    automaticTriggerAllowed: false,
    sources: [],
    priority: 4,
  },
  {
    id: 'bhairava_bounty_hunter_brag',
    character: 'Bhairava',
    identification: 'Bounty-hunter swagger / self-promotional quip',
    context: 'Bhairava operating as a bounty hunter; a candidate for an enemy encounter only after an exact in-film moment is matched.',
    memeCategory: 'Confident / comic bravado',
    suggestedTriggers: [DIALOGUE_EVENTS.enemyEncounter],
    file: '/audio/kalki/bhairava/comic/bounty-hunter-brag.ogg',
    subtitleTe: '',
    verification: 'Character role is sourced; this specific dialogue identification is a research lead, not a verified quote.',
    automaticTriggerAllowed: false,
    sources: [
      'https://indianexpress.com/article/entertainment/telugu/lyricist-anantha-sriram-criticises-prabhas-kalki-2898-ad-for-portraying-karna-as-superior-to-arjuna-9763349/',
    ],
    priority: 3,
  },
  {
    id: 'ashwatthama_guardian_warning',
    character: 'Ashwatthama',
    identification: 'Guardian / prophecy warning',
    context: 'Ashwatthama is presented as the immortal guardian protecting Sumathi; an urgent or dramatic line may fit near-death gameplay only if the selected film scene supports it.',
    memeCategory: 'Dramatic / grave',
    suggestedTriggers: [DIALOGUE_EVENTS.nearDeath],
    file: '/audio/kalki/ashwatthama/dramatic/guardian-warning.ogg',
    subtitleTe: '',
    verification: 'Role and story context are sourced; no specific line or scene has been verified.',
    automaticTriggerAllowed: false,
    sources: [
      'https://telugu.yousay.tv/en/tfidb/movie/Kalki_2898_AD_BGpB7on0Bn',
      'https://en.wikipedia.org/wiki/Kalki_2898_AD',
    ],
    priority: 5,
  },
  {
    id: 'yaskin_complex_ruler',
    character: 'Supreme Yaskin',
    identification: 'Complex ruler / immortality menace',
    context: 'Yaskin is framed as the authoritarian ruler of the Complex, pursuing immortality; a menace/introduction line is a possible boss-encounter fit.',
    memeCategory: 'Menacing / dramatic',
    suggestedTriggers: [DIALOGUE_EVENTS.bossEncounter],
    file: '/audio/kalki/yaskin/menacing/complex-ruler.ogg',
    subtitleTe: '',
    verification: 'Character and plot context are sourced; exact dialogue and scene timing remain unverified.',
    automaticTriggerAllowed: false,
    sources: [
      'https://www.justwatch.com/in/movie/kalki-2898-ad',
      'https://en.wikipedia.org/wiki/Kalki_2898_AD',
    ],
    priority: 6,
  },
])

export const DIALOGUE_RESEARCH_GAPS = Object.freeze([
  {
    character: 'Bujji',
    identification: 'No movie-only meme dialogue verified in this research pass.',
    context: 'Available coverage encountered here focuses on promotional footage and the separately released animated prelude; neither is accepted as a feature-film dialogue source.',
    memeCategory: 'Not assessed',
    suggestedTriggers: [],
    sources: [
      'https://indianexpress.com/article/entertainment/telugu/kalki-2898-ad-prelude-titled-bujji-and-bhairava-9355256/',
      'https://firstindia.co.in/news/bollywood/prime-video-to-premiere-bb-bujji-bhairava-the-two-episode-riveting-animated-prelude-to-the-groundbreaking-prabhas-starrer-kalki-2898-ad-streaming-exclusively-from-may-31',
    ],
  },
])

export const DIALOGUE_BY_ID = Object.freeze(
  Object.fromEntries(DIALOGUE_INVENTORY.map((dialogue) => [dialogue.id, dialogue])),
)

export const EVENT_DIALOGUE_POOLS = Object.freeze(
  Object.fromEntries(
    Object.values(DIALOGUE_EVENTS).map((event) => [
      event,
      DIALOGUE_INVENTORY.filter(
        (dialogue) =>
          dialogue.automaticTriggerAllowed && dialogue.suggestedTriggers.includes(event),
      ).map((dialogue) => dialogue.id),
    ]),
  ),
)
