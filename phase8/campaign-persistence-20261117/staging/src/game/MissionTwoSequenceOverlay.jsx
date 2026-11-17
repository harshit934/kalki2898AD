import { useEffect, useRef } from 'react'
import { useMissionTwoSequence, TRACK_LENGTH } from './missionTwoSequence.js'
import { clearPlayerInput, setPlayerMoveInput } from './player/playerInputStore.js'
import PlayerInput from './player/PlayerInput.jsx'
import MobileControls from './player/MobileControls.jsx'
import { useCinematic } from './cinematics/controller.js'
import './missionTwoSequence.css'

export default function MissionTwoSequenceOverlay({ running, onPause, onStart }) {
  const phase = useMissionTwoSequence(s => s.phase), live = useMissionTwoSequence(s => s.live), result = useMissionTwoSequence(s => s.result)
  const cinematic = useCinematic(s => Boolean(s.session))
  const touches = useRef(new Map())
  const interactive = running && !cinematic && ['duel', 'chase'].includes(phase)
  useEffect(() => { const held = touches.current; if (!interactive) { held.clear(); clearPlayerInput() } return () => { held.clear(); clearPlayerInput() } }, [phase, interactive])
  if (phase === 'idle' || cinematic || !running) return null
  if (phase === 'handoff') return <div className="contract-handoff" style={{ opacity: live?.fade ?? 1 }} aria-hidden="true" />
  function publish() {
    let x = 0, y = 0
    for (const held of touches.current.values()) { x += held.x; y += held.y }
    setPlayerMoveInput(x, y, 'bujji-chase')
  }
  function touch(event, x, y) { event.currentTarget.setPointerCapture(event.pointerId); touches.current.set(event.pointerId, { x, y }); publish() }
  function release(event) { touches.current.delete(event.pointerId); publish() }
  return <>
    {interactive && <PlayerInput active />}
    <section className="contract-status" aria-label="Bounty contract status">
      <strong>{phase === 'duel' ? 'SALVAGE CLAIMANT · ORIGINAL 1v1' : phase === 'chase' ? 'BUJJI · GROUND CHASE' : 'CONTRACT INTERRUPTED'}</strong>
      {phase === 'duel' && <><p>Bhairava {Math.ceil(live?.hp ?? 150)}/150 · Claimant {Math.ceil(live?.enemyHp ?? 240)}/240</p><p role="status">{live?.pattern ?? 'Closing distance'} · {live?.tell ?? 'approach'}</p><details><summary>CONTROLS</summary><small>J light · K heavy · F guard · Q dodge · Space jump. Counter after a missed strike.</small></details></>}
      {phase === 'chase' && <><p>Integrity {live?.integrity ?? 100}% · {Math.floor(live?.distance ?? 0)}/{TRACK_LENGTH} m · Courier {Math.ceil(live?.gap ?? 20)} m ahead</p><details><summary>CONTROLS</summary><p>A/D steer · W accelerate · S brake. Follow the red courier to the cargo gate. No flight.</p></details></>}
      {phase === 'failed' && <><p>{result}</p><button type="button" onClick={() => { useMissionTwoSequence.getState().reset(); window.setTimeout(onStart, 0) }}>Retry contract</button><button type="button" onClick={() => useMissionTwoSequence.getState().reset()}>Return to Mission 2</button></>}
      {interactive && <><button type="button" onClick={onPause}>Pause contract</button><button type="button" onClick={() => useMissionTwoSequence.getState().reset()}>Leave contract</button></>}
    </section>
    {interactive && phase === 'duel' && <div className="contract-duel-controls"><MobileControls /></div>}
    {interactive && phase === 'chase' && <div className="chase-touch" aria-label="Bujji touch controls">
      {[['Steer left', -1, 0], ['Steer right', 1, 0], ['Accelerate', 0, 1], ['Brake', 0, -1]].map(([label, x, y]) => <button key={label} type="button" aria-label={label} onPointerDown={e => touch(e, x, y)} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>{label}</button>)}
    </div>}
  </>
}
