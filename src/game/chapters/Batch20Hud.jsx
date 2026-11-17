import { useEffect } from 'react'
import { BATCH_CONTENT, batchNear, freightSafe } from './batch20Content.js'
import { useBatch20, chooseBatch, closeBatchPanel } from './batch20State.js'
import { getPlayerWorldPosition, useGameplayState } from '../gameplayStore.js'
import { CAMPAIGN_MISSIONS, useCampaignState } from '../campaignSystem.js'
import VictoryActions from '../VictoryActions.jsx'
import './batch20.css'

export default function Batch20Hud({ id, onContinue }) {
  const run=useBatch20(s=>s.snapshot),gameOver=useGameplayState(s=>s.gameOver)
  const round=useGameplayState(s=>s.roundId)
  useEffect(()=>{
    if (!run?.panel) return
    const close=e=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeBatchPanel()}}
    window.addEventListener('keydown',close,true)
    return()=>window.removeEventListener('keydown',close,true)
  },[run?.panel])
  if(!run || run.id!==id || run.round!==round || gameOver)return null
  const content=BATCH_CONTENT[id],s=content.stages[run.stage]
  const next=CAMPAIGN_MISSIONS.find(m=>m.id===`mission-${Number(id.slice(8))+1}`&&m.playable&&useCampaignState.getState().unlockedMissionIds.includes(m.id))
  return <>
    {!run.completed && <aside className="batch54f-objective" aria-label="Mission activity">
      <small>VALIDATION CANDIDATE · {id.replace('mission-','MISSION ')}</small>
      <strong>{s.label}</strong><span>Step {run.stage+1} / {content.stages.length}</span>
      {s.kind==='cross'?<b>{freightSafe(run.time,s.lane)?'GREEN · CROSS NOW':'AMBER · WAIT AT REFUGE'}</b>:<span>{batchNear(run,getPlayerWorldPosition())?'E / INTERACT':'Approach the location · E / INTERACT'}</span>}
      {run.note && <p role="status">{run.note}</p>}
    </aside>}
    {run.panel && <section className="batch54f-panel" role="dialog" aria-label={run.panel==='token'?'Inspect ration tokens':'Compare permit evidence'}>
      <h2>{run.panel==='token'?'Which token matches?':'What makes the permit invalid?'}</h2>
      {run.panel==='token'?<><button onClick={()=>chooseBatch(getPlayerWorldPosition(),'17')}>17 · square notch</button><button onClick={()=>chooseBatch(getPlayerWorldPosition(),'42')}>42 · crescent notch</button></>:<><button onClick={()=>chooseBatch(getPlayerWorldPosition(),'date')}>The date has expired</button><button onClick={()=>chooseBatch(getPlayerWorldPosition(),'seal')}>The seal is forged</button><button onClick={()=>chooseBatch(getPlayerWorldPosition(),'access')}>Service class S cannot enter resident tier R</button></>}
      <p>{run.note}</p><button onClick={closeBatchPanel}>Close</button>
    </section>}
    {run.completed && <section className="game-result" aria-label="Activity complete"><div className="result-card"><h1>MISSION COMPLETE</h1><h2>{content.title}</h2><p>{run.note}</p><p>Campaign reward: {content.reward} · {run.rewardSaved?'saved':'saving'}</p><VictoryActions key={`${id}-${round}`} onContinue={onContinue} nextMission={next} /></div></section>}
  </>
}
