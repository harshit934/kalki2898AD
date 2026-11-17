import { allowsStoryPresentation } from './cinematics/presentationPolicy.js'
import { setGameTimeout, clearGameTimeout } from './gameClock.js'
import { useEffect } from 'react'
import { useNarrativeCueState } from './narrativeCueSystem.js'

function CombatNarrative() {
  const dialogue = useNarrativeCueState((state) => state.dialogue)
  const dialogueId = useNarrativeCueState((state) => state.dialogueId)
  const cinematic = useNarrativeCueState((state) => state.cinematic)
  const cinematicId = useNarrativeCueState((state) => state.cinematicId)

  useEffect(() => {
    if (!dialogue) return undefined
    const timeoutId = setGameTimeout(() => {
      useNarrativeCueState.setState({ dialogue: null })
    }, 3200)
    return () => clearGameTimeout(timeoutId)
  }, [dialogue, dialogueId])

  useEffect(() => {
    if (!cinematic) return undefined
    const timeoutId = setGameTimeout(() => {
      useNarrativeCueState.setState({ cinematic: null })
    }, 2500)
    return () => clearGameTimeout(timeoutId)
  }, [cinematic, cinematicId])

  return (
    <>
      {cinematic && allowsStoryPresentation(cinematic.placement) && (
        <aside key={cinematicId} className="combat-cinematic" aria-live="polite">
          <span>FIELD MOMENT // ORIGINAL GAME SCENE</span>
          <strong>{cinematic.title}</strong>
          <p>{cinematic.caption}</p>
        </aside>
      )}
      {dialogue && (
        <aside key={dialogueId} className="combat-dialogue" lang={dialogue.lang??'te-Latn'} aria-live="polite">
          <span>{dialogue.speaker}</span>
          <p>“{dialogue.text}”</p>
          {dialogue.translation && <small lang="en">{dialogue.translation}</small>}
        </aside>
      )}
    </>
  )
}

export default CombatNarrative
