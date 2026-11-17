import { allowsStoryPresentation } from './cinematics/presentationPolicy.js'
import { gameNow } from './gameClock.js'
import { create } from 'zustand'

const FIGHT_LINES = Object.freeze({
  playerHit: [
    { speaker: 'BHAIRAVA', text: 'Tappu daarilo vachchaavu.' },
    { speaker: 'BHAIRAVA', text: 'Eesaari levaku.' },
    { speaker: 'BUJJI', text: 'Shatruvu toolipoyaadu. Munduku vellu, boss.' },
  ],
  enemyDown: [
    { speaker: 'BHAIRAVA', text: 'Oka talanoppi taggindi.' },
    { speaker: 'BUJJI', text: 'Daari khaaleegaa undi. Konni sekanla varake.' },
  ],
  bossPhase: [
    { speaker: 'BHAIRAVA', text: 'Intenaa nee sattaa?' },
    { speaker: 'BUJJI', text: 'Shatruvu shakti okkasaarigaa perigindi. Pakka nunchi daadi raavachchu, jaagratta!' },
  ],
  bossDefeated: [
    { speaker: 'BHAIRAVA', text: 'Daari khaalee ayindi. Pada veldaam.' },
    { speaker: 'BUJJI', text: 'Shatruvu padipoyaadu. Idantaa nee plan prakaarame jarigindani raasukuntunnaa.' },
  ],
})

const CINEMATIC_BEATS = Object.freeze({
  bossIntro: [
    { title: 'THE HUNT TURNS', caption: 'A new threat steps into Bhairava’s path.' },
    { title: 'NO EASY ROAD', caption: 'The arena falls silent as the fight begins.' },
  ],
  bossPhase: [
    { title: 'THE STAKES RISE', caption: 'The opponent changes its rhythm. Bhairava holds his ground.' },
    { title: 'SECOND WIND', caption: 'A surge of power tears through the arena.' },
  ],
  randomEncounter: [
    { title: 'DUST AND IRON', caption: 'In the last city, every road has a price.' },
    { title: 'THE LONG WAY', caption: 'Bhairava keeps moving through the chaos.' },
    { title: 'BOUNTY TROUBLE', caption: 'The next pursuer has already found him.' },
  ],
})

let cueSequence = 0
let lastLineAt = 0
let lastMomentAt = 0

function choose(items) {
  return items[Math.floor(Math.random() * items.length)]
}

export const useNarrativeCueState = create((set) => ({
  dialogue: null,
  dialogueId: 0,
  cinematic: null,
  cinematicId: 0,
  reset() {
    lastLineAt = 0
    lastMomentAt = 0
    set({ dialogue: null, cinematic: null })
  },
  announceFightDialogue(event, { force = false } = {}) {
    const now = gameNow()
    if (!force && now - lastLineAt < 6200) return false
    const lines = FIGHT_LINES[event]
    if (!lines) return false
    lastLineAt = now
    set({ dialogue: choose(lines), dialogueId: ++cueSequence })
    return true
  },
  showCinematicMoment(event, { force = false, placement = 'gameplay' } = {}) {
    if (!allowsStoryPresentation(placement)) { set({ cinematic: null }); return false }
    const now = gameNow()
    if (!force && now - lastMomentAt < 18000) return false
    const moments = CINEMATIC_BEATS[event]
    if (!moments) return false
    if (event === 'randomEncounter' && Math.random() > 0.38) return false
    lastMomentAt = now
    set({ cinematic: { ...choose(moments), placement }, cinematicId: ++cueSequence })
    return true
  },
}))
