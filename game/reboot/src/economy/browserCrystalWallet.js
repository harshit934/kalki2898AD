import {createCrystalWallet} from './crystalWallet.js'
import {CRYSTAL_KEY} from './crystalPolicy.js'
// One origin-wide writer for the full page lifetime. localStorage CAS alone is
// not atomic across tabs. Unsupported browsers stay read-only instead of racing.
export function createBrowserCrystalWallet({storage,locks,onSubscriberError,offers}){
 let owns=false,released=false,unlock,pending=null
 const hold=new Promise(resolve=>{unlock=resolve}),wallet=createCrystalWallet({storage,writeGuard:()=>owns&&!released,onSubscriberError,offers})
 function acquire(){if(released)return Promise.resolve(false);if(owns){wallet.reload();return Promise.resolve(true)}if(pending)return pending
  if(!locks?.request){wallet.reportError('Crystal saving requires browser Web Locks; wallet is read-only.');return Promise.resolve(false)}
  let resolve;const result=new Promise(fn=>{resolve=fn});pending=result
  const done=value=>{pending=null;resolve(value)}
  void locks.request(CRYSTAL_KEY+':writer',{mode:'exclusive',ifAvailable:true},async lock=>{
   if(!lock||released){if(!released)wallet.reportError('Crystal wallet is active in another tab. Close that game tab and retry.');done(false);return}
   owns=true;wallet.reload();done(true);await hold;owns=false
  }).catch(error=>{wallet.reportError('Crystal wallet lock failed: '+error.message);done(false)})
  return result
 }
 const whenReady=acquire()
 return Object.freeze({...wallet,whenReady,retryLease:acquire,releaseLease(){if(released)return;released=true;owns=false;unlock()}})
}
