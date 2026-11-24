import {requireCondition} from '../campaign/contracts.js'
import {CRYSTAL_KEY,CRYSTAL_GRANTS} from './crystalPolicy.js'
const MAX=1_000_000_000,validId=id=>typeof id==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9:._-]{0,159}$/.test(id)
const integer=n=>Number.isSafeInteger(n)&&n>0&&n<=MAX
export function createCrystalWallet({storage,key=CRYSTAL_KEY,grants=CRYSTAL_GRANTS,offers={},writeGuard=()=>true,onSubscriberError=error=>console.error('Crystal subscriber failed',error)}){
 requireCondition(storage?.getItem&&storage?.setItem,'CRYSTAL_STORAGE_UNAVAILABLE','Explicit crystal storage required')
 const listeners=new Set();let raw=null,state=null,view,notice=null,error=null
 const publish=()=>{view=Object.freeze({balance:state?.balance??null,revision:state?.revision??0,notice,error,ready:Boolean(state)&&writeGuard()});for(const fn of [...listeners])try{fn()}catch(e){onSubscriberError(e)}}
 function validate(value){
  requireCondition(value?.version===1&&Number.isSafeInteger(value.revision)&&value.revision>=0&&Array.isArray(value.transactions)&&value.transactions.length<=10000,'INVALID_CRYSTAL_SAVE','Invalid crystal ledger; existing data preserved')
  const ids=new Set();let balance=0
  for(const row of value.transactions){requireCondition(row&&validId(row.id)&&!ids.has(row.id)&&integer(row.amount)&&['credit','debit'].includes(row.kind)&&typeof row.source==='string','INVALID_CRYSTAL_SAVE','Invalid crystal transaction');ids.add(row.id)
   if(row.kind==='credit'){requireCondition(grants[row.source]?.amount===row.amount&&row.id===row.source,'INVALID_CRYSTAL_SAVE','Unknown crystal credit');balance+=row.amount}
   else {requireCondition(row.id.startsWith('purchase:')&&validId(row.source),'INVALID_CRYSTAL_SAVE','Invalid purchase receipt');balance-=row.amount}
   requireCondition(Number.isSafeInteger(balance)&&balance>=0&&balance<=MAX,'INVALID_CRYSTAL_SAVE','Invalid crystal balance history')
  }
  requireCondition(value.balance===balance&&value.revision===value.transactions.length,'INVALID_CRYSTAL_SAVE','Crystal total/receipt mismatch');return structuredClone(value)
 }
 function load(){try{raw=storage.getItem(key);state=raw===null?{version:1,revision:0,balance:0,transactions:[]}:validate(JSON.parse(raw));error=null}catch(e){state=null;error=e.message??'Crystal wallet unavailable'}publish();return view}
 function transact(row,label){
  requireCondition(state,'CRYSTAL_STORAGE_UNAVAILABLE','Crystal wallet unavailable; preserve existing data')
  requireCondition(writeGuard(),'CRYSTAL_WALLET_BUSY','Crystal wallet belongs to another tab or is not ready')
  const existing=state.transactions.find(t=>t.id===row.id)
  if(existing){requireCondition(['id','kind','source','amount'].every(k=>existing[k]===row[k]),'CRYSTAL_RECEIPT_CONFLICT','Receipt already belongs to another transaction');return {credited:false,duplicate:true,balance:state.balance}}
  requireCondition(state.transactions.length<10000,'CRYSTAL_LEDGER_FULL','Crystal ledger is full; nothing changed')
  requireCondition(row.kind!=='debit'||state.balance>=row.amount,'INSUFFICIENT_CRYSTALS','Not enough crystals')
  try{
   requireCondition(storage.getItem(key)===raw,'CRYSTAL_SAVE_CONFLICT','Crystal balance changed in another session; reload wallet before retrying')
   const next=validate({version:1,revision:state.revision+1,balance:state.balance+(row.kind==='credit'?row.amount:-row.amount),transactions:[...state.transactions,row]}),nextRaw=JSON.stringify(next)
   try{storage.setItem(key,nextRaw)}catch(e){if(storage.getItem(key)!==nextRaw)throw e}
   requireCondition(storage.getItem(key)===nextRaw,'CRYSTAL_SAVE_FAILED','Crystal save verification failed')
   raw=nextRaw;state=next;error=null;notice=Object.freeze({id:row.id,label,amount:row.kind==='credit'?row.amount:-row.amount,sequence:state.revision});publish();return {credited:row.kind==='credit',duplicate:false,balance:state.balance}
  }catch(e){error=e.message;publish();throw e}
 }
 const api={snapshot:()=>view,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},reload:load,hasReceipt:id=>Boolean(state?.transactions.some(t=>t.id===id)),grant(id){const rule=Object.hasOwn(grants,id)&&grants[id];requireCondition(rule&&validId(id)&&integer(rule.amount),'INVALID_CRYSTAL_GRANT','Unknown crystal reward');return transact({id,kind:'credit',source:id,amount:rule.amount},rule.label)},quote(offerId){const offer=Object.hasOwn(offers,offerId)&&offers[offerId];requireCondition(offer&&integer(offer.cost),'INVALID_CRYSTAL_OFFER','Unknown purchase offer');return {offerId,cost:offer.cost,affordable:Boolean(state&&state.balance>=offer.cost)}},purchase({offerId,transactionId}){requireCondition(validId(transactionId),'INVALID_CRYSTAL_TRANSACTION','Stable purchase id required');const quote=api.quote(offerId);requireCondition(!offers[offerId].requiresReceipt||api.hasReceipt(offers[offerId].requiresReceipt),'MISSING_PURCHASE_PREREQUISITE','Purchase prerequisite missing');return transact({id:'purchase:'+transactionId,kind:'debit',source:offerId,amount:quote.cost},'Crystal purchase')},reportError(message){error=String(message);publish()}}
 load();return Object.freeze(api)
}
