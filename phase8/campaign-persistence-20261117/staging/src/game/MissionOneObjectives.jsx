import { KASHI_RELAYS, useMissionOneStory } from './missionOneStory.js'
export default function MissionOneObjectives(){
  const scanned=useMissionOneStory(s=>s.scanned),nearby=useMissionOneStory(s=>s.nearby)
  const relay=KASHI_RELAYS.find(r=>r.id===nearby)
  return <div className="mission1-relay-objectives">
    <strong>BUJJI ROUTE SCANS <span>{scanned.length} / {KASHI_RELAYS.length}</span></strong>
    <p>Optional field intelligence. Inspect a nearby brass relay with E, R or Interact. Clear all three patrols, defeat the Warden and recover the relic. Extra crystals are optional currency.</p>
    {relay&&<button type="button" onClick={()=>useMissionOneStory.getState().scan(relay.id)}>SCAN {relay.name.toUpperCase()}</button>}
    {!relay&&<small>{scanned.length===3?'All route intelligence recovered.':'Ghat → market → shrine. Move close to a field relay to scan.'}</small>}
  </div>
}

export function MissionOneScanPrompt(){
  const nearby=useMissionOneStory(s=>s.nearby),relay=KASHI_RELAYS.find(r=>r.id===nearby)
  return relay ? <button type="button" className="mission1-scan-prompt" onClick={()=>useMissionOneStory.getState().scan(relay.id)}>E · SCAN {relay.name.toUpperCase()}</button> : null
}
