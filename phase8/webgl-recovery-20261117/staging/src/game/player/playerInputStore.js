import { create } from 'zustand'

const movementSources = new Map()
const sprintSources = new Set()

function publishMovement() {
  let moveX = 0
  let moveY = 0
  for (const movement of movementSources.values()) {
    moveX += movement.x
    moveY += movement.y
  }
  const length = Math.hypot(moveX, moveY)
  if (length > 1) {
    moveX /= length
    moveY /= length
  }
  usePlayerInput.setState({ moveX, moveY })
}

export const usePlayerInput = create(() => ({
  moveX: 0,
  moveY: 0,
  sprint: false,
  blocking: false,
  dodgeQueued: false,
  jumpQueued: false,
  attackQueued: null,
  overdriveQueued: false,
  interactQueued: false,
}))

export function setPlayerMoveInput(moveX, moveY, source = 'default') {
  movementSources.set(source, {
    x: Math.max(-1, Math.min(1, moveX)),
    y: Math.max(-1, Math.min(1, moveY)),
  })
  publishMovement()
}

export function setPlayerButtonMovement(buttons, source = 'buttons') {
  let moveX = 0
  let moveY = 0
  for (const button of buttons) {
    if (button === 'left') moveX -= 1
    if (button === 'right') moveX += 1
    if (button === 'up') moveY += 1
    if (button === 'down') moveY -= 1
  }
  setPlayerMoveInput(moveX, moveY, source)
}

export function setPlayerSprintInput(sprint, source = 'default') {
  if (sprint) sprintSources.add(source)
  else sprintSources.delete(source)
  usePlayerInput.setState({ sprint: sprintSources.size > 0 })
}

export function queuePlayerInteract() {
  usePlayerInput.setState({ interactQueued: true })
}

export function consumePlayerInteract() {
  const queued = usePlayerInput.getState().interactQueued
  if (queued) usePlayerInput.setState({ interactQueued: false })
  return queued
}

export function queuePlayerJump() {
  usePlayerInput.setState({ jumpQueued: true })
}

export function consumePlayerJump() {
  usePlayerInput.setState({ jumpQueued: false })
}

export function queuePlayerAttack(attackType) {
  if (attackType !== 'basic' && attackType !== 'heavy') {
    throw new RangeError(`Unknown player attack: "${attackType}".`)
  }
  usePlayerInput.setState({ attackQueued: attackType })
}

export function consumePlayerAttack() {
  const attackType = usePlayerInput.getState().attackQueued
  if (attackType) usePlayerInput.setState({ attackQueued: null })
  return attackType
}

export function queuePlayerOverdrive() {
  usePlayerInput.setState({ overdriveQueued: true })
}

export function consumePlayerOverdrive() {
  const queued = usePlayerInput.getState().overdriveQueued
  if (queued) usePlayerInput.setState({ overdriveQueued: false })
  return queued
}

const blockSources = new Set()

export function setPlayerBlocking(active, source) {
  if (active) blockSources.add(source)
  else blockSources.delete(source)
  usePlayerInput.setState({ blocking: blockSources.size > 0 })
}

export function queuePlayerDodge() {
  usePlayerInput.setState({ dodgeQueued: true })
}

export function consumePlayerDodge() {
  const queued = usePlayerInput.getState().dodgeQueued
  if (queued) usePlayerInput.setState({ dodgeQueued: false })
  return queued
}

export function clearPlayerInput() {
  movementSources.clear()
  blockSources.clear()
  sprintSources.clear()
  usePlayerInput.setState(usePlayerInput.getInitialState())
}

