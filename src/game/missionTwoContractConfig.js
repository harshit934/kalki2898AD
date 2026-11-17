import { createDuel } from './missionTwoSequence.js'
import FinisherOpponent from './MissionTwoFinisherOpponent.jsx'
export function contractCinematic(kind, result) {
  const finish = kind === 'finish', chase = kind === 'chaseIntro', outro = kind === 'outro'
  const player = finish ? [result?.x ?? 0, 0, result?.z ?? 2] : [0, 0, 2]
  const mid = finish ? [(player[0] + (result?.enemyX ?? 0)) / 2, .9, (player[2] + (result?.enemyZ ?? -1)) / 2] : null
  return {
    storyPlacement: 'gameplay-transition',
    id: `m2-bounty-${kind}`, duration: finish ? 3.8 : 6.8, returnDuration: .55, enterDuration: .6,
    titles: [{ at: .2, duration: finish ? 1.2 : 2, eyebrow: 'GAME-ORIGINAL CONTRACT', text: finish ? 'CLAIM SETTLED' : chase ? 'BUJJI · GROUND ROUTE' : outro ? 'BACK TO THE RESONANCE GRID' : 'A CLAIM IN THE GLASS' }],
    camera: finish ? [
      { at: 0, position: [mid[0] + 2, 3.4, mid[2] + 10.5], focus: mid, fov: 48 },
      { at: 2.2, position: [mid[0] + 1.6, 2.8, mid[2] + 9], focus: mid, fov: 48 },
      { at: 3.8, position: [mid[0] + 1.6, 2.8, mid[2] + 9], focus: mid, fov: 48 },
    ] : [
      { at: 0, position: [5, 3.8, 7], focus: [0, 1, -1], fov: 48 },
      { at: 2.2, position: [2.8, 1.9, 4.2], focus: player.map((v, i) => v + (i === 1 ? 1.2 : 0)), fov: 42 },
      { at: finish ? 3.8 : 6.8, position: [1.3, 2.7, 7], focus: [0, 1, 0], fov: 46 },
    ],
    ...(!chase && !outro && { Set: FinisherOpponent, finisherState: finish ? result : createDuel() }),
    actors: chase || outro ? [] : [
      { id: 'bhairava', src: '/models/bhairava-free-rig.glb?v=4', height: 1.78, appearance: 'bhairava', weapon: true, position: player, rotation: [0, Math.PI, 0], actions: [{ at: 0, clip: 'Sword idle (guard)' }, ...(finish ? [{ at: 1.6, clip: 'Sword slash', loop: false, fade: .12 }] : [])] },
    ],
    dialogue: [{ at: .7, duration: finish ? 2.7 : 5.5, speaker: chase || outro ? 'Bujji' : 'Bhairava', text: finish ? 'The claim is settled. Keep the way out clear.' : chase ? 'The courier has our claim record. Follow it around the wreckage. The cargo gate will stop it.' : outro ? 'Contract closed. Three pylons, then the Sovereign. The main route is still waiting.' : 'One claim. One opponent. Leave the rest of the road out of it.' }],
    audio: [{ at: .3, src: '/audio/cinematics/phase41-chime.wav', channel: 'effects', gain: .3 }],
  }
}

