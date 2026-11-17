import { allowsStoryPresentation } from './presentationPolicy.js'
import { setGameHold } from '../gameClock.js'
import { create } from 'zustand'
import { createCinematicAudio, stopDialogue } from '../../audio/audioManager.js'
import { clearPlayerInput } from '../player/playerInputStore.js'

export const useCinematic = create(() => ({ session: null, phase: 'idle', dialogue: null, matte: 0, title: null }))
const read = useCinematic.getState
const update = useCinematic.setState
let sequence = 0

export function startCinematic(config, origin, onComplete) {
  if (read().session) return false
  if (!Number.isFinite(config.duration) || config.duration <= 0) throw new RangeError('Cinematic duration must be positive.')
  setGameHold('cinematic', true)
  clearPlayerInput()
  stopDialogue()
  const session = {
    id: ++sequence, readyActors: new Set(), config, origin: { ...origin }, onComplete, audio: createCinematicAudio(),
    time: 0, cueIndex: 0, dialogueIndex: 0,
    cues: [...(config.audio ?? [])].sort((a, b) => a.at - b.at),
    lines: [...(config.dialogue ?? [])].sort((a, b) => a.at - b.at),
  }
  update({ session, phase: 'playing', dialogue: null, matte: 0, title: null })
  return true
}

export function stopCinematic(reason = 'stopped', immediate = false) {
  const { session, phase } = read()
  if (!session) return
  if (phase !== 'returning') {
    session.reason = reason
    session.audio.dispose()
    update({ phase: 'returning', dialogue: null, matte: 0, title: null })
  }
  if (immediate) finishCinematic()
}

export function markCinematicSpawnReady() {
  const { session } = read()
  if (session) session.spawnReady = true
}

export function finishCinematic() {
  const { session } = read()
  if (!session) return
  session.audio.dispose()
  clearPlayerInput()
  setGameHold('cinematic', false)
  update({ session: null, phase: 'idle', dialogue: null, matte: 0, title: null })
  session.onComplete?.(session.reason)
}

export const skipCinematic = () => stopCinematic('skipped')

export function toggleCinematicPause() {
  const { session, phase } = read()
  if (phase === 'playing') {
    session.audio.pause()
    update({ phase: 'paused' })
  } else if (phase === 'paused') {
    session.audio.resume()
    update({ phase: 'playing' })
  }
}

export function continueCinematicDialogue() {
  const { session, phase, dialogue } = read()
  if (phase !== 'playing' || !dialogue?.hold) return
  session.dialogueIndex++
  update({ dialogue: null })
}

export function advanceCinematic(delta) {
  const { session, phase, dialogue } = read()
  if (phase !== 'playing' || dialogue?.hold) return
  const line = session.lines[session.dialogueIndex]
  const limit = line?.hold ? Math.min(line.at, session.config.duration) : session.config.duration
  session.time = Math.min(limit, session.time + delta)
  while (session.cues[session.cueIndex]?.at <= session.time) {
    session.audio.play(session.cues[session.cueIndex++])
  }
  if (line && session.time >= line.at) {
    if (dialogue !== line) {
      if (line.voice) session.audio.play({ src: line.voice, channel: 'voice' })
      update({ dialogue: line })
    }
    if (!line.hold && session.time >= line.at + line.duration) {
      session.dialogueIndex++
      update({ dialogue: null })
    }
  }
  const storyAllowed = allowsStoryPresentation(session.config.storyPlacement)
  const transition = storyAllowed && session.config.transitions?.find(cue => session.time >= cue.at && session.time < cue.at + cue.duration)
  const matte = transition ? Math.sin(Math.PI * (session.time - transition.at) / transition.duration) : 0
  const title = storyAllowed ? session.config.titles?.find(cue => session.time >= cue.at && session.time < cue.at + cue.duration) ?? null : null
  if (matte !== read().matte || title !== read().title) update({ matte, title })
  if (!read().dialogue?.hold && session.time >= session.config.duration) stopCinematic('completed')
}

