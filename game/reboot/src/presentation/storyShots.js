import {Vector3} from 'three'
// Offsets in the live subject/player frame; no pre-rendered or substitute world.
export const STORY_SHOTS=Object.freeze({
 intro:[['World establishing',7,2,3.2,0],['Character introduction',3.4,1,.65,0],['Briefing close-up',2.5,.8,.4,0]],
 dialogue:[['Over Bhairava’s shoulder',3,1,.45,0],['Speaker close-up',2.2,-.6,.2,0],['Two-shot',3.8,1.3,.7,.35]],
 boss:[['Arena approach',8,2,2.5,0],['Boss low angle',4,-1,-.5,0],['Challenge',5,1.5,.7,.2]],
 revelation:[['Evidence context',5,2,2.2,0],['Revelation',2.5,-.8,.2,0],['Bhairava reaction',3,1,.6,.7]],
 finisher:[['Confirmed final strike',3,-1,.4,.8],['Defeated opponent',4,1,1.2,0],['Aftermath',6,2,2,.4]],
 ending:[['Contract resolution',3,1,.5,0],['Bhairava and witness',5,-1,1.2,.5],['World pullback',9,3,3,.3]],
 transition:[['Departure',4,1,1,.6],['District transition',8,3,3,.2]],
 recap:[['Previously completed',7,2,2.5,.4],['Current checkpoint',4,-1,1,.7]]
})
export function storyShot(kind,progress,subject,player){
 const rows=STORY_SHOTS[kind]??STORY_SHOTS.dialogue,t=Math.max(0,Math.min(1,progress))*(rows.length-1),i=Math.min(rows.length-2,Math.floor(t)),fraction=t-i,blend=fraction*fraction*(3-2*fraction),away=new Vector3(player.x-subject.x,0,player.z-subject.z)
 if(away.lengthSq()<.01)away.set(0,0,1);away.normalize();const side=new Vector3(away.z,0,-away.x)
 function pose(row){const look=new Vector3(subject.x,subject.y+1.25,subject.z).lerp(new Vector3(player.x,player.y+1.25,player.z),row[4]),position=look.clone().addScaledVector(away,row[1]).addScaledVector(side,row[2]);position.y+=row[3];return {position,look}}
 const a=pose(rows[i]),b=pose(rows[i+1]);return {position:a.position.lerp(b.position,blend),look:a.look.lerp(b.look,blend),label:rows[Math.round(t)][0]}
}
