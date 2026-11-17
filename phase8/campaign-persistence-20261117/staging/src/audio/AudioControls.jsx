import { useEffect, useId, useState } from 'react'
import {
  getAudioSettings,
  setAudioMuted,
  setAudioVolume,
  subscribeToAudioSettings,
  unlockAudio,
} from './audioManager.js'
import DialogueControls from './DialogueControls.jsx'

function AudioControls() {
  const volumeId = useId()
  const [settings, setSettings] = useState(getAudioSettings)

  useEffect(() => subscribeToAudioSettings(setSettings), [])

  function toggleMuted() {
    void unlockAudio()
    setAudioMuted(!settings.muted)
  }

  function changeVolume(event) {
    setAudioVolume(Number(event.currentTarget.value) / 100)
  }

  return (
    <div className="audio-controls" aria-label="Sound settings">
      <button
        className="audio-mute"
        type="button"
        onClick={toggleMuted}
        aria-pressed={!settings.muted}
        aria-label={settings.muted ? 'Unmute game sounds' : 'Mute game sounds'}
      >
        {settings.muted ? 'SOUND OFF' : 'SOUND ON'}
      </button>
      <label className="audio-volume-label" htmlFor={volumeId}>
        VOL
      </label>
      <input
        id={volumeId}
        className="audio-volume"
        type="range"
        min="0"
        max="100"
        step="1"
        value={Math.round(settings.volume * 100)}
        onChange={changeVolume}
        aria-label="Game sound volume"
      />
      <DialogueControls />
    </div>
  )
}

export default AudioControls
