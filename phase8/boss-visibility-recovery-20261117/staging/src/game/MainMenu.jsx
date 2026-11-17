import{cityEnabled,firstCity}from'./phase54e/cityAssets.js'
import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { CAMPAIGN_MISSIONS, useCampaignState } from './campaignSystem.js'
import SettingsPanel from './SettingsPanel.jsx'
const MenuScene = lazy(() => import('./MenuScene.jsx'))

function MenuDialog({ title, children, onClose }) {
  const ref = useRef(null)
  useEffect(() => { const node=ref.current, previous=document.activeElement;node.showModal();return()=>{node.close();if(previous?.isConnected)previous.focus()} }, [])
  return <dialog ref={ref} className="menu-dialog" aria-labelledby="menu-dialog-title" onCancel={e=>{e.preventDefault();onClose()}}><p className="eyebrow">KALKI / JOURNEY CONTROL</p><h2 id="menu-dialog-title">{title}</h2>{children}</dialog>
}
export default function MainMenu({ onLevels, onStart }) {
  const completed = useCampaignState(s => s.completedMissionIds)
  const selected = useCampaignState(s => s.selectedMissionId)
  const unlocked = useCampaignState(s => s.unlockedMissionIds)
  const [panel, setPanel] = useState(null), [exited, setExited] = useState(false)
  const [location, setLocation] = useState('kashi')
  const next = CAMPAIGN_MISSIONS.find(m => m.id === selected && m.playable && unlocked.includes(m.id)) || [...CAMPAIGN_MISSIONS].reverse().find(m=>m.playable&&unlocked.includes(m.id))
  function begin(mission) { if(mission&&useCampaignState.getState().selectMission(mission.id))onStart() }
  if(exited)return <section className="exit-panel"><p className="eyebrow">YOUR JOURNEY IS SAVED</p><h1>Until the next horizon.</h1><p>You can now close this browser tab.</p><button className="accent-button" onClick={()=>setExited(false)}>RETURN TO MAIN MENU</button></section>
  return <><div className="menu-backdrop" aria-hidden="true"><Suspense fallback={<div className="menu-world-fallback" />}><MenuScene location={location} /></Suspense></div><section className="main-menu" aria-label="Main menu">
    <div className="menu-shade" />
    <div className="menu-copy"><p className="eyebrow">THE LAST CITY / THE FIRST HOPE</p><h1>KALKI<span>2898 AD</span></h1><p className="menu-tagline">A hunter. A city. An unfinished destiny.<br />Your road begins in the last city.</p>
      <nav className="main-actions" aria-label="Main menu actions">
        <button aria-label="CONTINUE GAME" className="continue-action" disabled={!next} onClick={()=>begin(next)}><span className="menu-index">01</span><span>CONTINUE GAME<small>{next ? `${next.number} / ${next.title}` : 'No playable chapter available'}</small></span><span aria-hidden="true">↗</span></button>
        <button aria-label="PLAY" onClick={onLevels}><span className="menu-index">02</span><span>PLAY<small>Choose a mission · explore 10 story arcs</small></span><span aria-hidden="true">↗</span></button>
        <button aria-label="NEW GAME" onClick={()=>setPanel('new')}><span className="menu-index">03</span><span>NEW GAME<small>Replay Mission 01 · keep campaign progress</small></span><span aria-hidden="true">+</span></button>
        <button aria-label="SETTINGS" onClick={()=>setPanel('settings')}><span className="menu-index">04</span><span>SETTINGS</span><span aria-hidden="true">◈</span></button>
        <button aria-label="EXIT GAME" onClick={()=>setPanel('exit')}><span className="menu-index">05</span><span>EXIT GAME</span><span aria-hidden="true">→</span></button>
      </nav>
      <div className="menu-progress"><span>{completed.length.toString().padStart(2,'0')} CHAPTERS COMPLETE</span><div><i style={{width:`${completed.length}%`}} /></div><span>THE UNFINISHED HORIZON</span></div>
    </div>
    <div className="menu-location"><span className="location-dot" /><div><small>WORLDS ON THE HORIZON</small><strong>{location==='kashi'?(cityEnabled()&&!firstCity()?'Kashi, beneath the transit spine':'Kashi, at golden hour'):location==='shambhala'?'Shambhala, beneath the canopy':'The Complex, above the city'}</strong><span>LOCATION STUDY / {location==='kashi'?(cityEnabled()&&!firstCity()?'LIVE OPT-IN ENVIRONMENT':'GOLDEN ARCHITECTURE'):'PLANNED CAMPAIGN ENVIRONMENT'}</span><nav aria-label="Location previews">{[['kashi','KASHI'],['shambhala','SHAMBHALA'],['complex','THE COMPLEX']].map(([id,label])=><button key={id} aria-pressed={location===id} onClick={()=>setLocation(id)}>{label}</button>)}</nav></div></div>
    <div className="menu-edition">KALKI 2898 AD <span>AN UNFINISHED JOURNEY</span></div>
    {panel==='settings'&&<MenuDialog title="SETTINGS" onClose={()=>setPanel(null)}><SettingsPanel /><button className="accent-button" onClick={()=>setPanel(null)}>BACK TO MAIN MENU</button></MenuDialog>}
    {panel==='new'&&<MenuDialog title="Start a fresh run?" onClose={()=>setPanel(null)}><p>Begin Mission 01 from the start. Your completed chapters, earned rewards and unlocked missions will be kept.</p><button className="accent-button" onClick={()=>begin(CAMPAIGN_MISSIONS[0])}>START MISSION 01</button><button onClick={()=>setPanel(null)}>CANCEL</button></MenuDialog>}
    {panel==='exit'&&<MenuDialog title="Leave the game?" onClose={()=>setPanel(null)}><p>Your campaign progress is saved. This will stop the menu scene; you can then close the tab.</p><button className="accent-button" onClick={()=>{setPanel(null);setExited(true)}}>LEAVE GAME</button><button onClick={()=>setPanel(null)}>STAY</button></MenuDialog>}
  </section></>
}
