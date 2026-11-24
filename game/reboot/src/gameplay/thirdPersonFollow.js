import {Vector3} from 'three'

// Facing-follow and temporary manual orbit share one rig. Existing independent
// orbit remains opt-in compatible. The binding owns collision and movement basis.
export function createThirdPersonFollow({orbit=false,followFacing=false,heading:initialHeading=0,state=null}={}){
 const defaultPitch=Math.atan2(1.2,4.15),distance=Math.hypot(4.15,1.2)
 let pivot=null,yaw=orbit?initialHeading:null,targetYaw=initialHeading,pitch=defaultPitch,targetPitch=defaultPitch,manualRemaining=0,restored=false
 if(state&&[state.yaw,state.pitch].every(Number.isFinite)){yaw=state.yaw;targetYaw=yaw;pitch=Math.max(-.15,Math.min(1.05,state.pitch));targetPitch=pitch;restored=true}
 return {reset(){pivot=null;if(!orbit)yaw=null},heading:()=>yaw??initialHeading,snapshot:()=>({yaw:yaw??initialHeading,pitch}),
 rotate(dx,dy){if(!orbit||![dx,dy].every(Number.isFinite))return;targetYaw-=dx*.003;targetPitch=Math.max(-.15,Math.min(1.05,targetPitch+dy*.003));manualRemaining=.8},
 update(position,heading,delta,moving=true){
  if(![position.x,position.y,position.z,heading,delta].every(Number.isFinite)||delta<=0)throw new RangeError('Finite camera position, heading and positive delta required')
  if(!pivot){pivot=new Vector3(position.x,position.y,position.z);if(!orbit)yaw=heading}
  const alpha=1-Math.exp(-12*Math.min(delta,.1))
  pivot.lerp(new Vector3(position.x,position.y,position.z),alpha)
  if(restored&&moving)restored=false
  if(orbit&&followFacing){
   manualRemaining=Math.max(0,manualRemaining-delta)
   if(manualRemaining===0&&(!restored||moving))targetYaw=yaw+Math.atan2(Math.sin(heading-yaw),Math.cos(heading-yaw))
   const manual=manualRemaining>0,difference=manual?targetYaw-yaw:Math.atan2(Math.sin(targetYaw-yaw),Math.cos(targetYaw-yaw)),step=difference*(1-Math.exp(-(manual?12:5)*Math.min(delta,.1))),limit=(manual?8:3)*Math.min(delta,.1)
   yaw+=Math.max(-limit,Math.min(limit,step))
  }else yaw+=orbit?(targetYaw-yaw)*alpha:Math.atan2(Math.sin(heading-yaw),Math.cos(heading-yaw))*alpha
  pitch+=(targetPitch-pitch)*alpha
  const reach=orbit?distance*Math.cos(pitch):4.15,height=orbit?1.25+distance*Math.sin(pitch):2.45
  return {position:new Vector3(pivot.x+Math.sin(yaw)*reach,position.y+height,pivot.z+Math.cos(yaw)*reach),target:new Vector3(pivot.x,position.y+1.25,pivot.z)}
 }}
}

// Automatic camera recentering must not feed back into a held movement gesture.
// Fresh direction input or deliberate mouse orbit can acquire a new reference.
export function createMovementReference(readHeading){
 let heading=null,x=0,y=0
 return {input(value){if(value.x!==x||value.y!==y)heading=null;x=value.x;y=value.y},orbit(){heading=null},reset(){heading=null;x=0;y=0},heading(){if(heading===null)heading=readHeading();return heading}}
}

// Mouse motion over the owned gameplay canvas or an explicit right drag orbits
// the camera. No pointer lock, document-wide mouse capture, or additional loop.
export function bindOrbitPointer({target,canvas,signal,rotate}){
 let active=false,closed=false,dragging=false,last=null,touchId=null
 const live=()=>active&&!closed&&!signal.aborted
 const owns=e=>canvas?e.target===canvas:e.target?.tagName==='CANVAS'
 const down=e=>{if(!live()||!owns(e)||(e.pointerType!=='touch'&&e.isPrimary===false))return;if(e.pointerType==='touch'){if(touchId!==null)return;touchId=e.pointerId;dragging=true;canvas?.setPointerCapture?.(e.pointerId);e.preventDefault()}last={x:e.clientX,y:e.clientY};if(e.button===2){dragging=true;e.preventDefault()}}
 const move=e=>{if(!live()||(e.pointerType==='touch'?e.pointerId!==touchId:e.isPrimary===false))return;if(e.pointerType==='touch')e.preventDefault();if(!dragging&&!owns(e)){last=null;return}
  if(!last){last={x:e.clientX,y:e.clientY};return}
  const dx=e.clientX-last.x,dy=e.clientY-last.y;last={x:e.clientX,y:e.clientY}
  if(Number.isFinite(dx)&&Number.isFinite(dy))rotate(Math.max(-100,Math.min(100,dx)),Math.max(-100,Math.min(100,dy)))
 }
 const up=e=>{if(touchId!==null&&e?.pointerType==='touch'&&e.pointerId!==touchId)return;if(touchId!==null&&canvas?.hasPointerCapture?.(touchId))canvas.releasePointerCapture(touchId);touchId=null;dragging=false;last=null}
 const menu=e=>{if(live()&&owns(e))e.preventDefault()}
 const events=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['lostpointercapture',up],['blur',up],['contextmenu',menu]]
 function pause(){up();if(!active)return;active=false;for(const [name,fn]of events)target.removeEventListener(name,fn)}
 function resume(){if(closed||signal.aborted)throw new Error('Orbit controls released');if(active)return;active=true;for(const [name,fn]of events)target.addEventListener(name,fn)}
 function release(){if(closed)return;pause();closed=true;signal.removeEventListener('abort',release)}
 signal.addEventListener('abort',release,{once:true});return {pause,resume,release}
}

export function bindHeadingDrag({target,signal,turn}){
 let active=false,closed=false,dragging=false,lastX=0
 const down=e=>{if(e.button!==2||e.target?.tagName!=='CANVAS')return;dragging=true;lastX=e.clientX;e.preventDefault()}
 const move=e=>{if(!dragging||signal.aborted)return;const dx=e.clientX-lastX;lastX=e.clientX;if(Number.isFinite(dx))turn(-Math.max(-100,Math.min(100,dx))*.004)}
 const up=()=>{dragging=false}
 const menu=e=>{if(e.target?.tagName==='CANVAS')e.preventDefault()}
 function pause(){dragging=false;if(!active)return;active=false;target.removeEventListener('pointerdown',down);target.removeEventListener('pointermove',move);target.removeEventListener('pointerup',up);target.removeEventListener('pointercancel',up);target.removeEventListener('blur',up);target.removeEventListener('contextmenu',menu)}
 function resume(){if(closed||signal.aborted)throw new Error('Heading controls released');if(active)return;active=true;target.addEventListener('pointerdown',down);target.addEventListener('pointermove',move);target.addEventListener('pointerup',up);target.addEventListener('pointercancel',up);target.addEventListener('blur',up);target.addEventListener('contextmenu',menu)}
 function release(){if(closed)return;pause();closed=true;signal.removeEventListener('abort',release)}
 signal.addEventListener('abort',release,{once:true});return {pause,resume,release}
}
