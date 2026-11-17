import { useRef, useState } from 'react'
import { useCampaignState } from './campaignSystem.js'
import { useGameplayState } from './gameplayStore.js'

export default function VictoryActions({ onContinue, nextMission }) {
  const activated = useRef(false)
  const [busy, setBusy] = useState(false)
  function activate(action) {
    if (activated.current) return
    activated.current = true
    setBusy(true)
    // Reject unavailable navigation without leaving the remaining actions locked.
    try {
      if (action() === false) { activated.current = false; setBusy(false) }
    } catch (error) {
      activated.current = false
      setBusy(false)
      throw error
    }
  }
  return <nav className="victory-actions" aria-label="Post-mission navigation" aria-busy={busy}>
    <button className="restart-button victory-selection" type="button" disabled={busy}
      onClick={() => activate(() => useCampaignState.getState().returnToSelection())}>
      MISSION SELECTION
    </button>
    <button className="restart-button victory-continue" type="button" disabled={busy || !nextMission}
      title={nextMission ? `Start Mission ${String(nextMission.number).padStart(2, '0')}` : 'No further unlocked playable mission'}
      onClick={() => activate(onContinue)}>
      CONTINUE MISSION
    </button>
    <button className="restart-button restart-secondary victory-restart" type="button" disabled={busy}
      onClick={() => activate(() => useGameplayState.getState().restart())}>
      RESTART
    </button>
  </nav>
}
