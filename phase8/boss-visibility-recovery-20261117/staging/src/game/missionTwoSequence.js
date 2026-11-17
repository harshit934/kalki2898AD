import { setGameHold } from './gameClock.js'
import { create } from 'zustand'

export const CONTRACT_KEY = 'kalki-m2-bounty-v1'
export const TRACK_LENGTH = 180
export const TRACK_OBSTACLES = Object.freeze(Array.from({ length: 9 }, (_, i) => ({
  id: i, x: i % 2 === 0 ? 0 : i % 4 === 1 ? -2.7 : 2.7, z: 22 + i * 16, halfX: 1.3, halfZ: 1.2,
})))
export const PATTERNS = Object.freeze([
  { name: 'Quick cut', tell: .8, active: .2, recovery: 1.05, range: 2.5, damage: 12 },
  { name: 'Committed lunge', tell: 1.15, active: .36, recovery: 1.4, range: 3.4, damage: 22 },
  { name: 'Wide sweep', tell: 1.05, active: .28, recovery: 1.25, range: 3.1, damage: 17 },
])
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
export function createDuel() {
  return { time: 0, x: 0, z: 2, yaw: 0, hp: 150, enemyX: 0, enemyZ: -3,
    enemyHp: 240, enemyStage: 'approach', stageTime: 0, pattern: 0, cycle: 0,
    attackReady: 0, attackTime: -10, attackType: null, attackSequence: 0,
    dodgeReady: 0, dodgeUntil: 0, dodgeX: 0, dodgeZ: 1, jumpUntil: 0,
    hitAt: -10, enemyHitAt: -10, guarded: false, damageDone: false, counterHits: 0, blocks: 0, evades: 0 }
}
// Pure bounded simulation. No timers, rewards, asset mutation or production state.
export function stepDuel(state, input, seconds) {
  const s = { ...state }, dt = clamp(Number.isFinite(seconds) ? seconds : 0, 0, .05)
  if (!s.hp || !s.enemyHp) return s
  s.time += dt
  const mx = clamp(input.moveX || 0, -1, 1), mz = -clamp(input.moveY || 0, -1, 1)
  const magnitude = Math.max(1, Math.hypot(mx, mz))
  if (input.dodge && s.time >= s.dodgeReady) {
    s.dodgeUntil = s.time + .27; s.dodgeReady = s.time + .9
    s.dodgeX = mx / magnitude; s.dodgeZ = mz / magnitude
    if (Math.hypot(mx, mz) < .1) { s.dodgeX = 0; s.dodgeZ = 1 }
  }
  if (input.jump && s.time >= s.jumpUntil) s.jumpUntil = s.time + .65
  const dodging = s.time < s.dodgeUntil
  const speed = input.blocking ? 2 : 4.5
  s.x = clamp(s.x + (dodging ? s.dodgeX * 9 : mx / magnitude * speed) * dt, -6.8, 6.8)
  s.z = clamp(s.z + (dodging ? s.dodgeZ * 9 : mz / magnitude * speed) * dt, -5.8, 5.8)
  s.yaw = Math.atan2(s.x - s.enemyX, s.z - s.enemyZ)
  s.guarded = Boolean(input.blocking && !dodging)
  s.speed = Math.hypot(mx, mz) > .1 ? speed : 0
  let dx = s.x - s.enemyX, dz = s.z - s.enemyZ, distance = Math.hypot(dx, dz)
  if (s.enemyStage === 'approach') {
    if (distance > 2.3) {
      const move = Math.min(distance - 2.3, dt * 2.25)
      s.enemyX += dx / Math.max(.001, distance) * move; s.enemyZ += dz / Math.max(.001, distance) * move
    } else { s.enemyStage = 'telegraph'; s.stageTime = 0; s.damageDone = false }
  } else {
    s.stageTime += dt
    const p = PATTERNS[s.pattern]
    if (s.enemyStage === 'telegraph' && s.stageTime >= p.tell) {
      s.enemyStage = 'strike'; s.stageTime = 0
      // Attack direction is committed when the tell ends, allowing a side dodge.
      s.aimX = dx / Math.max(.001, distance); s.aimZ = dz / Math.max(.001, distance)
    } else if (s.enemyStage === 'strike') {
      if (s.pattern === 1) { s.enemyX = clamp(s.enemyX + s.aimX * dt * 5, -6, 6); s.enemyZ = clamp(s.enemyZ + s.aimZ * dt * 5, -5, 5) }
      dx = s.x - s.enemyX; dz = s.z - s.enemyZ; distance = Math.hypot(dx, dz)
      const facing = (dx * s.aimX + dz * s.aimZ) / Math.max(.001, distance)
      if (!s.damageDone && distance < p.range && (s.pattern === 2 || facing > .35)) {
        s.damageDone = true
        if (dodging || (s.pattern !== 1 && s.jumpUntil - s.time > .18)) s.evades++
        else {
          const damage = s.guarded ? Math.ceil(p.damage * .2) : p.damage
          if (s.guarded) s.blocks++
          s.hp = Math.max(0, s.hp - damage); s.hitAt = s.time
        }
      }
      if (s.stageTime >= p.active) { s.enemyStage = 'recovery'; s.stageTime = 0 }
    } else if (s.enemyStage === 'recovery' && s.stageTime >= p.recovery) {
      s.enemyStage = 'approach'; s.stageTime = 0; s.cycle++; s.pattern = s.cycle % PATTERNS.length
    }
  }
  distance = Math.hypot(s.x - s.enemyX, s.z - s.enemyZ)
  if (input.attack && !s.guarded && !dodging && s.time >= s.attackReady) {
    s.attackType = input.attack; s.attackSequence++; s.attackTime = s.time
    const heavy = input.attack === 'heavy'
    s.attackReady = s.time + (heavy ? .9 : .43)
    if (distance < (heavy ? 3.25 : 2.8)) {
      const counter = s.enemyStage === 'recovery'
      s.enemyHp = Math.max(0, s.enemyHp - (heavy ? 38 : 19) * (counter ? 1.65 : .65))
      if (counter) s.counterHits++
      s.enemyHitAt = s.time
    }
  }
  // Bodies have separated horizontal circles; never stand inside the rival.
  dx = s.x - s.enemyX; dz = s.z - s.enemyZ; distance = Math.hypot(dx, dz)
  if (distance < 1.1) {
    s.x = clamp(s.enemyX + (distance > .001 ? dx / distance : 0) * 1.1, -6.8, 6.8)
    s.z = clamp(s.enemyZ + (distance > .001 ? dz / distance : 1) * 1.1, -5.8, 5.8)
    if (Math.hypot(s.x - s.enemyX, s.z - s.enemyZ) < 1.099) {
      s.enemyX = clamp(s.x - (distance > .001 ? dx / distance : 0) * 1.1, -6, 6)
      s.enemyZ = clamp(s.z - (distance > .001 ? dz / distance : 1) * 1.1, -5, 5)
    }
  }
  return s
}

