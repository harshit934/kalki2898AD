import {useState,useEffect,useRef} from 'react'
import {locationArtwork} from './menuPresentation.js'
function MenuDialog({ title, children, onClose }) {
  const ref = useRef(null)
  useEffect(() => { const node=ref.current, previous=document.activeElement;node.showModal();return()=>{node.close();if(previous?.isConnected)previous.focus()} }, [])
  return <dialog ref={ref} className="menu-dialog" aria-labelledby="menu-dialog-title" onCancel={e=>{e.preventDefault();onClose()}}><p className="eyebrow">KALKI / JOURNEY CONTROL</p><h2 id="menu-dialog-title">{title}</h2>{children}</dialog>
}
export default function MainMenu({onLevels,onContinue,continuation,completedMissionIds=[],onExplore,busy=false,saveStatus='unavailable'}) {
  const completed = completedMissionIds
  const [panel,setPanel]=useState(null),[exited,setExited]=useState(false)
  const [location,setLocation]=useState('kashi')
  const next=continuation
  function begin(){onContinue()}
  if(exited)return <section className="exit-panel"><p className="eyebrow">JOURNEY CONTROL</p><h1>Until the next horizon.</h1><p>You can now close this browser tab.</p><button className="accent-button" onClick={()=>setExited(false)}>RETURN TO MAIN MENU</button></section>
  return <><section className="main-menu" aria-label="Main menu">
    {location!=='kashi'&&!onExplore&&<img className="menu-location-art" src={locationArtwork[location]} alt={`${location} location concept artwork`}/>}<div className="menu-shade" />
    <div className="menu-copy"><p className="eyebrow">THE LAST CITY / THE FIRST HOPE</p><h1>KALKI<span>2898 AD</span></h1><p className="menu-tagline">A hunter. A city. An unfinished destiny.<br />Your road begins in the last city.</p>
      {!['saved', 'new'].includes(saveStatus) && <p role="alert">{saveStatus === 'recovered' ? 'Campaign recovered from its backup. Your original record is preserved.' : 'Campaign save needs attention (' + saveStatus + '). Progress may not be saved. Keep this page open; do not clear site data.'}</p>}
      <nav className="main-actions" aria-label="Main menu actions">
        <button aria-label="CONTINUE GAME" className="continue-action" disabled={busy || !next || ['corrupt', 'unavailable', 'conflict'].includes(saveStatus)} onClick={()=>begin(next)}><span className="menu-index">01</span><span>CONTINUE GAME<small>{next ? next.label : 'No saved checkpoint or active attempt'}</small></span><span aria-hidden="true">↗</span></button>
        <button aria-label="PLAY" disabled={['corrupt', 'unavailable', 'conflict'].includes(saveStatus)} onClick={onLevels}><span className="menu-index">02</span><span>PLAY<small>Choose a mission · explore 10 story arcs</small></span><span aria-hidden="true">↗</span></button>
        <button aria-label="NEW GAME" onClick={()=>setPanel('new')}><span className="menu-index">03</span><span>NEW GAME<small>Safe campaign reset unavailable</small></span><span aria-hidden="true">+</span></button>
        <button aria-label="SETTINGS" onClick={()=>setPanel('settings')}><span className="menu-index">04</span><span>SETTINGS</span><span aria-hidden="true">◈</span></button>
        <button aria-label="EXIT GAME" onClick={()=>setPanel('exit')}><span className="menu-index">05</span><span>EXIT GAME</span><span aria-hidden="true">→</span></button>
      </nav>
      <div className="menu-progress"><span>{completed.length.toString().padStart(2,'0')} CHAPTERS COMPLETE</span><div><i style={{width:`${completed.length}%`}} /></div><span>THE UNFINISHED HORIZON</span></div>
    </div>
    <div className="menu-location"><span className="location-dot" /><div><small>WORLDS ON THE HORIZON</small><strong>{location==='kashi'?'Kashi, the connected city':location==='shambhala'?'Shambhala, beneath the canopy':'The Complex, above the city'}</strong><span>LOCATION STUDY / {location==='kashi'?'PERSISTENT DISTRICT':'EXPLORABLE LOCATION'}</span><nav aria-label="Location previews">{[['kashi','KASHI'],['shambhala','SHAMBHALA'],['complex','THE COMPLEX']].map(([id,label])=><button key={id} aria-pressed={location===id} disabled={busy} onClick={()=>{setLocation(id);onExplore?.(id==='shambhala'?'shambala':id,{preview:true})}}>{label}</button>)}</nav><nav className="world-destinations" aria-label="Explore and cinematic destinations">{[['kashi','KASHI'],['complex','COMPLEX'],['shambala','SHAMBALA']].map(([id,label])=><div key={id}><button disabled={busy} onClick={()=>onExplore(id)}>EXPLORE {label}</button><button disabled={busy} onClick={()=>onExplore(id,{cinematic:true})}>{label} CINEMATIC</button></div>)}</nav></div></div>
    <div className="menu-edition">KALKI 2898 AD <span>AN UNFINISHED JOURNEY</span></div>
    {panel==='settings'&&<MenuDialog title="SETTINGS" onClose={()=>setPanel(null)}><p>Legacy audio, graphics and touch settings are not connected to the reboot renderer. No settings have been discarded or changed.</p><button onClick={()=>{setPanel(null);onExplore()}}>EXPLORE KASHI</button><button className="accent-button" onClick={()=>setPanel(null)}>BACK TO MAIN MENU</button></MenuDialog>}
    {panel==='new'&&<MenuDialog title="Start a fresh run?" onClose={()=>setPanel(null)}><p>A verified reboot archive-and-reset operation is not available. Your campaign has not been changed. Continue your saved journey or choose any mission through Play.</p><button className="accent-button" disabled>NEW CAMPAIGN UNAVAILABLE</button><button onClick={()=>setPanel(null)}>CANCEL</button></MenuDialog>}
    {panel==='exit'&&<MenuDialog title="Leave the game?" onClose={()=>setPanel(null)}><p>You can close this tab. This action does not reset or modify campaign data.</p><button className="accent-button" onClick={()=>{setPanel(null);setExited(true)}}>LEAVE GAME</button><button onClick={()=>setPanel(null)}>STAY</button></MenuDialog>}
  </section></>
}
