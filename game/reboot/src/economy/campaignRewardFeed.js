import {BIKE_UNLOCK} from '../content/campaignRewards.js'

// The persisted completion receipt is the entitlement. No separate flag can
// drift from the canonical wallet or unlock an unearned vehicle.
export const bikeUnlocked=wallet=>Boolean(wallet?.snapshot().ready&&wallet.hasReceipt(BIKE_UNLOCK.receipt))
export function createCampaignRewardFeed(wallet){
 const listeners=new Set();let queue=[],last=wallet.snapshot().notice?.sequence??0,closed=false,view=Object.freeze({queue:[],bikeUnlocked:bikeUnlocked(wallet)})
 const publish=()=>{view=Object.freeze({queue:Object.freeze([...queue]),bikeUnlocked:bikeUnlocked(wallet)});for(const fn of [...listeners])fn()}
 const stop=wallet.subscribe(()=>{if(closed)return;const notice=wallet.snapshot().notice;if(notice&&notice.sequence>last){last=notice.sequence;if(/^(mission:|objective:mission-[1-4]:defeat-)/.test(notice.id))queue=[...queue.slice(-7),Object.freeze({...notice,bike:notice.id===BIKE_UNLOCK.receipt})]}publish()})
 return {snapshot:()=>view,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},dismiss(sequence){queue=queue.filter(n=>n.sequence!==sequence);publish()},release(){closed=true;stop();queue=[];listeners.clear()}}
}
