import {
  DIALOGUE_BY_ID,
  DIALOGUE_EVENTS,
  EVENT_DIALOGUE_POOLS,
} from './dialogueInventory.js'

const STORAGE_KEY = 'kalki-audio-settings'
const DEFAULT_SETTINGS = Object.freeze({ volume: 0.65, muted: false })
const EVENT_COOLDOWN_MS = 1800
const CLIP_COOLDOWN_MS = 5000

export const SOUND_EVENTS = Object.freeze({
  crystalCollect: 'crystalCollect',
  jump: 'jump',
  specialMove: 'specialMove',
  obstacleCollision: 'obstacleCollision',
  playerAttack: 'playerAttack',
  enemyEncounter: 'enemyEncounter',
  playerDamage: 'playerDamage',
  enemyDefeat: 'enemyDefeat',
  bossIntroduction: 'bossIntroduction',
  bossAttack: 'bossAttack',
  bossDamage: 'bossDamage',
  bossDefeat: 'bossDefeat',
  levelComplete: 'levelComplete',
  gameOver: 'gameOver',
})

const LEGACY_SOUND_EVENT_TO_DIALOGUE = Object.freeze({
  crystalCollect: DIALOGUE_EVENTS.crystalCollect,
  jump: undefined,
  specialMove: DIALOGUE_EVENTS.specialAttack,
  obstacleCollision: undefined,
  playerAttack: DIALOGUE_EVENTS.playerAttack,
  enemyEncounter: DIALOGUE_EVENTS.enemyEncounter,
  playerDamage: DIALOGUE_EVENTS.playerDamage,
  enemyDefeat: DIALOGUE_EVENTS.enemyDefeat,
  bossIntroduction: DIALOGUE_EVENTS.bossEncounter,
  bossAttack: undefined,
  bossDamage: undefined,
  bossDefeat: DIALOGUE_EVENTS.bossDefeat,
  levelComplete: DIALOGUE_EVENTS.levelComplete,
  gameOver: DIALOGUE_EVENTS.gameOver,
})

const dialogueListeners = new Set()
const audioSettingsListeners = new Set()
const lastPlayedAt = new Map()
const lastEventAt = new Map()
const lastDialogueByEvent = new Map()
const decodedClips = new Map()
const failedClips = new Set()
let settings = loadSettings()
let audioContext
let masterGain
let activePlayback
let playbackStatus = { state: 'idle' }
let gameAudioPaused = false
const cinematicPlayers = new Set()

function loadSettings() {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return { ...DEFAULT_SETTINGS }

    const parsed = JSON.parse(stored)
    return {
      volume:
        typeof parsed.volume === 'number' && Number.isFinite(parsed.volume)
          ? Math.min(1, Math.max(0, parsed.volume))
          : DEFAULT_SETTINGS.volume,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : DEFAULT_SETTINGS.muted,
    }
  } catch (error) {
    console.warn('[Kalki audio] Could not read saved sound settings.', error)
    return { ...DEFAULT_SETTINGS }
  }
}

function saveSettings() {
  if (typeof window === 'undefined' || !window.localStorage) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('[Kalki audio] Could not save sound settings.', error)
  }
}

function notifyDialogueListeners() {
  for (const listener of dialogueListeners) {
    try {
      listener(playbackStatus)
    } catch (error) {
      console.error('[Kalki audio] A dialogue status listener failed.', error)
    }
  }
}

function notifyAudioSettingsListeners() {
  for (const listener of audioSettingsListeners) {
    try {
      listener({ ...settings })
    } catch (error) {
      console.error('[Kalki audio] An audio settings listener failed.', error)
    }
  }
}

function setPlaybackStatus(nextStatus) {
  playbackStatus = nextStatus
  notifyDialogueListeners()
}

function applyMasterVolume() {
  if (!masterGain || !audioContext) return

  masterGain.gain.setTargetAtTime(
    settings.muted ? 0 : settings.volume,
    audioContext.currentTime,
    0.015,
  )
}

function stopActiveDialogue() {
  if (!activePlayback) return

  const playback = activePlayback
  activePlayback = undefined
  playback.source?.stop()
  setPlaybackStatus({ state: 'idle' })
}

function getPlayableTime() {
  return typeof performance === 'undefined' ? Date.now() : performance.now()
}

function reportMissingClip(url, error) {
  if (failedClips.has(url)) return

  failedClips.add(url)
  console.error(
    `[Kalki dialogue] Missing or unreadable clip "${url}". Add a legally usable feature-film recording at this path.`,
    error,
  )
}

