// Session-local, bounded diagnostic evidence only. No storage or gameplay writes.
// The canvas attribute is inspectable without reaching into hidden game objects.
export function createStateDiagnostics({target,canvas,sessionId,readState=()=>null,readPosition=()=>null,readClock=()=>null,now=()=>performance.now(),schedule,unschedule,limit=192}){
 let closed=false,paused=true,sequence=0,previous=null,frozen=null,timer=null,lastMismatch=null
 const events=[]
 function record(kind,detail={}){if(closed)return;events.push({sequence:++sequence,time:now(),kind,...detail});if(events.length>limit)events.splice(0,events.length-limit);if(canvas?.dataset){canvas.dataset.gameplayIntegrityOwner=sessionId;canvas.dataset.gameplayIntegrity=JSON.stringify({sessionId,paused,events})}}
 function snapshot(){const p=readPosition(),hud=canvas?.parentElement?.querySelector?.('aside[aria-label="Mission combat HUD"]'),toggle=hud?.querySelector?.('button[aria-controls="mission-combat-details"]'),progress=hud?.querySelector?.('progress[aria-label="Bhairava"]');return {state:readState(),position:p?{x:p.x,y:p.y,z:p.z}:null,clock:readClock(),hud:hud?{expanded:toggle?.getAttribute('aria-expanded'),health:progress?Number(progress.getAttribute('value')):null}:null}}
 // Runtime publishes active→suspended after the adapter acknowledges pause.
 // That expected publication is not a position/health/clock mutation.
 const invariants=value=>JSON.stringify({position:value.position,clock:value.clock,health:value.state?.health,actors:value.state?.actors})
 function sample(){if(closed)return;try{const value=snapshot(),signature=JSON.stringify(value);if(signature!==previous){record('state',{value});previous=signature}const mismatch=value.hud?.health!==null&&value.hud?.health!==undefined&&Number.isFinite(value.state?.health)&&value.hud.health!==value.state.health?JSON.stringify([value.hud.health,value.state.health]):null;if(mismatch&&mismatch!==lastMismatch)record('hud-health-mismatch',{displayed:value.hud.health,authoritative:value.state.health});lastMismatch=mismatch;const current=invariants(value);if(paused&&frozen!==null&&current!==frozen){record('unexpected-paused-mutation',{value,expected:JSON.parse(frozen)});frozen=current}}catch(error){record('diagnostic-error',{message:String(error.message)})}}
 function setPaused(value){if(closed)return;paused=value;record(value?'pause':'resume');frozen=null;try{if(value)frozen=invariants(snapshot());sample()}catch(error){record('diagnostic-error',{message:String(error.message)})}}
 const keys=new Set(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','control','shift','q','f','j','k','e','r',' ','enter'])
 const labels=new Set(['Pause','Resume','Minimise combat HUD','Restore combat HUD','Evening lighting','Day lighting','MAIN MENU','Restart mission','Exit mission'])
 function input(event){const node=event.target;if(node?.isContentEditable||node?.matches?.('input,textarea,select'))return;const key=event.key?.toLowerCase(),label=node?.getAttribute?.('aria-label')??node?.textContent?.trim();if(event.type.startsWith('key')&&!keys.has(key))return;if(event.type==='click'&&!labels.has(label))return;record('ui-input',{type:event.type,...(key?{key,repeat:Boolean(event.repeat)}:{}),trusted:event.isTrusted===true,tag:node?.tagName??null,...(labels.has(label)?{control:label}:{})})}
 const types=['keydown','keyup','click','blur','focus','pointerdown','pointerup'],listenerOptions={capture:true}
 for(const type of types)target?.addEventListener?.(type,input,listenerOptions)
 const start=schedule??target?.setInterval?.bind(target),stop=unschedule??target?.clearInterval?.bind(target)
 if(start)timer=start(sample,250)
 record('created');sample()
 return {record,sample,setPaused,snapshot:()=>({sessionId,paused,events:events.map(e=>structuredClone(e))}),release(){if(closed)return;record('released');closed=true;if(timer!==null)stop?.(timer);for(const type of types)target?.removeEventListener?.(type,input,listenerOptions);if(canvas?.dataset?.gameplayIntegrityOwner===sessionId){delete canvas.dataset.gameplayIntegrityOwner;delete canvas.dataset.gameplayIntegrity}}}
}