export function createChase() { return { x: 0, z: 0, speed: 0, integrity: 100, time: 0, targetZ: 20, lost: false, safeAt: 0, collisions: 0, hitIds: [] } }
export function stepChase(state, input, seconds) {
  const s = { ...state, hitIds: [...state.hitIds] }, dt = clamp(Number.isFinite(seconds) ? seconds : 0, 0, .05)
  if (s.integrity <= 0 || s.z >= TRACK_LENGTH) return s
  s.time += dt
  const throttle = clamp(input.moveY || 0, -1, 1), steering = clamp(input.moveX || 0, -1, 1)
  const target = throttle < -.2 ? 3 : throttle > .2 ? 14 : 9
  s.speed += (target - s.speed) * (1 - Math.exp(-dt * 2.5))
  const oldX = s.x, oldZ = s.z
  s.x += steering * dt * (3.5 + s.speed * .16); s.z = Math.min(TRACK_LENGTH, s.z + s.speed * dt)
  let collision = Math.abs(s.x) > 5.65
  s.x = clamp(s.x, -5.65, 5.65)
  for (const o of TRACK_OBSTACLES) {
    // Swept interval with vehicle half extents: no high-speed tunnelling.
    const crossedZ = Math.max(oldZ, s.z) + 1.25 >= o.z - o.halfZ && Math.min(oldZ, s.z) - 1.25 <= o.z + o.halfZ
    const crossedX = Math.max(oldX, s.x) + .9 >= o.x - o.halfX && Math.min(oldX, s.x) - .9 <= o.x + o.halfX
    if (crossedZ && crossedX) {
      collision = true
      if (!s.hitIds.includes(o.id)) s.hitIds.push(o.id)
      // Solid front contact: steer clear instead of driving through the box.
      s.z = Math.min(s.z, o.z - o.halfZ - 1.25 - .01)
    }
  }
  if (collision && s.time >= s.safeAt) { s.integrity = Math.max(0, s.integrity - 22); s.speed *= .45; s.safeAt = s.time + .85; s.collisions++ }
  s.targetZ = Math.min(TRACK_LENGTH, 20 + s.time * 8)
  s.lost = s.targetZ - s.z > 60
  return s
}

function readCompletion() {
  try { return typeof window !== 'undefined' && JSON.parse(window.localStorage.getItem(CONTRACT_KEY) || '{}').completed === true }
  catch { return false }
}
export const useMissionTwoSequence = create((set, get) => ({
  phase: 'idle', completed: readCompletion(), runId: 0, origin: null, result: null,
  start(origin) {
    if (get().phase !== 'idle' || ![origin?.x, origin?.y, origin?.z].every(Number.isFinite)) return false
    setGameHold('contract', true)
    set({ phase: 'intro', origin: { ...origin }, runId: get().runId + 1, result: null, live: null })
    return true
  },
  transition(expected, next) { if (get().phase === expected) set({ phase: next }) },
  fail(result) { set({ phase: 'failed', result }) },
  complete(result) {
    try { window.localStorage.setItem(CONTRACT_KEY, JSON.stringify({ completed: true })) } catch { /* Preserve existing saves; in-page completion still works. */ }
    set({ phase: 'outro', completed: true, result })
  },
  reset() { setGameHold('contract', false); set({ phase: 'idle', origin: null }) },
}))
