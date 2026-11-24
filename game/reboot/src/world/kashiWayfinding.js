import {BUILDINGS} from './locations/buildings/definitions.js'
import {MISSION1_CITY_PLACEMENTS,MISSION1_CITY_ROOMS} from '../content/mission1Placements.js'
const room=BUILDINGS.find(b=>b.id==='interior-cedar-apartment'),relay=MISSION1_CITY_PLACEMENTS.objectives.find(o=>o.objectiveId==='compare-relay'),court=MISSION1_CITY_ROOMS.find(r=>r.id==='weavers-court')
export const KASHI_LANDMARKS=Object.freeze([
 Object.freeze({id:'bhairava-room',label:'Bhairava Room',position:Object.freeze([...room.entrance])}),
 Object.freeze({id:'salvage-relay',label:'Salvage relay / Bujji start',position:Object.freeze([...relay.position])}),
 Object.freeze({id:'weavers-court',label:'Weavers Court',position:Object.freeze([...court.entry])}),
])
const directions=['north','north-east','east','south-east','south','south-west','west','north-west']
const relative=['Ahead','Ahead-right','Right','Behind-right','Behind','Behind-left','Left','Ahead-left']
const sector=angle=>((Math.round(angle/(Math.PI/4))%8)+8)%8
const multiply=(m,v)=>[0,1,2,3].map(i=>m[i]*v[0]+m[i+4]*v[1]+m[i+8]*v[2]+m[i+12]*v[3])
export function describeLandmark(landmark,position,heading){
 if(![position?.x,position?.y,position?.z,heading,...landmark.position].every(Number.isFinite))return null
 const dx=landmark.position[0]-position.x,dz=landmark.position[2]-position.z,distance=Math.hypot(dx,dz),angle=Math.atan2(dx*Math.cos(heading)-dz*Math.sin(heading),-dx*Math.sin(heading)-dz*Math.cos(heading))
 return {...landmark,distance:Math.round(distance*10)/10,direction:distance<2?'nearby':directions[sector(Math.atan2(dx,-dz))],relative:distance<2?'Here':relative[sector(angle)],angle:angle*180/Math.PI}
}
// Read-only native queries; no actors, controls, objectives, rewards or storage.
export function readWayfindingView({host,position,heading}){
 if(!host?.camera||!Number.isFinite(heading))return null
 const camera=host.camera,inverse=camera.matrixWorldInverse.elements,projection=camera.projectionMatrix.elements,origin=camera.position,canvas=host.renderer?.domElement
 const extra=host.scene?.getObjectByName('kashi-first-district')?.userData.navigationLandmarks??[]
 const landmarks=[...KASHI_LANDMARKS,...extra.filter(item=>typeof item.id==='string'&&typeof item.label==='string'&&Array.isArray(item.position)&&item.position.length===3&&item.position.every(Number.isFinite)&&!KASHI_LANDMARKS.some(base=>base.id===item.id))]
 const items=landmarks.map(landmark=>{
  const item=describeLandmark(landmark,position,heading);if(!item)return null
  const target={x:landmark.position[0],y:landmark.position[1]+2.2,z:landmark.position[2]},cameraPoint=multiply(inverse,[target.x,target.y,target.z,1]),clip=multiply(projection,cameraPoint)
  let screen=null
  if(item.distance<=36&&cameraPoint[2]<0&&clip[3]>0){const x=clip[0]/clip[3],y=clip[1]/clip[3],z=clip[2]/clip[3]
   if(Math.abs(x)<.94&&Math.abs(y)<.9&&z>=-1&&z<=1&&host.world?.castRay&&host.rapier){
    const dx=target.x-origin.x,dy=target.y-origin.y,dz=target.z-origin.z,length=Math.hypot(dx,dy,dz)
    const hit=length>.001?host.world.castRay(new host.rapier.Ray(origin,{x:dx/length,y:dy/length,z:dz/length}),length,true,host.rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,c=>!c.parent()||c.parent().isFixed()):null
    if(!hit||hit.timeOfImpact>=length-.2)screen={x:(x+1)/2,y:(1-y)/2}
   }
  }
  return {...item,screen}
 }).filter(Boolean)
 if(items.length!==landmarks.length)return null
 return {items,viewport:{left:canvas?.offsetLeft??0,top:canvas?.offsetTop??0,width:canvas?.clientWidth??800,height:canvas?.clientHeight??600}}
}
