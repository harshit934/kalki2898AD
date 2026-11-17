import { useEffect, useState } from 'react'
import {
  DIALOGUE_BY_ID,
  DIALOGUE_EVENTS,
  DIALOGUE_INVENTORY,
} from './dialogueInventory.js'
import {
  getDialoguePlaybackStatus,
  playDialogueById,
  playDialogueForEvent,
  stopDialogue,
  subscribeToDialogueStatus,
  unlockAudio,
} from './audioManager.js'

const EVENT_LABELS = {
  [DIALOGUE_EVENTS.bujjiAssist]: 'Bujji support pulse',
  [DIALOGUE_EVENTS.bossEncounter]: 'Boss encounter',
  [DIALOGUE_EVENTS.enemyEncounter]: 'Enemy encounter',
  [DIALOGUE_EVENTS.crystalCollect]: 'Crystal collection',
  [DIALOGUE_EVENTS.playerAttack]: 'Player attack',
  [DIALOGUE_EVENTS.enemyDefeat]: 'Enemy defeat',
  [DIALOGUE_EVENTS.playerDamage]: 'Player damage',
  [DIALOGUE_EVENTS.nearDeath]: 'Near-death',
  [DIALOGUE_EVENTS.specialAttack]: 'Bhairava Overdrive',
  [DIALOGUE_EVENTS.bossDefeat]: 'Boss defeat',
  [DIALOGUE_EVENTS.levelComplete]: 'Level completion',
  [DIALOGUE_EVENTS.gameOver]: 'Game over',
}

function getStatusMessage(status) {
  if (status.state === 'loading') return `Loading ${status.dialogue.character} clip…`
  if (status.state === 'playing') return `Playing ${status.dialogue.character}`
  if (status.state === 'missing') return `Missing authorized clip: ${status.dialogue.file}`
  if (status.state === 'locked') return 'Interact with the page to enable audio.'
  if (status.state === 'muted') return 'Sound is muted or volume is at zero.'
  if (status.state === 'no-match') return 'No scene-matched movie dialogue is mapped to this event yet.'
  if (status.state === 'cooldown') return 'Dialogue cooldown active.'
  if (status.state === 'busy') return 'A higher-priority dialogue is already playing.'
  if (status.state === 'interrupted') return 'Dialogue playback was interrupted.'
  if (status.state === 'rights-unverified') return 'Voice unavailable: an original or licensed recording is required.'
  return 'Ready'
}

function DialogueControls() {
  const [open, setOpen] = useState(false)
  const [selectedDialogueId, setSelectedDialogueId] = useState(DIALOGUE_INVENTORY[0]?.id ?? '')
  const [selectedEvent, setSelectedEvent] = useState(DIALOGUE_EVENTS.enemyEncounter)
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true)
  const [status, setStatus] = useState(getDialoguePlaybackStatus)

  useEffect(() => subscribeToDialogueStatus(setStatus), [])

  async function playSelectedDialogue() {
    if (!selectedDialogueId) return
    const audioReady = await unlockAudio()
    if (!audioReady) {
      setStatus({ state: 'locked', dialogue: DIALOGUE_BY_ID[selectedDialogueId] })
      return
    }

    const result = await playDialogueById(selectedDialogueId)
    if (result !== 'played') {
      setStatus({ state: result, dialogue: DIALOGUE_BY_ID[selectedDialogueId] })
    }
  }

  async function playContextualDialogue() {
    const audioReady = await unlockAudio()
    if (!audioReady) {
      setStatus({ state: 'locked' })
      return
    }

    const result = await playDialogueForEvent(selectedEvent)
    if (result !== 'played') setStatus({ state: result })
  }

  function stopPlayback() {
    stopDialogue()
  }

  return (
    <div className="dialogue-controls">
      <button
        className="dialogue-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        DIALOGUES
      </button>
      {open && (
        <section className="dialogue-panel" aria-label="Telugu game voice controls">
          <div className="dialogue-panel-heading">
            <h2>GAME VOICES</h2>
            <p>Preview available character voices and captions.</p>
          </div>

          <label className="dialogue-field">
            <span>CLIP INVENTORY</span>
            <select
              value={selectedDialogueId}
              onChange={(event) => setSelectedDialogueId(event.currentTarget.value)}
            >
              {DIALOGUE_INVENTORY.map((dialogue) => (
                <option key={dialogue.id} value={dialogue.id}>
                  {dialogue.character} — {dialogue.identification}
                </option>
              ))}
            </select>
          </label>

          <div className="dialogue-actions">
            <button type="button" onClick={playSelectedDialogue} disabled={!selectedDialogueId}>
              PLAY SELECTED
            </button>
            <button type="button" onClick={stopPlayback}>
              STOP
            </button>
          </div>

          <label className="dialogue-field">
            <span>GAMEPLAY CONTEXT</span>
            <select
              value={selectedEvent}
              onChange={(event) => setSelectedEvent(event.currentTarget.value)}
            >
              {Object.entries(EVENT_LABELS).map(([event, label]) => (
                <option key={event} value={event}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button className="dialogue-context-play" type="button" onClick={playContextualDialogue}>
            PLAY MATCHED DIALOGUE
          </button>

          <label className="dialogue-subtitles">
            <input
              type="checkbox"
              checked={subtitlesEnabled}
              onChange={(event) => setSubtitlesEnabled(event.currentTarget.checked)}
            />
            <span>Optional Telugu captions</span>
          </label>

          <p className="dialogue-status" role="status" aria-live="polite">
            {getStatusMessage(status)}
          </p>
          {subtitlesEnabled && status.state === 'playing' && status.dialogue.subtitleTe && (
            <p className="dialogue-subtitle" lang="te-Latn">
              {status.dialogue.subtitleTe}
            </p>
          )}
        </section>
      )}
    </div>
  )
}

export default DialogueControls
