// Deterministic mission-local activity logic. No save writes, timers, teleports,
// audio or gameplay-store mutation. Rendering publishes snapshots separately.
import { chapterDefinition } from './chapterCatalog.js'

export function createChapterRuntime(id, round) {
  if (!chapterDefinition(id)) throw new RangeError('Chapter definition unavailable: ' + id)
  return {
    id, round, stage: 0, time: 0, completed: false, panel: null,
    readings: [], surveyed: [], inventory: null, barterChoice: null,
    samples: [], lastSignalAt: -Infinity, signal: null, revealed: false,
    jobProgress: 0, interference: false, note: '', noteUntil: 0,
    interactionRequested: false, actions: [], revision: 0,
  }
}
const distance = (p, at) => Math.hypot(p.x - at[0], p.z - at[2])
const current = r => chapterDefinition(r.id).stages[r.stage]
function note(r, text) { r.note = text; r.noteUntil = r.time + 6; r.revision++ }
function advance(r) {
  r.stage++; r.panel = null; r.revision++
  if (r.stage === chapterDefinition(r.id).stages.length) r.completed = true
}

export function chapterContext(r, player) {
  if (r.completed) return { near: false, title: 'Chapter complete', targets: [] }
  const s = current(r)
  let targets = [{ id: 'stage', name: s.title, position: s.position }]
  if (s.kind === 'survey') targets = s.points.filter(p => !r.surveyed.includes(p.id))
  if (s.kind === 'salvage-choice') targets = s.items
  if (s.kind === 'signal' && !r.revealed) {
    return { near: true, title: 'E / Interact: request a bearing', targets: [] }
  }
  const target = targets.find(t => distance(player, t.position) <= 2.6)
  return { near: Boolean(target), title: target?.name ?? s.title, target, targets }
}

export function interactChapter(r, world) {
  if (r.completed) return false
  const s = current(r), context = chapterContext(r, world.player)
  if (!context.near) { note(r, 'Move closer to the objective.'); return false }
  if (s.kind === 'diagnostic' || s.kind === 'route-choice' || s.kind === 'barter') {
    r.panel = r.panel ? null : s.kind; r.revision++; return true
  }
  if (s.kind === 'survey') {
    r.surveyed.push(context.target.id)
    note(r, context.target.finding)
    if (r.surveyed.length === s.points.length) advance(r)
    return true
  }
  if (s.kind === 'salvage-choice') {
    r.inventory = context.target.id
    note(r, context.target.name + ' recovered. Return to the trader.')
    advance(r); return true
  }
  if (s.kind === 'signal') {
    if (r.revealed) { advance(r); note(r, 'Junction exposed. Inspect its connection.'); return true }
    if (r.time < r.lastSignalAt + 3) { note(r, 'Bujji is waiting for the next clean return.'); return false }
    const p = world.player, dx = s.position[0] - p.x, dz = s.position[2] - p.z
    const d = Math.hypot(dx, dz)
    if (!r.samples.length || r.samples.every(q => Math.hypot(q.x-p.x,q.z-p.z) >= 5)) r.samples.push({ x:p.x,z:p.z })
    r.lastSignalAt = r.time
    r.signal = { strength: Math.round(Math.max(0, Math.min(100, 100-d*2))), direction: `${dz < -2 ? 'forward' : dz > 2 ? 'behind' : 'level'}${dx < -2 ? '-left' : dx > 2 ? '-right' : ''}` }
    if (d < 4 && r.samples.length >= 2) { r.revealed = true; note(r, 'Strong return. The buried junction is here.') }
    else note(r, `Bujji: ${r.signal.direction}, signal ${r.signal.strength}%. Take another bearing after moving.`)
    return true
  }
  if (s.kind === 'defend') return false
  if (s.kind === 'handoff' && r.inventory !== 'power-cell') return false
  if (s.kind === 'handoff') r.inventory = null
  if (s.kind === 'start-console') note(r, 'Diagnostic running. One scavenger is approaching.')
  else if (s.kind === 'talk') note(r, r.id === 'mission-11' && r.stage === 2 ? 'Bujji confirms the damaged receiver bus.' : s.title + '.')
  advance(r)
  return true
}

export function chapterAction(r, action) {
  if (r.completed || !r.panel) return false
  if (r.panel === 'diagnostic') {
    if (action.type === 'test' && ['power','drive','receiver'].includes(action.value)) {
      if (!r.readings.includes(action.value)) r.readings.push(action.value)
      note(r, { power:'Power: 12.6 V, stable under load.', drive:'Drive: current and motion feedback within limits.', receiver:'Receiver: repeated return-packet loss while power and drive remain stable.' }[action.value])
      return true
    }
    if (action.type === 'diagnose') {
      if (r.readings.length !== 3) { note(r, 'Run all three subsystem tests before identifying the fault.'); return false }
      if (action.value !== 'receiver') { note(r, 'That subsystem passed. Compare the return-packet reading.'); return false }
      advance(r); note(r, 'Damaged subsystem identified: receiver bus. Confirm it with Bujji.'); return true
    }
  }
  if (r.panel === 'route-choice' && action.type === 'route') {
    if (action.value !== 'tunnel') { note(r, 'The survey did not verify vehicle access on that route. Review the physical clearance.'); return false }
    advance(r); note(r, 'Service tunnel selected. Verify its open exit on foot.'); return true
  }
  if (r.panel === 'barter' && action.type === 'offer') {
    if (action.value !== r.inventory || !['wire','bracket'].includes(r.inventory)) {
      note(r, 'The trader needs the usable salvage you actually recovered. No campaign score is spent.'); return false
    }
    r.barterChoice = r.inventory; r.inventory = 'power-cell'
    advance(r); note(r, 'Exchange complete. Deliver the borrowed cell to Bujji.'); return true
  }
  return false
}

export function stepChapter(r, world, seconds) {
  if (r.completed || world.paused) return
  const dt = Math.max(0, Math.min(.05, Number.isFinite(seconds) ? seconds : 0))
  r.time += dt
  if (r.note && r.time > r.noteUntil) { r.note=''; r.revision++ }
  const s = current(r)
  if (s.kind === 'defend') {
    const hostile = world.enemies.filter(e => e.alive)
    r.interference = hostile.some(e => distance(e, s.position) < s.radius)
    r.jobProgress = Math.max(0, Math.min(s.seconds, r.jobProgress + dt*(r.interference ? -.3 : 1)))
    if (r.jobProgress >= s.seconds && hostile.length === 0) {
      advance(r); note(r, 'Console job complete. Recover the diagnostic from the terminal.')
    }
  }
  if (r.interactionRequested) { r.interactionRequested=false; interactChapter(r,world) }
  for (const action of r.actions.splice(0)) chapterAction(r,action)
}

export function chapterSnapshot(r, player) {
  const s = current(r)
  return {
    id:r.id, round:r.round, stage:r.stage, completed:r.completed, panel:r.panel,
    title:r.completed ? chapterDefinition(r.id).closing : s.title,
    stageCount:chapterDefinition(r.id).stages.length,
    context:chapterContext(r,player), readings:[...r.readings], surveyed:[...r.surveyed],
    inventory:r.inventory, signal:r.signal, revealed:r.revealed,
    progress:s?.kind==='defend' ? r.jobProgress/s.seconds : null,
    interference:r.interference, note:r.note,
  }
}
