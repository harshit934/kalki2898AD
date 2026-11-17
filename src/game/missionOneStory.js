import { create } from 'zustand'
import { useCampaignState } from './campaignSystem.js'
import { getPlayerWorldPosition } from './gameplayStore.js'
import { gameNow, isGameTimeHeld } from './gameClock.js'
import { useNarrativeCueState } from './narrativeCueSystem.js'

export const KASHI_RELAYS = Object.freeze([
  {id:'ghat-relay',name:'Ghat relay',position:[2.8,-.22,5],text:'ఘాట్ దారి గుర్తుపెట్టుకున్నా. తిరిగి రావడానికి ఇదే సులువైన మార్గం.',translation:'Ghat route marked. This is the easiest way back.'},
  {id:'market-relay',name:'Market relay',position:[-2.8,-.22,-25],text:'ముందు భారీ కాపలాదారు ఉన్నాడు. దెబ్బకు ముందు అతని కదలిక గమనించు.',translation:'A heavy guard is ahead. Watch his wind-up before committing.'},
  {id:'shrine-relay',name:'Shrine relay',position:[3,-.22,-49],text:'గుడి ముందు కాపలా ఉంది. ముగ్గురు కాపలాదారులను ఓడిస్తే చివరి పోరుకు దారి తెరుచుకుంటుంది.',translation:'The shrine is guarded. Defeat all three patrols to open the final encounter.'},
])
export const useMissionOneStory=create((set,get)=>({
  scanned:[],nearby:null,endingRound:-1,scanAt:-Infinity,
  reset(){set({scanned:[],nearby:null,endingRound:-1,scanAt:-Infinity})},
  setNearby(id){if(get().nearby!==id)set({nearby:id})},
  scan(id){
    if(useCampaignState.getState().selectedMissionId!=='mission-1'||isGameTimeHeld()||get().scanned.includes(id))return false
    const relay=KASHI_RELAYS.find(r=>r.id===id),p=getPlayerWorldPosition()
    if(!relay||Math.hypot(p.x-relay.position[0],p.z-relay.position[2])>2.6)return false
    set(s=>({scanned:[...s.scanned,id],nearby:null,scanAt:gameNow()}))
    useNarrativeCueState.setState(s=>({dialogue:{speaker:'BUJJI',lang:'te',text:relay.text,translation:relay.translation},dialogueId:s.dialogueId+1}))
    return true
  },
}))
