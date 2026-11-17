import { useEffect, useRef, useState } from 'react'
import { usePauseState } from './pauseSystem.js'
import SettingsPanel from './SettingsPanel.jsx'
import './pause.css'

export default function PauseMenu({ onRestart, onSelection, onExit }) {
  const dialog = useRef(null), activating = useRef(false)
  const [page, setPage] = useState('menu')
  useEffect(() => {
    const node = dialog.current, previous = document.activeElement
    node.showModal()
    return () => { node.close(); if (previous?.isConnected) previous.focus() }
  }, [])
  const actions = { restart: onRestart, selection: onSelection, exit: onExit }
  const labels = { restart: 'RESTART MISSION', selection: 'MISSION SELECTION', exit: 'EXIT TO MAIN MENU' }
  function confirm() {
    if (activating.current) return
    activating.current = true
    actions[page]()
  }
  return <dialog ref={dialog} className="game-pause-dialog" aria-labelledby="pause-title"
    onCancel={event => { event.preventDefault(); usePauseState.getState().resume() }}>
    <div className="pause-panel">
      <p className="pause-kicker">KALKI // FIELD CONTROL</p>
      <h1 id="pause-title">GAME PAUSED</h1>
      {page === 'menu' ? <nav aria-label="Pause actions">
        <button autoFocus className="pause-primary" onClick={() => usePauseState.getState().resume()}>RESUME</button>
        <button onClick={() => setPage('restart')}>RESTART MISSION</button>
        <button onClick={() => setPage('selection')}>MISSION SELECTION</button>
        <button onClick={() => setPage('settings')}>SETTINGS</button>
        <button onClick={() => setPage('exit')}>EXIT TO MAIN MENU</button>
      </nav> : page === 'settings' ? <section aria-label="Pause settings">
        <h2>SETTINGS</h2>
        <SettingsPanel />
        <button onClick={() => setPage('menu')}>BACK TO PAUSE MENU</button>
      </section> : <section aria-label="Confirm mission navigation">
        <h2>{page === 'restart' ? 'Restart this mission?' : 'Leave the current run?'}</h2>
        <p>The current run will restart on entry. Saved rewards, completed missions and unlocks are kept.</p>
        <button className="pause-primary" onClick={confirm}>{labels[page]}</button>
        <button autoFocus onClick={() => setPage('menu')}>CANCEL</button>
      </section>}
      <p className="pause-footer">ESC TO RESUME</p>
    </div>
  </dialog>
}
