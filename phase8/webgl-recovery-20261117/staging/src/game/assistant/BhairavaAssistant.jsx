import { useRef, useState } from 'react'
import { readAssistantContext } from './context.js'
import { answer } from './responses.js'
import { progressAnswer } from './progress.js'
import './assistant.css'
const progressTopics=[['progress','Progress summary'],['recap','Tenth-mission recap']]
const topics=[['initial','Start guidance'],['objective','Current objective'],['remaining','What remains?'],['combat','Combat advice'],['boss','Boss / relic'],['completion','Completion / rewards'],['replay','Replay state']]
export default function BhairavaAssistant(){
 const [response,setResponse]=useState(null),[open,setOpen]=useState(false),[topic,setTopic]=useState('objective'),[recapNumber,setRecapNumber]=useState(10),trigger=useRef(null),closeButton=useRef(null)
 const dismiss=()=>{setOpen(false);trigger.current?.focus()}
 const current=readAssistantContext()
 function ask(nextTopic, requestedNumber){const c=readAssistantContext();const n=requestedNumber??(c.progress.milestones.find(m=>m.id===c.id)?.number??[...c.progress.milestones].reverse().find(m=>m.complete)?.number??10);setTopic(nextTopic);setRecapNumber(n);setResponse(['progress','recap'].includes(nextTopic)?progressAnswer(c.progress,nextTopic,n):answer(c,nextTopic))}
 return <div className="bhairava-assistant" onKeyDown={e=>{if(e.key==='Escape'&&open){e.preventDefault();e.stopPropagation();dismiss()}else if(['Enter',' '].includes(e.key)&&e.target.closest('button'))e.stopPropagation()}}>
  <button ref={trigger} className="assistant-trigger" aria-expanded={open} aria-controls="bhairava-answer" onClick={()=>{if(open)dismiss();else{ask(current.id==='mission-1'?'objective':'progress');setOpen(true);requestAnimationFrame(()=>closeButton.current?.focus())}}}>Bhairava · Help</button>
  {open&&<section id="bhairava-answer" role="region" aria-label="Bhairava assistant" className="assistant-panel">
   <header><strong>BHAIRAVA · FIELD GUIDANCE</strong><button ref={closeButton} onClick={dismiss} aria-label="Close Bhairava assistant">Close</button></header>
   <p className="assistant-note">Text only · gameplay continues. Telugu draft: fluent-speaker review pending.</p>
   <nav aria-label="Ask Bhairava">{[...(current.id==='mission-1'?topics:[]),...progressTopics].map(([id,label])=><button key={id} onClick={()=>ask(id)}>{label}</button>)}</nav>
   {topic==='recap'&&<label className="assistant-recap-choice">Recorded milestone review<select aria-label="Recap milestone" value={recapNumber} onChange={e=>ask('recap',Number(e.target.value))}>{current.progress.milestones.map(m=><option key={m.id} value={m.number}>Mission {m.number} — {m.complete?'completion recorded':'no completion record'}</option>)}</select></label>}
   {response&&<div key={response.en+response.facts.join()} className="assistant-answer" role="status" aria-live="polite">{response.te&&<p lang="te">{response.te}</p>}{response.reviewStatus&&<p className="assistant-note">Telugu translation: {response.reviewStatus}. English fallback below.</p>}<p lang="en">{response.en}</p><details open><summary>Verified state snapshot</summary><ul>{response.facts.map(f=><li key={f}>{f}</li>)}</ul></details></div>}
   <p className="assistant-note">Snapshot updates when you ask. No voice or audio files are requested.</p>
  </section>}
 </div>
}
