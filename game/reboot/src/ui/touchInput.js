const owners=new WeakMap()
export function joystickKeys(dx,dy,radius){
 if(![dx,dy,radius].every(Number.isFinite)||radius<=0)return []
 const length=Math.hypot(dx,dy),scale=length>radius?radius/length:1,x=dx*scale/radius,y=dy*scale/radius,keys=[]
 if(x<-.28)keys.push('a');if(x>.28)keys.push('d');if(y<-.28)keys.push('w');if(y>.28)keys.push('s');return keys
}
// Production touch input goes through the same keyboard owner/cooldowns. It
// cannot change health, position, objectives or rewards directly.
export function createTouchInput({target,document=target?.document,onReset=()=>{}}){
 if(!target?.dispatchEvent||owners.has(target))throw new Error('Touch input already owned or unavailable')
 const token={},pointers=new Map(),counts=new Map();let closed=false;owners.set(target,token)
 const emit=(type,key)=>{let event;if(target.KeyboardEvent)event=new target.KeyboardEvent(type,{key,repeat:false,bubbles:true,cancelable:true});else {event=new Event(type,{cancelable:true});Object.defineProperties(event,{key:{value:key},repeat:{value:false}})}target.dispatchEvent(event)}
 function update(id,keys){if(closed||!pointers.has(id))return;const next=new Set(keys),old=pointers.get(id);pointers.set(id,next);for(const key of old)if(!next.has(key)){const count=(counts.get(key)??1)-1;if(count)counts.set(key,count);else{counts.delete(key);emit('keyup',key)}}for(const key of next)if(!old.has(key)){const count=counts.get(key)??0;counts.set(key,count+1);if(count===0)emit('keydown',key)}}
 function begin(id,keys){if(closed||pointers.has(id))return;pointers.set(id,new Set());update(id,keys)}
 function end(id){if(!pointers.has(id))return;update(id,[]);pointers.delete(id)}
 function clear(notify=true){for(const id of [...pointers.keys()])end(id);if(notify!==false)onReset()}
 const hidden=()=>{if(document?.hidden)clear()}
 target.addEventListener('blur',clear);target.addEventListener('kalki-input-reset',clear);document?.addEventListener('visibilitychange',hidden)
 return {begin,update,end,clear,release(){if(closed)return;clear(false);closed=true;target.removeEventListener('blur',clear);target.removeEventListener('kalki-input-reset',clear);document?.removeEventListener('visibilitychange',hidden);if(owners.get(target)===token)owners.delete(target)}}
}
