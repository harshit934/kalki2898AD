import {createElement as h,useEffect,useState,useSyncExternalStore} from 'react'
const empty=()=>()=>{},unavailable=Object.freeze({balance:null,error:'Unavailable'}),snapshot=()=>unavailable
export default function CrystalHUD({wallet,onRetry}){
 const view=useSyncExternalStore(wallet?.subscribe??empty,wallet?.snapshot??snapshot),[expired,setExpired]=useState(0)
 useEffect(()=>{if(!view.notice)return;const timer=setTimeout(()=>setExpired(view.notice.sequence),6000);return()=>clearTimeout(timer)},[view.notice])
 const notice=view.notice?.sequence>expired?view.notice:null
 return h(CrystalHUDView,{...view,notice,onRetry})
}
export function CrystalHUDView({balance,notice,error,onRetry}){return h('aside',{'aria-label':'Crystal wallet',style:{position:'absolute',right:16,top:82,zIndex:3,color:'#faedca',background:'#112a29e8',border:'1px solid #bfa258',borderRadius:6,padding:'9px 12px',maxWidth:'min(260px,45vw)',font:'13px system-ui',pointerEvents:'none'}},h('strong',{'aria-label':'Crystal balance'},'◆ Crystals: '+(balance??'Unavailable')),notice?h('div',{role:'status','aria-live':'polite'},`${notice.amount>0?'+':''}${notice.amount} crystals · ${notice.label}`):null,error?h('div',{role:'alert'},error,h('button',{onClick:onRetry,style:{pointerEvents:'auto'}},'Retry crystal wallet')):null)}
