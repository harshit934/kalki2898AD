import { usePauseState } from '../pauseSystem.js'
import { useEffect } from 'react'
import { useCinematic, toggleCinematicPause, skipCinematic, continueCinematicDialogue } from './controller.js'
import './cinematic.css'

export default function CinematicOverlay() {
  const phase = useCinematic(state => state.phase)
  const dialogue = useCinematic(state => state.dialogue)
  const matte = useCinematic(state => state.matte)
  const title = useCinematic(state => state.title)
  const presentation = useCinematic(state => state.session?.config.presentation)
  const cinematicId = useCinematic(state => state.session?.config.id)
  useEffect(() => {
    if (phase === 'idle') return undefined
    function onKey(event) {
      if (event.repeat || event.target instanceof HTMLButtonElement && event.key !== 'Escape') return
      if (usePauseState.getState().paused || event.defaultPrevented) return
      if (dialogue?.hold && phase === 'playing' && [' ', 'Enter'].includes(event.key)) {
        event.preventDefault()
        continueCinematicDialogue()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, dialogue])
  if (phase === 'idle' || phase === 'returning') return null

  return <section className="cinematic-overlay" aria-label="Cinematic" data-phase={phase} data-presentation={presentation} data-cinematic-id={cinematicId}>
    {matte > 0 && <div className="cinematic-matte" aria-hidden="true" style={{ opacity: matte }} />}
    {title && <div className="cinematic-title"><span>{title.eyebrow}</span><strong>{title.text}</strong></div>}
    <div className="cinematic-controls">
      <button type="button" onClick={toggleCinematicPause}>{phase === 'paused' ? 'Resume cinematic' : 'Pause cinematic'}</button>
      <button type="button" onClick={skipCinematic}>Skip cinematic</button>
    </div>
    {phase === 'paused' && <p className="cinematic-paused" role="status">Cinematic paused</p>}
    {dialogue && <div className="cinematic-subtitle">
      <p aria-live="polite" lang={dialogue.lang}><strong>{dialogue.speaker}</strong>{dialogue.text}</p>
      {dialogue.translation && <p lang="en">{dialogue.translation}</p>}
      {dialogue.hold && <button type="button" disabled={phase === 'paused'} onClick={continueCinematicDialogue}>Continue dialogue</button>}
    </div>}
  </section>
}

