import StoryCinematic from './ui/StoryCinematic.js'
import {registerStoryMissions} from './gameplay/storyMissions.js'
import BrandLogo from './ui/BrandLogo.js'
import StoryConversation from './ui/StoryConversation.js'
import WorldAudioControls from './ui/WorldAudioControls.js'
import {createJourneyMemory} from './world/locations/journeyMemory.js'
import EquipmentPanel from './ui/EquipmentPanel.js'
import {createArsenal,SHOP_OFFERS} from './equipment/arsenal.js'
import {createPersonalCraft} from './world/personalCraft.js'
import WayfindingHUD from './ui/WayfindingHUD.js'
import CrystalHUD from './ui/CrystalHUD.js'
import {createBrowserCrystalWallet} from './economy/browserCrystalWallet.js'
import {bindMissionCrystalRewards} from './economy/missionCrystalRewards.js'
import MobileControls,{isFlightPrompt} from './ui/MobileControls.js'
import './ui/mobileControls.css'
import GameplayActions from './ui/GameplayActions.js'
import './ui/gameplayScreen.css'
import {useEffect,useMemo,useState,useSyncExternalStore} from 'react'

import {createRoot} from 'react-dom/client'
import {renderFoundation} from './ui/foundationRoot.js'

import {catalogue} from './campaign/catalogue.js'

import {createRepository} from './persistence/repository.js'

import {createTravelFoundation} from './gameplay/travelFoundation.js'

import {registerMission1} from './gameplay/mission1Registration.js'

import {MISSION1_CONTENT} from './content/mission1.js'



import './style.css'
import MainMenu from './ui/MainMenu.jsx'
import CombatHUD from './ui/CombatHUD.js'
import GameplayFullscreen from './ui/GameplayFullscreen.js'
import './ui/gameplayFullscreen.css'
import MissionSelect from './ui/MissionSelect.jsx'
import {missionCards,continuationFor} from './ui/menuPresentation.js'
import './ui/menuScreens.css'

const unavailableSubscribe=()=>()=>{}

const unavailableSnapshot=()=>null

