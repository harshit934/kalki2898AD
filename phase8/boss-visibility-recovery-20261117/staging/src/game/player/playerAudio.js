import { playGameSound } from '../../audio/audioManager.js'

const PLAYER_AUDIO_EVENTS = new Set([
  'jump',
  'specialMove',
  'playerAttack',
  'playerDamage',
])

export function triggerPlayerAudioEvent(eventName) {
  if (!PLAYER_AUDIO_EVENTS.has(eventName)) {
    throw new RangeError(`Unknown player audio event: "${eventName}".`)
  }

  return playGameSound(eventName)
}
