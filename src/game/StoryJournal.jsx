import { useEffect, useRef, useState } from 'react'
import { STORY_ARCS, STORY_MISSIONS, getStoryMission } from './storyCampaign.js'
import { useStoryProgress, SCOUTING_FOCUS } from './storyProgress.js'
import './story.css'

export default function StoryJournal({ missionId, playing, onClose, onBriefing }) {
  const dialog = useRef(null)
  const [arcId, setArcId] = useState(getStoryMission(missionId)?.arc ?? 1)
  const focus = useStoryProgress(state => state.scouting[missionId])
  const [reply, setReply] = useState(null)
  const mission = getStoryMission(missionId)
  const arc = STORY_ARCS[arcId - 1]
  useEffect(() => {
    const node = dialog.current
    node.showModal()
    return () => { node.close() }
  }, [])

  return <dialog ref={dialog} className="story-journal" aria-labelledby="story-title" onCancel={event => { event.preventDefault(); onClose() }}>
    <header><div><p className="story-kicker">BHAIRAVA + BUJJI // STORY LOG</p><h1 id="story-title">A road through the last city</h1></div>
      <button type="button" onClick={onClose} autoFocus>Close story log</button></header>
    <p>Film spoilers in the outline. All playable jobs, dialogue and choices below are <strong>game-original adaptations</strong>. Ten existing combat prototypes are playable; the remaining ninety chapters are story designs, not finished levels.</p>
    <section aria-labelledby="companion-title" className="story-companion">
      <h2 id="companion-title">Bujji · {mission?.title}</h2>
      <p>{mission?.objective}</p>
      <p>Choose a scouting focus for this mission’s in-engine briefing. It changes Bujji’s advice; it does not alter film events, combat statistics or rewards.</p>
      <div className="story-actions">{Object.entries(SCOUTING_FOCUS).map(([key, item]) => <button type="button" key={key} aria-pressed={focus === key}
        disabled={!mission?.playable} onClick={() => { if (useStoryProgress.getState().chooseFocus(missionId, key)) setReply(item.response) }}>{item.label}</button>)}
        {playing && mission?.playable && <button type="button" onClick={onBriefing}>Play in-engine briefing</button>}</div>
      <p role="status">{reply ?? (focus ? SCOUTING_FOCUS[focus].response : 'Bujji: Terrain or threat? Give me a focus and I will brief you before we move.')}</p>
    </section>
    <nav className="story-arcs" aria-label="Story log arcs">{STORY_ARCS.map(item => <button key={item.id} type="button" aria-pressed={item.id === arcId} onClick={() => setArcId(item.id)}>{String(item.id).padStart(2, '0')} · {item.title}</button>)}</nav>
    <section><p className="story-kicker">ARC {String(arc.id).padStart(2, '0')} · {arc.region}</p><h2>{arc.title}</h2>
      <p><strong>Goal:</strong> {arc.objective}</p><p><strong>Conflict:</strong> {arc.conflict}</p><p><strong>Conclusion:</strong> {arc.conclusion}</p>
      <p><strong>Film anchor:</strong> {arc.anchor}</p><p><strong>Evidence:</strong> {arc.sourceRange} · {arc.evidence ?? 'Sampled movie reference; not exhaustive scene identification'}</p>
      <p><strong>Reference IDs:</strong> {arc.references.join(', ') || 'Subtitle context only; visual staging pending verification'}</p>
      <p><strong>Characters:</strong> {arc.characters.join(' · ')}</p>
      <ol className="story-chapters" start={(arcId - 1) * 10 + 1}>{STORY_MISSIONS.filter(item => item.arc === arcId).map(item => <li key={item.id}>
        <h3>{item.title}</h3><span>{item.provenance} · {item.pattern}</span><p>{item.objective}</p><p><strong>Complication:</strong> {item.conflict}</p><p><strong>Local outcome:</strong> {item.conclusion}</p><p className="story-implementation">{item.implementation}</p>
      </li>)}</ol>
    </section>
  </dialog>
}