export function Foundation(){

 const [hostState,setHostState]=useState({state:'unavailable',error:'Mission 1 native combat host registered; not yet browser-verified.'})

 const boot=useMemo(()=>{let wallet;try{wallet=createBrowserCrystalWallet({storage:window.localStorage,locks:window.navigator.locks,offers:SHOP_OFFERS});const arsenal=createArsenal({wallet,storage:window.localStorage}),personalCraft=createPersonalCraft({storage:window.localStorage});const integration=createTravelFoundation({catalogue,campaignEnabled:true,currency:wallet,arsenal,personalCraft,positionMemory:createJourneyMemory({storage:window.localStorage}),repository:createRepository(window.localStorage,catalogue),canvas:()=>document.getElementById('reboot-session-canvas'),onState:setHostState});registerMission1(integration,{combat:{stronghold:true}});registerStoryMissions(integration);const rewards=bindMissionCrystalRewards({runtime:integration.runtime,wallet});void wallet.whenReady.then(ready=>{if(ready)rewards.retry()});return {runtime:integration.runtime,integration,wallet,rewards,arsenal,personalCraft}}catch(error){wallet?.releaseLease();return {error}}},[])

 useEffect(()=>{let active=true;void boot.integration?.openWorld({menu:true}).catch(error=>{if(active&&error.code!=='SESSION_ACTIVE')setHostState({state:'unavailable',worldMode:'failed',error:error.message})});const shutdown=event=>{if(event?.persisted)return;boot.rewards?.release();boot.arsenal?.release();boot.wallet?.releaseLease();void boot.integration?.release().catch(error=>console.error('Foundation shutdown failed',error))};window.addEventListener('pagehide',shutdown);return()=>{active=false;window.removeEventListener('pagehide',shutdown);shutdown()}},[boot])

 const closeWeaponShop=useMemo(()=>()=>boot.integration?.closeWeaponShop(),[boot])

 const readWayfinding=useMemo(()=>()=>boot.integration?.navigationView?.()??null,[boot])

 const view=useSyncExternalStore(boot.runtime?.subscribe??unavailableSubscribe,boot.runtime?.snapshot??unavailableSnapshot)

 const campaignView=useSyncExternalStore(boot.integration?.campaign?.subscribe??unavailableSubscribe,boot.integration?.campaign?.snapshot??unavailableSnapshot)
 const [message,setMessage]=useState(()=>boot.error?.message??'Browse any chapter. Complete each contract to unlock the next playable mission.')

 const [screen,setScreen]=useState('home')

 const [busy,setBusy]=useState(false)

 const [night,setNight]=useState(false)

 async function run(action){setBusy(true);try{await action();setMessage('Operation completed.')}catch(error){setMessage(`${error.code??'ERROR'}: ${error.message}`)}finally{setBusy(false)}}

 const mission=catalogue.get(view?.progress.selectedMissionId)

 function select(id){try{boot.runtime.select(id);setMessage('Selected independently. Completion and inventory unchanged.')}catch(error){setMessage(`${error.code}: ${error.message}`)}}

 async function start(id=mission?.id){return run(async()=>{if(!boot.integration?.hasContent(id))throw Object.assign(new Error('Runtime content not implemented; no fallback was launched.'),{code:'MISSING_RUNTIME_CONTENT'});await boot.integration.startMission(id);setScreen('world')})}
 const cards=missionCards(catalogue,view?.progress,id=>Boolean(boot.integration?.hasContent(id)),campaignView)
 const continuation=continuationFor(view?.progress,view?.session,id=>Boolean(boot.integration?.hasContent(id)))
 async function home(){await run(async()=>{const session=boot.runtime.snapshot().session;if(session?.state==='active')await boot.runtime.suspend('menu');await boot.integration.closeWorldView();if(!session||['failed','completed'].includes(session.state))await boot.integration.openWorld({menu:true});setScreen('home')})}
 async function continueGame(){await run(async()=>{if(!continuation)throw new Error('No valid continuation');if(continuation.kind==='checkpoint'){await boot.integration.recoverMission(continuation.id)}else if(view.session.state==='suspended')await boot.runtime.resume('menu');setScreen('world')})}
 async function missionSelection(){await run(async()=>{if(boot.runtime.snapshot().session)await boot.runtime.end();await boot.integration.closeWorldView();await boot.integration.openWorld({menu:true});setScreen('missions')})}
 async function replay(){if(boot.runtime.snapshot().session)return run(()=>boot.runtime.restart());return start(mission?.id)}
 const nextMission=catalogue.get('mission-'+((mission?.number??1)+1))
 const nextPlayable=Boolean(nextMission&&boot.integration?.hasContent(nextMission.id))
 useEffect(()=>{window.dispatchEvent(new Event('resize'))},[screen])
 async function cinematic(id=hostState.locationId??'kashi'){return explore(id,{cinematic:true})}
 async function explore(id='kashi',options={}){await run(async()=>{if(options.preview){await boot.integration.previewLocation(id);return}await boot.integration.exploreLocation(id,options);setScreen('world')})}

 return <main className={screen==='world'?'foundation-app gameplay-active':'foundation-app'}><div className={screen==='world'?'world-view':'world-view menu-world-view'}><section id="kashi-gameplay-view" aria-label="Kashi district" style={{position:"relative"}}>{screen==='world'&&<GameplayFullscreen/>}{screen==='world'&&<StoryCinematic scene={hostState.cinematic} onSkip={()=>boot.integration.skipStoryCinematic()}/>} {screen==='world'&&!hostState.cinematic&&campaignView?.conversation&&<StoryConversation conversation={campaignView.conversation} onChoose={id=>run(()=>boot.integration.storyChoice(id))} busy={busy}/>} {screen==='world'&&boot.integration?.audio&&<WorldAudioControls audio={boot.integration.audio}/>}{screen==='world'&&boot.arsenal&&<EquipmentPanel arsenal={boot.arsenal} craft={boot.personalCraft?.snapshot()} shop={hostState.worldInteraction?.weaponShop} onCloseShop={closeWeaponShop} disabled={busy||Boolean(view?.session&&view.session.state==='active')} onVehicle={action=>boot.integration.personalVehicle(action)}/>}{screen==='world'&&boot.wallet&&<CrystalHUD wallet={boot.wallet} onRetry={()=>{void boot.wallet.retryLease().then(ready=>{if(ready)boot.rewards.retry()})}}/>}<p className="eyebrow">KASHI · CONNECTED CITY</p><h1>The city beyond the salvage road</h1><p>Explore the arcades, avenues and domed landmark. WASD or arrows to walk · Control to sprint. Missions retain their own objectives and combat.</p><canvas id="reboot-session-canvas" aria-label="Kashi world and mission renderer" style={{width:'100%',height:'60vh',display:'block',borderRadius:8}} />{screen==='world'&&hostState.locationId==='kashi'&&hostState.worldMode!=='mission-room'&&<WayfindingHUD readView={readWayfinding} enabled={hostState.worldMode==='exploration'||Boolean(view?.session&&['active','suspended'].includes(view.session.state))}/> }{hostState.worldMode!=='mission-room'&&screen==="world"&&<CombatHUD session={view?.session} hint={hostState.combatHint} location={hostState.combatLocation} action={hostState.combatAction}/>}{screen==='world'&&!hostState.cinematic&&<GameplayActions session={view?.session} completed={hostState.state==='completed'} score={view?.progress.score??0} busy={busy} nextPlayable={nextPlayable} worldMode={hostState.worldMode} roomLabel={hostState.roomLabel} flightMessage={hostState.worldInteraction?.message} onCinematic={['kashi','complex','shambala'].includes(hostState.locationId)?()=>cinematic(hostState.locationId):undefined} locationId={hostState.locationId} onVisitRoom={()=>run(()=>boot.integration.visitRoom())} onReturnRoom={()=>run(()=>boot.integration.returnFromMissionRoom())} onTravel={id=>run(()=>boot.integration.travel(id))} onSkipCinematic={()=>boot.integration.skipWorldIntro()} guidance={hostState.missionGuidance} message={message} error={hostState.error} interaction={hostState.interaction?.label??hostState.worldInteraction?.prompt} onInteract={()=>run(()=>view?.session?boot.integration.interact(view.session.id):boot.integration.interactWorld())} onHome={home} onMissions={missionSelection} onRestart={replay} onRevive={()=>run(()=>boot.runtime.revive())} onNext={()=>nextPlayable&&start(nextMission.id)} onPause={()=>run(()=>view?.session?.state==='active'?boot.runtime.suspend('menu'):boot.runtime.resume('menu'))}/>}{screen==='world'&&<MobileControls enabled={!busy&&(hostState.worldMode==='mission-room'||(view?.session?view.session.state==='active'&&view.session.playerResources?.health>0:hostState.worldMode==='exploration'))} mission={Boolean(view?.session)&&hostState.worldMode!=='mission-room'} heals={view?.session?.playerResources?.healingCharges??0} flight={isFlightPrompt(hostState.worldInteraction?.prompt)}/>}</section></div><div hidden={screen!=='world'} className="runtime-panel"><button onClick={home} disabled={busy}>MAIN MENU</button><section>{hostState.worldMode==='cinematic'&&<button onClick={()=>boot.integration.skipWorldIntro()}>Skip establishing view</button>}<button disabled={!boot.integration||busy||Boolean(view?.session&&!['failed','completed'].includes(view.session.state))||hostState.worldMode==='preparing'} onClick={()=>run(()=>boot.integration.openWorld({intro:false}))}>Explore Kashi</button><button disabled={!boot.integration||busy||Boolean(view?.session&&!['failed','completed'].includes(view.session.state))||hostState.worldMode==='preparing'} onClick={()=>run(()=>boot.integration.openWorld())}>Replay city view</button>{hostState.worldMode&&<p role="status">City: {hostState.worldMode}</p>}<button disabled={!boot.integration||busy||hostState.state==='unavailable'||hostState.worldMode==='preparing'} onClick={()=>run(async()=>{boot.integration.setWorldLighting(night?'day':'night');setNight(!night)})}>{night?'Day lighting':'Evening lighting'}</button>{hostState.worldInteraction?.insideLabel&&<p role="status">Inside: {hostState.worldInteraction.insideLabel}</p>}{hostState.worldInteraction?.prompt&&hostState.worldMode==='exploration'&&<button disabled={busy} onClick={()=>run(()=>boot.integration.interactWorld())}>E — {hostState.worldInteraction.prompt}</button>}{hostState.worldInteraction?.message&&<p role="status">{hostState.worldInteraction.message}</p>}</section><header><p className="eyebrow">KALKI · REBOOT</p><h1>Choose your chapter</h1><p>Four playable routes. Missions unlock through completion; later chapters remain unreleased.</p></header>

  <section className="notice"><strong>Mission 1 registered — playable readiness not verified</strong><p>Mission 1 now has registered content; native combat is integrated but not browser-verified. The catalogue does not represent 100 playable missions. Missing content produces an explicit error and never launches Mission 1.</p></section>

  <section className="summary"><div><h2>{mission?.title??'Save requires attention'}</h2><p>{mission?`Mission ${mission.number} · Arc ${mission.arcId}`:'No campaign was reset.'}</p><button disabled={!boot.runtime||busy||['preparing','active','suspended','concluding','releasing'].includes(view?.session?.state)} onClick={()=>start()}>Start selected mission</button></div><div><p>Completed: {view?.progress.completedMissionIds.length??'unavailable'} / 100</p><p>Reboot score: {view?.progress.score??0}</p><p>Earned currency: {view?.progress.currency??'unavailable'}</p><p>Permanent weapons: {view?.progress.permanentInventory.weaponIds.length??'unavailable'}</p></div></section>

  <section aria-label="Mission session controls">

   {view?.progress.missionCheckpoints?.[mission?.id]&&<button disabled={busy||Boolean(view?.session&&!['failed','completed'].includes(view.session.state))} onClick={()=>run(()=>boot.runtime.recover(mission.id))}>Continue checkpoint</button>}

   {view?.session&&<>

    {['active','suspended'].includes(view.session.state)&&<button disabled={busy} onClick={()=>run(()=>view.session.state==='active'?boot.runtime.suspend('menu'):boot.runtime.resume('menu'))}>{view.session.state==='active'?'Pause':'Resume'}</button>}

    {['active','suspended'].includes(view.session.state)&&<button disabled={busy} onClick={()=>run(()=>boot.runtime.saveCheckpoint('salvage-road-entry'))}>Save checkpoint</button>}

    {['active','suspended','failed'].includes(view.session.state)&&<button disabled={busy} onClick={()=>run(()=>boot.runtime.restart())}>Restart mission</button>}

    {view.session.state==='concluding'&&<button disabled={busy} onClick={()=>run(()=>boot.integration.finishMission(view.session.id))}>Retry completion save</button>}

    <button disabled={view.session.state==='releasing'} onClick={()=>run(()=>boot.runtime.end())}>Exit mission</button>

   </>}

  </section>

  {view?.session?.missionId==='mission-1'&&<section aria-label="Mission 1 objectives"><p>WASD/arrows: move · Control: sprint · J/K: attack · E: interact</p><ul>{MISSION1_CONTENT.objectives.map(o=><li key={o.id}>{o.label??o.id}: {view.session.objectiveStates[o.id]}</li>)}</ul></section>}

  {hostState.interaction&&view?.session?.state==='active'&&<button disabled={busy} onClick={()=>run(()=>boot.integration.interact(view.session.id))}>E — {hostState.interaction.label}</button>}

  {hostState.cleanupWarnings?.length>0&&<p role="alert">Mission save committed; cleanup requires attention: {hostState.cleanupWarnings.join('; ')}</p>}

  {hostState.interactionMessage&&<p role="status">{hostState.interactionMessage}</p>}

  {hostState.state==='completed'&&<p role="status">Mission 1 completed. Verified rewards saved.</p>}

  {view?.session&&<p>Active attempt: {view.session.missionId} · {view.session.state}. Selecting a chapter does not replace this attempt.</p>}

  {view?.session?.playerResources?.health!==undefined&&<p>Health: {view.session.playerResources.health} / {view.session.playerResources.maxHealth}</p>}

  {view?.session?.actorStates?.filter(a=>a.category==='boss'&&a.state!=='removed').map(a=><p key={a.instanceId}>Warden: {a.health} / {a.maxHealth}</p>)}

  <p role="status">Gameplay host: {hostState.state}{hostState.error?` — ${hostState.error}`:''}</p>

  <p className="status" role="status">{message}</p>

  <footer>Separate reboot save namespace. Legacy saves are never opened automatically. Character content awaits the authoritative Character Bible.</footer>

 </div>{screen!=='world'&&<div className="menu-shell"><header className="restored-masthead"><BrandLogo/><span>KALKI 2898 AD · CAMPAIGN</span></header>{screen==='home'?<MainMenu onLevels={()=>setScreen('missions')} onContinue={continueGame} continuation={continuation} completedMissionIds={view?.progress.completedMissionIds??[]} onExplore={explore} busy={busy} saveStatus={boot.runtime?'saved':'unavailable'}/>:<MissionSelect missions={cards} selectedMissionId={mission?.id} onSelect={select} onStart={start} onBack={()=>setScreen('home')} busy={busy}/>}<p className="menu-operation-status" role="status">{campaignView?.error??message}</p></div>}
 </main>

}

renderFoundation({container:document.getElementById('root'),element:<Foundation/>,createRoot,hotData:import.meta.hot?.data})

