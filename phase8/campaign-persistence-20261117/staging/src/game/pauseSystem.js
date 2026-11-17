import { create } from 'zustand'
import { clearPlayerInput } from './player/playerInputStore.js'
import { useCinematic, toggleCinematicPause } from './cinematics/controller.js'
import { setGameAudioPaused } from '../audio/audioManager.js'
import { setGameHold } from './gameClock.js'

export const usePauseState = create((set, get) => ({
  paused: false,
  ownedCinematic: null,
  pause() {
    if (get().paused) return
    const cine = useCinematic.getState()
    const owned = cine.phase === 'playing' ? cine.session?.id : null
    setGameHold('pause', true)
    clearPlayerInput()
    setGameAudioPaused(true)
    set({ paused: true, ownedCinematic: owned })
    if (owned) toggleCinematicPause()
  },
  resume() {
    if (!get().paused) return
    const owned = get().ownedCinematic, cine = useCinematic.getState()
    clearPlayerInput()
    if (owned && cine.session?.id === owned && cine.phase === 'paused') toggleCinematicPause()
    set({ paused: false, ownedCinematic: null })
    setGameHold('pause', false)
    setGameAudioPaused(false)
  },
  toggle() { if (get().paused) get().resume(); else get().pause() },
  reset() {
    clearPlayerInput()
    set({ paused: false, ownedCinematic: null })
    setGameHold('pause', false)
    setGameAudioPaused(false)
  },
}))
