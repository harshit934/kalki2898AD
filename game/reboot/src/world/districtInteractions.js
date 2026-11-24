import {requireCondition} from '../campaign/contracts.js'

// World-local doors and room occupancy; never objective or campaign state.
export function createDistrictInteractions({interiors,setDoorOpen,canSee=()=>true}){
 const doors=new Map(interiors.filter(r=>r.door).map(r=>[r.id,false]));let closed=false
 const live=()=>requireCondition(!closed,'WORLD_CANCELLED','Building interactions released')
 function roomAt(p){live();return interiors.find(r=>p.x>r.bounds.minX&&p.x<r.bounds.maxX&&p.z>r.bounds.minZ&&p.z<r.bounds.maxZ&&Math.abs(p.y-r.floor)<2.5)??null}
 function nearby(p,body){return interiors.filter(r=>r.door&&Math.abs(p.y-r.floor)<2.5&&Math.hypot(p.x-r.entry[0],p.z-r.entry[2])<=3&&canSee(r,p,body)).sort((a,b)=>Math.hypot(p.x-a.entry[0],p.z-a.entry[2])-Math.hypot(p.x-b.entry[0],p.z-b.entry[2]))[0]??null}
 function focus({position,body}){live();const room=roomAt(position),door=nearby(position,body);return {insideBuildingId:room?.id??null,insideLabel:room?.label??null,prompt:door?`${doors.get(door.id)?'Close':'Open'} ${door.label}`:null}}
 function interact({position,body}){
  live();requireCondition(position&&[position.x,position.y,position.z].every(Number.isFinite),'INVALID_WORLD_POSITION','Finite player position required')
  const room=nearby(position,body);if(!room)return {accepted:false,message:'Approach a building door and press E'}
  const open=doors.get(room.id)
  if(open&&Math.abs(position.x-room.entry[0])<2.2&&Math.abs(position.z-room.entry[2])<.9)return {accepted:false,message:'Move clear of the doorway before closing it'}
  setDoorOpen(room.id,!open);doors.set(room.id,!open);return {accepted:true,buildingId:room.id,open:!open,message:`${room.label}: ${open?'door closed':'door open'}`}
 }
 return {focus,interact,roomAt,snapshot(){live();return [...doors].map(([buildingId,open])=>({buildingId,open}))},release(){closed=true}}
}
