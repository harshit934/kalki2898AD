import {createElement as h,useEffect,useSyncExternalStore} from 'react'
import {CAMPAIGN_REWARDS,BIKE_UNLOCK} from '../content/campaignRewards.js'
export default function CampaignRewards({feed,wallet,completedMissionId}){
 const view=useSyncExternalStore(feed.subscribe,feed.snapshot),notice=view.queue[0]
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>feed.dismiss(notice.sequence),6500);return()=>clearTimeout(timer)},[feed,notice])
 return h(CampaignRewardsView,{notice,wallet,completedMissionId,bike:view.bikeUnlocked})
}
export function CampaignRewardsView({notice,wallet,completedMissionId,bike}){
 const config=CAMPAIGN_REWARDS[completedMissionId]
 return h('div',{className:'campaign-reward-layer'},notice&&h('section',{key:notice.sequence,className:'campaign-reward-toast',role:'status','aria-live':'polite'},h('small',null,'REWARD SAVED'),h('strong',null,'◆ +'+notice.amount+' crystals'),h('p',null,notice.label),notice.bike&&h('p',{className:'bike-unlocked'},BIKE_UNLOCK.name+' unlocked · available in vehicle controls')),
 config&&h('section',{className:'campaign-reward-summary','aria-label':'Mission reward summary'},h('strong',null,'Victory rewards'),h('p',null,`Mission: ${config.completion} crystals · ${wallet.hasReceipt('mission:'+completedMissionId+':complete')?'Already earned — replay will not pay again':'Awaiting saved reward; retry the wallet if needed'}`),h('p',null,`Boss: ${config.boss} crystals · ${wallet.hasReceipt('objective:'+completedMissionId+':'+config.bossObjective)?'Already earned':'Not yet recorded'}`),h('p',null,bike?BIKE_UNLOCK.name+' unlocked':BIKE_UNLOCK.condition)))
}
