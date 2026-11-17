import { BATCH_CONTENT } from './chapters/batch20Content.js'
import { ARC_BOSSES } from './phase54e/arcBosses.js'
const makeObjectives = (prefix, names, positions) => names.map((name, index) => ({
  id: `${prefix}-${index + 1}`,
  name,
  position: positions[index],
}))

function makeChapter(title, objectiveLabel, bossName, bossIntro, objectiveNext, objectives, guards) {
  const prefix = title.toLowerCase().replaceAll(' ', '-')
  return Object.freeze({
    title,
    objectiveLabel,
    bossName,
    bossIntro,
    objectiveNext,
    objectives: makeObjectives(prefix, objectives.map(([name]) => name), objectives.map(([, x, z]) => [x, 0.95, z])),
    enemies: guards.map(([type, x, z], index) => ({
      id: `${prefix}-guard-${index + 1}`,
      type,
      position: [x, -0.22, z],
      phase: index * 1.4,
    })),
  })
}

export const EXPANSION_MISSIONS = Object.freeze({
  ...Object.fromEntries(Object.entries(BATCH_CONTENT).map(([id,c])=>[id,Object.freeze({title:c.title,objectiveLabel:'STORY ACTIVITY',objectiveNext:c.stages[0].label,objectives:[],enemies:c.enemies})])),
  ...Object.fromEntries(Object.values(ARC_BOSSES).filter(b=>b.mission>10).map(b=>[b.id,Object.freeze({title:b.name,objectiveLabel:'ARC-FINAL DUEL',bossName:b.name,bossIntro:b.subtitle,objectiveNext:'ENTER THE ARENA · WIN THE DUEL · RECOVER THE RELIC',objectives:[],enemies:[]})])),
  'mission-3': Object.freeze({
    title: 'ONE MORE JOB',
    objectiveLabel: 'CONTRACT BEACONS',
    bossName: 'CONTRACT ENFORCER',
    bossIntro: 'THE CONTRACT HAS A HEAVY PRICE',
    objectiveNext: 'FOLLOW THE ROAD: WALK THROUGH ALL THREE BEACONS',
    objectives: makeObjectives(
      'contract-beacon',
      ['LOWER TIER', 'MARKET EDGE', 'COMPLEX ROAD'],
      [[0, 0.95, -9], [0, 0.95, -27], [0, 0.95, -45]],
    ),
    enemies: [
      { id: 'contract-scout-01', type: 'scout', position: [0, -0.22, -13], phase: 0.5 },
      { id: 'contract-scout-02', type: 'scout', position: [-1.5, -0.22, -29], phase: 2.4 },
      { id: 'contract-warrior-01', type: 'warrior', position: [1.5, -0.22, -43], phase: 4.1 },
    ],
  }),
  'mission-4': Object.freeze({
    title: 'THE DRIVER’S DEBT',
    objectiveLabel: 'ENGINE PARTS',
    bossName: 'CONVOY BREAKER',
    bossIntro: 'THE PURSUIT HAS CAUGHT UP',
    objectiveNext: 'RECOVER ALL ENGINE PARTS AND STOP THE PURSUERS',
    objectives: makeObjectives(
      'engine-part',
      ['IGNITION CORE', 'COOLANT CELL', 'DRIVE SHAFT'],
      [[4, 0.95, -12], [-4, 0.95, -31], [3, 0.95, -49]],
    ),
    enemies: [
      { id: 'convoy-warrior-01', type: 'warrior', position: [4, -0.22, -12], phase: 0.7 },
      { id: 'convoy-scout-01', type: 'scout', position: [-4, -0.22, -23], phase: 2.5 },
      { id: 'convoy-heavy-01', type: 'heavy', position: [3, -0.22, -36], phase: 4.2 },
      { id: 'convoy-warrior-02', type: 'warrior', position: [-3, -0.22, -47], phase: 1.4 },
    ],
  }),
  'mission-5': Object.freeze({
    title: 'A CITY OF TIERS',
    objectiveLabel: 'TIER-LIFT RELAYS',
    bossName: 'TIER SENTINEL',
    bossIntro: 'DISTRICT SECURITY HAS ENGAGED',
    objectiveNext: 'ACTIVATE ALL TIER-LIFT RELAYS AND CLEAR THE GUARDS',
    objectives: makeObjectives(
      'tier-relay',
      ['LOWER LIFT', 'MID LIFT', 'UPPER LIFT'],
      [[-4, 0.95, -10], [4, 0.95, -30], [-3, 0.95, -49]],
    ),
    enemies: [
      { id: 'tier-stalker-01', type: 'glassStalker', position: [-4, -0.22, -11], phase: 0.4 },
      { id: 'tier-warrior-01', type: 'warrior', position: [4, -0.22, -22], phase: 2.1 },
      { id: 'tier-stalker-02', type: 'glassStalker', position: [-3, -0.22, -36], phase: 4.2 },
      { id: 'tier-heavy-01', type: 'heavy', position: [3, -0.22, -47], phase: 1.5 },
    ],
  }),
  'mission-6': makeChapter(
    'THE BOUNTY BOARD', 'COMPETING CLAIMS', 'CLAIM ENFORCER', 'THE LAST CLAIM IS CONTESTED',
    'FOLLOW THE CLAIMS THROUGH THE BAZAAR AND CLEAR THE RIVALS',
    [['BAZAAR NOTICE', -3, -10], ['RIVAL CLAIM', 3, -28], ['FINAL POSTING', -2, -48]],
    [['scout', -3, -13], ['warrior', 3, -30], ['heavy', -2, -47]],
  ),
  'mission-7': makeChapter(
    'THE MASKED PURSUIT', 'PURSUIT MARKERS', 'MASKED FUGITIVE', 'THE TARGET TURNS TO FIGHT',
    'FOLLOW THE TARGET’S TRAIL AND CLEAR THE INTERCEPTORS',
    [['ALLEY TRACE', 3, -11], ['ROOFTOP ACCESS', -3, -29], ['LAST SIGHTING', 2, -50]],
    [['scout', 3, -14], ['scout', -3, -26], ['glassStalker', 2, -45]],
  ),
  'mission-8': makeChapter(
    'THE ARENA CIRCUIT', 'CIRCUIT MARKERS', 'CIRCUIT CHAMPION', 'THE FINAL BOUT BEGINS',
    'CROSS THE CIRCUIT MARKERS AND DEFEAT THE ARENA GUARDS',
    [['FIRST BOUT', 0, -11], ['SECOND BOUT', 0, -29], ['FINAL BOUT', 0, -49]],
    [['warrior', -3, -14], ['heavy', 3, -25], ['glassStalker', -3, -38], ['glassBrute', 3, -49]],
  ),
  'mission-9': makeChapter(
    'A DEBT COLLECTED', 'BARGAIN MARKERS', 'DEBT COLLECTOR', 'THE BARGAIN COMES DUE',
    'FOLLOW THE BARGAIN MARKERS AND CLEAR THE COLLECTORS',
    [['MEETING POINT', -4, -12], ['BARGAIN SITE', 4, -30], ['COLLECTION POINT', -3, -49]],
    [['warrior', -4, -15], ['scout', 4, -25], ['heavy', 3, -36], ['warrior', -3, -47]],
  ),
  'mission-10': makeChapter(
    'THE ROAD OUT', 'EXIT MARKERS', 'EXIT WARDEN', 'THE FACTIONS HAVE SEALED THE EXIT',
    'REACH THE EXIT MARKERS AND BREAK THROUGH THE BLOCKADE',
    [['OUTER ROAD', 2, -10], ['FACTION BARRICADE', -4, -32], ['KASHI EXIT', 3, -51]],
    [['scout', 2, -13], ['glassStalker', -4, -27], ['heavy', -3, -40], ['glassBrute', 3, -49]],
  ),
})
