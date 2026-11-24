// A single owned Telugu recording, synchronized to media time rather than timers.
// No voice recordings are bundled until provenance and the performance are approved.
export const TELUGU_RECORDINGS=Object.freeze({})
export function dialogueId(speaker,text){let hash=2166136261;for(const ch of `${speaker}|${text}`)hash=Math.imul(hash^ch.codePointAt(0),16777619);return 'te-'+(hash>>>0).toString(16)}
export function createDialoguePlayback({recordings=TELUGU_RECORDINGS,mediaFactory=()=>new Audio()}={}){
 const listeners=new Set();let media=null,token=0,closed=false,paused=false,volume=1,view=Object.freeze({state:'idle',text:'',speaker:'',id:null}),current=null,bindings=[]
 const publish=patch=>{view=Object.freeze({...view,...patch});for(const fn of listeners)fn()}
 function detach(){for(const [name,fn]of bindings)media?.removeEventListener(name,fn);bindings=[];if(media){media.pause();media.removeAttribute('src');media.load?.();media=null}}
 function stop(){token++;detach();current=null;publish({state:'idle',text:'',speaker:'',id:null})}
 async function play({speaker='Character',text,id=dialogueId(speaker,text)}){
  if(closed||!text)return false;stop();const epoch=token;current={id,speaker,text};const row=recordings[id]
  publish({id,speaker,text,state:row?'loading':'missing-recording',error:null})
  if(!row)return false
  if(row.language!=='te-IN'||!row.provenance||!row.rights||!row.url||!Array.isArray(row.cues)||!row.cues.length||row.cues.some((c,i)=>!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<=c.start||!c.text||(i>0&&c.start<row.cues[i-1].end))){publish({state:'invalid-recording',error:'Telugu recording metadata or subtitle cues invalid'});return false}
  try{media=mediaFactory();media.preload='auto';media.src=row.url;media.volume=volume
   const on=(name,fn)=>{media.addEventListener(name,fn);bindings.push([name,fn])}
   on('timeupdate',()=>{if(epoch!==token)return;const cue=row.cues.find(c=>media.currentTime>=c.start&&media.currentTime<c.end);publish({text:cue?.text??''})})
   on('ended',()=>{if(epoch===token)stop()});on('error',()=>{if(epoch===token){detach();publish({state:'failed',text,error:'Voice recording could not be played'})}})
   if(paused){publish({state:'paused'});return false}await media.play();if(epoch!==token)return false;publish({state:'playing'});return true
  }catch(e){if(epoch===token){detach();publish({state:'blocked',text,error:String(e.message)})}return false}
 }
 return {play,stop,snapshot:()=>view,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},configure(value){volume=Math.max(0,Math.min(1,value));if(media)media.volume=volume},setPaused(value){if(paused===value)return;paused=value;if(!media)return;if(value){media.pause();publish({state:'paused'})}else{const epoch=token;Promise.resolve(media.play()).then(()=>{if(epoch===token)publish({state:'playing'})},e=>{if(epoch===token)publish({state:'blocked',error:String(e.message)})})}},retry(){return current?play(current):Promise.resolve(false)},release(){if(closed)return;stop();closed=true;listeners.clear()}}
}
