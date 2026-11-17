// Shared simulation time. Browser/UI time is never patched.
const realNow = () => typeof performance === 'undefined' ? Date.now() : performance.now()
const epoch = Date.now()
const startedAt = realNow()
let heldAt = null
let excluded = 0
const holds = new Set()
const timers = new Map()
let nextId = 0
let wake = null
export const gameTime = () => (heldAt ?? realNow()) - startedAt - excluded
export const gameNow = () => epoch + gameTime()
export const isGameTimeHeld = () => holds.size > 0
function arm() {
  clearTimeout(wake)
  wake = null
  if (holds.size || !timers.size) return
  const next = Math.min(...[...timers.values()].map(timer => timer.at))
  wake = setTimeout(() => {
    wake = null
    for (const [id, timer] of [...timers]) {
      if (holds.size) break
      if (timer.at <= gameTime()) { timers.delete(id); timer.callback() }
    }
    arm()
  }, Math.max(0, next - gameTime()))
  wake?.unref?.()
}
export function setGameHold(reason, held) {
  if (held) { if (!holds.size) heldAt = realNow(); holds.add(reason) }
  else if (holds.delete(reason) && !holds.size) { excluded += realNow() - heldAt; heldAt = null }
  arm()
}
export function setGameTimeout(callback, delay) {
  const id = ++nextId
  timers.set(id, { callback, at: gameTime() + Math.max(0, delay) })
  arm()
  return id
}
export function clearGameTimeout(id) { timers.delete(id); arm() }

export function getGameClockStatus() { return { time: gameTime(), holds: [...holds], pendingTimers: timers.size } }