async function loadClip(url) {
  if (failedClips.has(url)) {
    throw new Error(`The clip "${url}" previously failed to load.`)
  }

  if (!decodedClips.has(url)) {
    const request = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Audio request failed (${response.status} ${response.statusText}).`)
        }
        return response.arrayBuffer()
      })
      .then((data) => audioContext.decodeAudioData(data))
      .catch((error) => {
        decodedClips.delete(url)
        reportMissingClip(url, error)
        throw error
      })

    decodedClips.set(url, request)
  }

  return decodedClips.get(url)
}

let missionVoiceRightsRequired = true
// Distributed character voices require verified provenance in every mission.
export function requireVerifiedMissionVoices(value) { missionVoiceRightsRequired = Boolean(value) }

async function playDialogue(dialogue, { eventName } = {}) {
  if (missionVoiceRightsRequired && dialogue.distributionRights?.verified !== true) return 'rights-unverified'
  if (settings.muted || settings.volume === 0) return 'muted'
  if (!audioContext || audioContext.state !== 'running') return 'locked'

  const now = getPlayableTime()
  const lastPlayed = lastPlayedAt.get(dialogue.id) ?? -Infinity
  if (now - lastPlayed < CLIP_COOLDOWN_MS) return 'cooldown'

  if (activePlayback && activePlayback.priority >= dialogue.priority) return 'busy'
  stopActiveDialogue()

  const playback = { dialogue, priority: dialogue.priority }
  activePlayback = playback
  setPlaybackStatus({ state: 'loading', dialogue })

  try {
    const buffer = await loadClip(dialogue.file)
    if (activePlayback !== playback || settings.muted || settings.volume === 0) return 'interrupted'

    if (audioContext.state === 'suspended' && !gameAudioPaused) await audioContext.resume()
    if (audioContext.state !== 'running' && !gameAudioPaused) {
      if (activePlayback === playback) activePlayback = undefined
      setPlaybackStatus({ state: 'locked', dialogue })
      return 'locked'
    }

    const source = audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(masterGain)
    source.onended = () => {
      if (activePlayback === playback) {
        activePlayback = undefined
        setPlaybackStatus({ state: 'idle' })
      }
    }

    playback.source = source
    source.start()
    lastPlayedAt.set(dialogue.id, getPlayableTime())
    if (eventName) {
      lastEventAt.set(eventName, getPlayableTime())
      lastDialogueByEvent.set(eventName, dialogue.id)
    }
    setPlaybackStatus({ state: 'playing', dialogue })
    return 'played'
  } catch {
    if (activePlayback === playback) activePlayback = undefined
    setPlaybackStatus({ state: 'missing', dialogue })
    return 'missing'
  }
}

export function getAudioSettings() {
  return { ...settings }
}

export function getDialoguePlaybackStatus() {
  return playbackStatus
}

export function subscribeToAudioSettings(listener) {
  audioSettingsListeners.add(listener)
  return () => audioSettingsListeners.delete(listener)
}

export function subscribeToDialogueStatus(listener) {
  dialogueListeners.add(listener)
  return () => dialogueListeners.delete(listener)
}

export function setAudioVolume(volume) {
  if (!Number.isFinite(volume)) {
    throw new TypeError('Audio volume must be a finite number.')
  }

  settings = { ...settings, volume: Math.min(1, Math.max(0, volume)) }
  applyMasterVolume()
  saveSettings()
  notifyAudioSettingsListeners()
}

export function setAudioMuted(muted) {
  if (typeof muted !== 'boolean') {
    throw new TypeError('Audio muted setting must be a boolean.')
  }

  settings = { ...settings, muted }
  applyMasterVolume()
  saveSettings()
  if (muted) stopActiveDialogue()
  notifyAudioSettingsListeners()
}

export async function unlockAudio() {
  if (gameAudioPaused) return false
  if (typeof window === 'undefined') return false

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext
  if (!AudioContextConstructor) {
    console.error('[Kalki audio] Web Audio is unavailable in this browser.')
    return false
  }

  try {
    if (audioContext?.state === 'running') return true

    if (!audioContext) {
      audioContext = new AudioContextConstructor()
      masterGain = audioContext.createGain()
      masterGain.connect(audioContext.destination)
      applyMasterVolume()
    }

    if (audioContext.state === 'suspended' && !gameAudioPaused) await audioContext.resume()
    return audioContext.state === 'running'
  } catch (error) {
    console.error('[Kalki audio] Audio could not be initialized after interaction.', error)
    return false
  }
}

export function playDialogueById(dialogueId) {
  if (gameAudioPaused) return Promise.resolve('paused')
  const dialogue = DIALOGUE_BY_ID[dialogueId]
  if (!dialogue) throw new RangeError(`Unknown dialogue clip: "${dialogueId}".`)
  return playDialogue(dialogue)
}

export async function playDialogueForEvent(eventName) {
  if (gameAudioPaused) return 'paused'
  const pool = EVENT_DIALOGUE_POOLS[eventName]
  if (!pool) throw new RangeError(`Unknown dialogue event: "${eventName}".`)
  if (pool.length === 0) return 'no-match'

  const now = getPlayableTime()
  if (now - (lastEventAt.get(eventName) ?? -Infinity) < EVENT_COOLDOWN_MS) {
    return 'cooldown'
  }

  const previousId = lastDialogueByEvent.get(eventName)
  const candidates =
    pool.length > 1 ? pool.filter((dialogueId) => dialogueId !== previousId) : pool
  const index = Math.floor(Math.random() * candidates.length)
  const dialogue = DIALOGUE_BY_ID[candidates[index]]
  return playDialogue(dialogue, { eventName })
}

export function stopDialogue() {
  stopActiveDialogue()
}

export function playGameSound(eventName) {
  if (!Object.hasOwn(SOUND_EVENTS, eventName)) {
    throw new RangeError(`Unknown legacy sound event: "${eventName}".`)
  }

  const dialogueEvent = LEGACY_SOUND_EVENT_TO_DIALOGUE[eventName]
  return dialogueEvent ? playDialogueForEvent(dialogueEvent) : Promise.resolve('no-match')
}

// Owned media for one cinematic. All channels share the game's mute and volume.
export function createCinematicAudio() {
  const media = new Set()
  let disposed = false
  let paused = false
  let globalHold = gameAudioPaused
  const volume = (entry, state) => {
    entry.audio.volume = state.muted ? 0 : Math.min(1, state.volume * entry.gain)
  }
  const unsubscribe = subscribeToAudioSettings(state => {
    for (const entry of media) volume(entry, state)
  })
  function release(entry) {
    if (!media.delete(entry)) return
    entry.audio.pause()
    entry.audio.removeAttribute('src')
    entry.audio.load()
  }
  function play(entry) {
    void entry.audio.play().catch(() => {
      if (!paused && !globalHold && media.has(entry)) release(entry)
    })
  }
  const player = {
    play(cue) {
      if (disposed || !cue.src) return
      const audio = new Audio(cue.src)
      const entry = { audio, gain: Math.max(0, cue.gain ?? 1), channel: cue.channel }
      if (['voice', 'music', 'ambience'].includes(entry.channel)) {
        for (const old of media) if (old.channel === entry.channel) release(old)
      }
      audio.loop = Boolean(cue.loop)
      audio.addEventListener('ended', () => release(entry), { once: true })
      audio.addEventListener('error', () => release(entry), { once: true })
      media.add(entry)
      volume(entry, getAudioSettings())
      if (!paused && !globalHold) play(entry)
    },
    pause() {
      paused = true
      for (const entry of media) entry.audio.pause()
    },
    resume() {
      if (!paused || disposed) return
      paused = false
      if (!globalHold) for (const entry of media) play(entry)
    },
    setGlobalHold(value) {
      if (disposed) return
      globalHold = value
      for (const entry of media) { if (value) entry.audio.pause(); else if (!paused) play(entry) }
    },
    get mediaCount() { return media.size },
    dispose() {
      if (disposed) return
      disposed = true
      cinematicPlayers.delete(player)
      unsubscribe()
      for (const entry of media) release(entry)
    },
  }
  cinematicPlayers.add(player)
  return player
}


// One global resource hold, driven only by the centralized game pause actions.
export function setGameAudioPaused(paused) {
  if (gameAudioPaused === paused) return
  gameAudioPaused = paused
  for (const player of cinematicPlayers) player.setGlobalHold(paused)
  if (audioContext && audioContext.state !== 'closed') {
    const change = paused ? audioContext.suspend() : audioContext.resume()
    void change.catch(error => console.warn('[Kalki audio] Pause state change failed.', error))
  }
}
export function getGameAudioStatus() {
  return { paused: gameAudioPaused, settingsListeners: audioSettingsListeners.size, dialogueListeners: dialogueListeners.size, contextState: audioContext?.state ?? 'uninitialized',
    cinematicMediaCount: [...cinematicPlayers].reduce((sum, player) => sum + player.mediaCount, 0),
    activeDialogue: activePlayback?.dialogue?.id ?? null }
}
