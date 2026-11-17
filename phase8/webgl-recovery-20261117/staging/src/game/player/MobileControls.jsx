import { useEffect, useRef, useState } from 'react'
import {
  queuePlayerJump,
  queuePlayerAttack,
  queuePlayerOverdrive,
  setPlayerMoveInput,
  queuePlayerDodge,
  setPlayerBlocking,
  setPlayerSprintInput,
  queuePlayerInteract,
} from './playerInputStore.js'

function MobileControls() {
  const pointer = useRef(null)
  const [stick, setStick] = useState({ x: 0, y: 0 })

  function moveStick(event) {
    if (pointer.current !== event.pointerId) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const radius = bounds.width * 0.32
    const x = (event.clientX - bounds.left - bounds.width / 2) / radius
    const y = (event.clientY - bounds.top - bounds.height / 2) / radius
    const length = Math.max(1, Math.hypot(x, y))
    setStick({ x: x / length, y: y / length })
    setPlayerMoveInput(x / length, -y / length, 'mobile-stick')
  }

  function releaseStick(event) {
    if (pointer.current !== event.pointerId) return
    pointer.current = null
    setStick({ x: 0, y: 0 })
    setPlayerMoveInput(0, 0, 'mobile-stick')
  }

  function releaseBlock() {
    setPlayerBlocking(false, 'mobile')
  }

  useEffect(() => {
    function clearHeld() {
      pointer.current = null
      setStick({ x: 0, y: 0 })
      setPlayerMoveInput(0, 0, 'mobile-stick')
      setPlayerBlocking(false, 'mobile')
      setPlayerSprintInput(false, 'mobile')
    }
    const onVisibility = () => { if (document.hidden) clearHeld() }
    window.addEventListener('blur', clearHeld)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('blur', clearHeld)
      document.removeEventListener('visibilitychange', onVisibility)
      setPlayerMoveInput(0, 0, 'mobile-stick')
      setPlayerBlocking(false, 'mobile')
      setPlayerSprintInput(false, 'mobile')
    }
  }, [])

  return (
    <nav className="mobile-controls" aria-label="Player movement controls">
      <div className="movement-controls">
        <span className="dpad-hint">DRAG TO MOVE</span>
        <button
          type="button"
          className="movement-stick"
          aria-label="Movement joystick"
          onPointerDown={(event) => {
            if (pointer.current !== null) return
            event.preventDefault()
            event.currentTarget.setPointerCapture(event.pointerId)
            pointer.current = event.pointerId
            moveStick(event)
          }}
          onPointerMove={moveStick}
          onPointerUp={releaseStick}
          onPointerCancel={releaseStick}
          onLostPointerCapture={releaseStick}
        >
          <span aria-hidden="true" style={{ transform: `translate(${stick.x * 82}%, ${stick.y * 82}%)` }} />
        </button>
      </div>
      <div className="mobile-action-buttons">
        <button className="mobile-action-button" type="button" onPointerDown={queuePlayerDodge}>
          DODGE
        </button>
        <button
          className="mobile-action-button"
          type="button"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            setPlayerBlocking(true, 'mobile')
          }}
          onPointerUp={releaseBlock}
          onPointerCancel={releaseBlock}
          onLostPointerCapture={releaseBlock}
        >
          BLOCK
        </button>
        <button
          className="mobile-action-button mobile-sprint-button"
          type="button"
          onPointerDown={(event) => {
            event.preventDefault()
            event.currentTarget.setPointerCapture(event.pointerId)
            setPlayerSprintInput(true, 'mobile')
          }}
          onPointerUp={() => setPlayerSprintInput(false, 'mobile')}
          onPointerCancel={() => setPlayerSprintInput(false, 'mobile')}
          onLostPointerCapture={() => setPlayerSprintInput(false, 'mobile')}
        >
          SPRINT
        </button>
        <button
          className="mobile-action-button mobile-jump-button"
          type="button"
          onPointerDown={(event) => {
            event.preventDefault()
            queuePlayerJump()
          }}
        >
          JUMP
        </button>
        <button
          className="mobile-action-button mobile-attack-button"
          type="button"
          onPointerDown={(event) => {
            event.preventDefault()
            queuePlayerAttack('basic')
          }}
        >
          ATTACK
        </button>
        <button
          className="mobile-action-button mobile-heavy-button"
          type="button"
          onPointerDown={(event) => {
            event.preventDefault()
            queuePlayerAttack('heavy')
          }}
        >
          HEAVY
        </button>
        <button
          className="mobile-action-button mobile-interact-button"
          type="button"
          onPointerDown={(event) => {
            event.preventDefault()
            queuePlayerInteract()
          }}
        >
          INTERACT
        </button>
        <button
          className="mobile-action-button mobile-overdrive-button"
          type="button"
          onPointerDown={(event) => {
            event.preventDefault()
            queuePlayerOverdrive()
          }}
        >
          BOOST
        </button>
      </div>
    </nav>
  )
}

export default MobileControls
