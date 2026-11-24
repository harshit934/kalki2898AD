import {requireCondition} from '../campaign/contracts.js'

export function createCombatTactics(){
 let counterUntil=-1,specialReady=0,epoch=0
 return {block(now){requireCondition(Number.isFinite(now),'INVALID_COMBAT_TIME','Finite combat time required');counterUntil=now+900},attack(type,now,base){requireCondition(['light','heavy','special'].includes(type)&&Number.isFinite(now)&&Number.isFinite(base)&&base>0,'INVALID_ATTACK','Valid real attack required');if(type==='special'&&now<specialReady)return {accepted:false,code:'SPECIAL_COOLDOWN'};const counter=type==='heavy'&&now<=counterUntil;if(counter)counterUntil=-1;if(type==='special')specialReady=now+8000;return {accepted:true,damage:base*(type==='special'?1.7:counter?1.5:1),counter,special:type==='special',epoch}},reset(){counterUntil=-1;epoch++},snapshot:now=>({counterReady:now<=counterUntil,specialReadyIn:Math.max(0,specialReady-now)})}
}
