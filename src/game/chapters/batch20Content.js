// Candidate activities are opt-in until their gameplay acceptance is recorded.
export const BATCH_IDS = ['mission-21', 'mission-22', 'mission-23', 'mission-24']
export const batchCandidate = () => typeof location !== 'undefined' && new URLSearchParams(location.search).get('batch54f') === '20-24'
export const batchMission = id => BATCH_IDS.includes(id) && batchCandidate()
const at = (x, z, y = -.22) => [x, y, z]
export const BATCH_CONTENT = Object.freeze({
  'mission-21': {
    title: 'BELOW THE SHADOW', reward: 915, enemies: [],
    opening: ['The private ascent is sealed. The public maintenance stairs still reach the lower overlook.', 'We look from our side of the gate. No invented permit.'],
    stages: [
      { kind: 'inspect', label: 'Read the private-access gate', at: at(0, -8), text: 'PRIVATE ASCENT — residents only. Public overlook via the left stairs.' },
      { kind: 'view', label: 'Climb the left stairs and inspect the Complex', at: at(-6, -26, 2.58), text: 'Freight rises above the lower tier. The guarded private route stays closed.' },
      { kind: 'report', label: 'Return to Bujji with the observation', at: at(0, 5), text: 'Bujji records the lower-tier viewpoint without granting private access.' },
    ],
  },
  'mission-22': {
    title: 'THE WATER QUEUE', reward: 930, enemies: [],
    opening: ['A resident lost a ration token near the queue. Hear the identifying detail before returning anything.', 'A small job. We settle it without starting a fight.'],
    stages: [
      { kind: 'inspect', label: 'Speak to the resident at the water queue', at: at(-3, -7), text: 'Resident: My token has a crescent notch and number 42. The other claimant carries number 17.' },
      { kind: 'token', label: 'Inspect the dropped ration tokens', at: at(3, -18), text: 'Two stamped tokens lie beside the pipe. Identify the resident’s token.' },
      { kind: 'return', label: 'Return token 42 to the resident', at: at(-3, -7), text: 'Resident: The crescent notch. That is mine. Thank you. The queue can move again.' },
    ],
  },
  'mission-23': {
    title: 'A FREIGHT WINDOW', reward: 945, enemies: [],
    opening: ['Two freight lanes. Their signals are independent: amber means moving traffic, green means a crossing window.', 'We wait in the refuges and cross on the signal.'],
    stages: [
      { kind: 'inspect', label: 'Read the freight crossing schedule', at: at(0, -5), text: 'Amber: freight moving for 7 seconds. Green: 5-second pedestrian window. Check each lane separately.' },
      { kind: 'cross', label: 'Cross lane one on green; refuge beyond the rail', at: at(0, -20), lane: 0 },
      { kind: 'cross', label: 'Cross lane two on green; reach the far refuge', at: at(0, -34), lane: 1 },
      { kind: 'report', label: 'Map the safe freight route at the dispatch board', at: at(0, -40), text: 'Both timed crossing windows are recorded. No private transit access is granted.' },
    ],
  },
  'mission-24': {
    title: 'THE WRONG PERMIT', reward: 960, enemies: [],
    opening: ['The purchased permit has a valid seal, but the broker hid its access limit. Compare it with the checkpoint register.', 'We find what was sold, not what was promised.'],
    stages: [
      { kind: 'inspect', label: 'Inspect the purchased permit at the broker’s desk', at: at(-3, -8), text: 'PERMIT: service yard only. Date valid. Seal C-17 genuine. No upper-tier access.' },
      { kind: 'inspect', label: 'Read the checkpoint access register', at: at(3, -22), text: 'REGISTER: Seal C-17 authentic; date valid. Upper-tier entry requires resident class R, not service class S.' },
      { kind: 'permit', label: 'Confront the broker with the verified mismatch', at: at(-3, -8), text: 'Which part of the broker’s claim is false?' },
    ],
  },
})

export function createBatchRun(id, round) {
  if (!BATCH_CONTENT[id]) throw new RangeError('No batch activity: ' + id)
  return { id, round, stage: 0, time: 0, completed: false, panel: null, note: '', token: null, previousZ: 8, crossed: [], ready: false }
}
export const freightPhase = (time, lane) => ((time + lane * 3) % 12 + 12) % 12
export const freightSafe = (time, lane) => freightPhase(time, lane) >= 7
export function batchNear(run, player) {
  const s = BATCH_CONTENT[run.id].stages[run.stage]
  return !!s && Math.hypot(player.x - s.at[0], player.z - s.at[2]) < 2.5 && Math.abs(player.y - s.at[1]) < 1.2
}
function advance(run) {
  run.stage++; run.panel = null
  run.completed = run.stage === BATCH_CONTENT[run.id].stages.length
}
export function batchInteract(run, player) {
  if (run.completed || !batchNear(run, player)) return false
  const stage = BATCH_CONTENT[run.id].stages[run.stage]
  if (stage.kind === 'cross') return false
  if (stage.kind === 'token' || stage.kind === 'permit') { run.panel = stage.kind; return true }
  if (stage.kind === 'return' && run.token !== 42) return false
  run.note = stage.text
  advance(run)
  return true
}
export function batchChoose(run, player, choice) {
  if (run.completed || !run.panel || !batchNear(run, player)) return false
  if (run.panel === 'token') {
    if (choice !== '42') { run.note = 'That token has a square notch and number 17. Recheck the resident’s description.'; return false }
    run.token = 42; run.note = 'Crescent token 42 recovered. Return it to the resident.'; advance(run); return true
  }
  if (run.panel === 'permit') {
    if (choice !== 'access') { run.note = 'The date and seal both match. Compare the permitted access class.'; return false }
    run.note = 'Broker: It permits the service yard, not the private upper tier. The limited access is now recorded.'; advance(run); return true
  }
  return false
}
export function stepBatch(run, player, dt, paused = false) {
  if (paused || run.completed) return
  run.time += Math.min(.05, Math.max(0, Number.isFinite(dt) ? dt : 0))
  if (run.panel && !batchNear(run, player)) run.panel = null
  const s = BATCH_CONTENT[run.id].stages[run.stage]
  if (s.kind === 'cross') {
    const z = s.lane === 0 ? -16 : -30
    if (player.z > z + 2) run.ready = true
    if (run.previousZ >= z - 2 && player.z < z - 2) {
      if (run.ready && freightSafe(run.time, s.lane) && Math.abs(player.x) < 7) {
        run.crossed.push(s.lane); run.note = 'Safe window crossed. Check the next signal.'; run.ready = false; advance(run)
      } else { run.ready = false; run.note = 'Unsafe or unverified crossing. Return to the near refuge and cross on green.' }
    }
  }
  run.previousZ = player.z
}
