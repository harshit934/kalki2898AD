import { useEffect } from 'react'
import {
  queuePlayerJump,
  queuePlayerDodge,
  setPlayerBlocking,
  queuePlayerAttack,
  queuePlayerOverdrive,
  setPlayerMoveInput,
  setPlayerSprintInput,
  queuePlayerInteract,
} from './playerInputStore.js'

const MOVEMENT_KEYS = new Set([
  'w',
  'a',
  's',
  'd',
  'arrowup',
  'arrowleft',
  'arrowdown',
  'arrowright',
])

function isTextEntry(target) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.matches('input, textarea, select'))
  )
}

function PlayerInput({ active = true }) {
  useEffect(() => {
    if (!active) return undefined

    const keys = new Set()

    function updateMovement() {
      const left = keys.has('a') || keys.has('arrowleft')
      const right = keys.has('d') || keys.has('arrowright')
      const forward = keys.has('w') || keys.has('arrowup')
      const backward = keys.has('s') || keys.has('arrowdown')
      const x = Number(right) - Number(left)
      const y = Number(forward) - Number(backward)
      const magnitude = Math.hypot(x, y)

      setPlayerMoveInput(
        magnitude > 1 ? x / magnitude : x,
        magnitude > 1 ? y / magnitude : y,
        'keyboard',
      )
      setPlayerSprintInput(keys.has('control'), 'keyboard')
    }

    function onKeyDown(event) {
      if (isTextEntry(event.target)) return
      const key = event.key.toLowerCase()
      if (MOVEMENT_KEYS.has(key)) event.preventDefault()

      if (key === ' ' && !event.repeat) {
        event.preventDefault()
        queuePlayerJump()
      }

      if ((key === 'j' || key === 'k') && !event.repeat) {
        event.preventDefault()
        queuePlayerAttack(key === 'j' ? 'basic' : 'heavy')
      }

      if ((key === 'q' || key === 'shift') && !event.repeat) {
        event.preventDefault()
        queuePlayerDodge()
      }
      if (key === 'f') setPlayerBlocking(true, 'keyboard')

      if (key === 'e' && !event.repeat) {
        event.preventDefault()
        queuePlayerInteract()
      }
      if (key === 'b' && !event.repeat) queuePlayerOverdrive()

      if (MOVEMENT_KEYS.has(key) || key === 'control') {
        event.preventDefault()
        keys.add(key)
        updateMovement()
      }
    }

    function onKeyUp(event) {
      const key = event.key.toLowerCase()
      if (key === 'f') setPlayerBlocking(false, 'keyboard')
      if (MOVEMENT_KEYS.has(key) || key === 'control') {
        keys.delete(key)
        updateMovement()
      }
    }

    function clearInput() {
      setPlayerBlocking(false, 'keyboard')
      keys.clear()
      updateMovement()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', clearInput)
    const onVisibility = () => { if (document.hidden) clearInput() }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', clearInput)
      document.removeEventListener('visibilitychange', onVisibility)
      queueMicrotask(() => {
        setPlayerBlocking(false, 'keyboard')
        setPlayerMoveInput(0, 0, 'keyboard')
        setPlayerSprintInput(false, 'keyboard')
      })
    }
  }, [active])

  return null
}

export default PlayerInput
