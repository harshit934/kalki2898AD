// Original game opponents. These do not represent defeating film characters.
const boss = (mission, name, subtitle, color, form, movement, attacks, defeat) => Object.freeze({
  mission, id:`mission-${mission}`, name, subtitle, color, form, movement, attacks:Object.freeze(attacks), defeat,
  health:600+mission*5, damage:14+Math.floor(mission/10), speed:1.4+mission*.008,
  phases:Object.freeze([1,2,3].map((phase)=>Object.freeze({phase,threshold:phase===1?.67:phase===2?.34:0,speed:(1.4+mission*.008)*(1+(phase-1)*.15),cooldown:Math.max(1250,2600-mission*5-(phase-1)*220)}))),
})
export const ARC_BOSSES = Object.freeze({
 'mission-10':boss(10,'EXIT WARDEN','Break the gatekeeper’s shield line','#e3b268','shield','pursuit',['gate-ram','shield-fan'],'kneel'),
 'mission-20':boss(20,'CHAIN COLLECTOR','Read the tether, then close the distance','#e29164','chain','retreat',['chain-hook','debt-circles'],'unravel'),
 'mission-30':boss(30,'SOLAR ARCHITECT','Step through the rotating sun lattice','#ffd36d','sun','orbit',['solar-spokes','sunfall'],'eclipse'),
 'mission-40':boss(40,'MIRROR DUELIST','Trust the solid blade, not its echoes','#9dcde1','swords','sidestep',['mirror-cross','echo-lunge'],'shatter'),
 'mission-50':boss(50,'MONSOON DRUMMER','Jump the pulse and answer the recovery','#81c7c0','drum','anchor',['drum-rings','thunder-grid'],'collapse'),
 'mission-60':boss(60,'DUNE COURIER','Evade the returning blade twice','#edaf89','ring','strafe',['returning-ring','sand-cut'],'skid'),
 'mission-70':boss(70,'BRONZE ADJUDICATOR','Leave the judgment mark before it seals','#d4b77d','scales','retreat',['judgment-marks','verdict-beams'],'bow'),
 'mission-80':boss(80,'BASTION RAM','Find the safe lane beside the breach','#c29376','bastion','pursuit',['bastion-charge','fault-lines'],'buckle'),
 'mission-90':boss(90,'SIEGE ASTROLABE','Read the bombardment, preserve an escape lane','#e59a70','siege','anchor',['siege-grid','orbital-mortar'],'disarm'),
 'mission-100':boss(100,'HORIZON KEEPER','An original challenge at the unfinished horizon','#a5cbbb','lotus','orbit',['lotus-blades','horizon-reversal'],'lotus'),
})
export function arcBossFor(missionId){return ARC_BOSSES[missionId]}
export function difficultyFor(missionId){const n=Number(missionId?.split('-')[1])||1;return {health:1+Math.min(.5,(n-1)*.045),damage:1+Math.min(.35,(n-1)*.03),speed:1+Math.min(.18,(n-1)*.014),cooldown:1-Math.min(.18,(n-1)*.012)}}

export function createArcRuntime(profile){return {profile,time:0,x:0,z:-69,cycle:0,next:1.2,attack:null,phase:1,defeatTime:0}}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
export function beginArcAttack(state,player){
 const {profile,phase}=state,index=state.cycle++%profile.attacks.length,kind=profile.attacks[index],dx=player.x-state.x,dz=player.z-state.z,angle=Math.atan2(dx,dz)
 state.attack={kind,start:state.time,tell:Math.max(.8,1.45-(phase-1)*.16),duration:kind==='returning-ring'?2.1:kind==='drum-rings'?1.8:1.1,x:state.x,z:state.z,targetX:player.x,targetZ:player.z,angle,phase,hit:false}
 return state.attack
}
// Shared geometric primitives, distinct spatial/timing rules per authored attack.
export function arcHazards(attack,age){
 const a=attack,t=Math.max(0,age-a.tell),p=a.phase,result=[],line=(x,z,angle,length,width)=>result.push({shape:'line',x,z,angle,length,width}),circle=(x,z,r,inner=0)=>result.push({shape:'ring',x,z,r,inner})
 switch(a.kind){
 case 'gate-ram': line(a.x,a.z,a.angle,10,1.15);break
 case 'shield-fan': for(let i=-p;i<=p;i++)line(a.x,a.z,a.angle+i*.28,5.5,.5);break
 case 'chain-hook': line(a.x,a.z,a.angle,13,.48);circle(a.targetX,a.targetZ,1.4);break
 case 'debt-circles': for(let i=0;i<2+p;i++)circle(a.targetX+Math.cos(i*2.4)*2.8,a.targetZ+Math.sin(i*2.4)*2.8,1.5);break
 case 'solar-spokes': for(let i=0;i<3+p;i++)line(a.x,a.z,a.angle+i*Math.PI*2/(3+p)+(age>a.tell?t*.7:0),10,.38);break
 case 'sunfall': circle(a.targetX,a.targetZ,3.1+p*.35);break
 case 'mirror-cross': line(a.targetX-5,a.targetZ-5,Math.PI/4,14,.6);line(a.targetX+5,a.targetZ-5,-Math.PI/4,14,.6);break
 case 'echo-lunge': for(let i=0;i<p;i++)line(a.x+(i-1)*2,a.z,a.angle,11,.55);break
 case 'drum-rings': circle(a.x,a.z,1.5+(age>a.tell?t*5:0),Math.max(0,(age>a.tell?t*5:0)-.15));break
 case 'thunder-grid': for(let i=0;i<2+p;i++)line(-8,a.targetZ+(i-2)*2.8,Math.PI/2,16,.5);break
 case 'returning-ring': {const d=age>a.tell?Math.sin(Math.min(1,t/2.1)*Math.PI)*10:10;circle(a.x+Math.sin(a.angle)*d,a.z+Math.cos(a.angle)*d,1.05);break}
 case 'sand-cut': line(-8,a.targetZ,Math.PI/2,16,.75);line(a.targetX,-76,0,16,.55);break
 case 'judgment-marks': for(let i=0;i<2+p;i++)circle(a.targetX+(i%2?2.4:-2.4),a.targetZ+Math.floor(i/2)*2.7,1.3);break
 case 'verdict-beams': line(a.targetX-2,-76,0,16,.55);line(a.targetX+2,-76,0,16,.55);break
 case 'bastion-charge': line(a.x,a.z,a.angle,12,1.65);break
 case 'fault-lines': for(let i=-1;i<=1;i++)line(a.x+i*2.5,a.z,a.angle+i*.18,13,.55);break
 case 'siege-grid': for(let i=0;i<3+p;i++)circle(-6+(i%3)*5,-73+Math.floor(i/3)*7,1.6);break
 case 'orbital-mortar': circle(a.targetX,a.targetZ,2.3);circle(a.targetX,a.targetZ,6,4.2);break
 case 'lotus-blades': for(let i=0;i<4+p;i++)line(a.x,a.z,i*Math.PI*2/(4+p)+(age>a.tell?t*.9:0),9,.42);break
 case 'horizon-reversal': circle(a.x,a.z,age>a.tell?Math.max(1,10-t*7):10,age>a.tell?Math.max(0,8.4-t*7):8.4);break
 default: throw new Error(`Unknown attack: ${a.kind}`)
 }
 result.forEach(h=>{h.jumpable=['drum-rings','thunder-grid','fault-lines','debt-circles','sunfall','judgment-marks','siege-grid','orbital-mortar','horizon-reversal'].includes(a.kind)})
 return result
}
export function hazardContains(h,player){if(player.y>2.6||(h.jumpable&&player.y>.85))return false;const x=player.x-h.x,z=player.z-h.z;if(h.shape==='ring'){const d=Math.hypot(x,z);return d<h.r+.3&&(h.inner<=0||d>=Math.max(0,h.inner-.3))}const forward=x*Math.sin(h.angle)+z*Math.cos(h.angle),side=x*Math.cos(h.angle)-z*Math.sin(h.angle);return forward>=-.4&&forward<=h.length+.4&&Math.abs(side)<=h.width+.3}
export function stepArcRuntime(state,player,phase,delta){
 const dt=clamp(delta,0,.05);state.time+=dt;state.phase=phase
 if(!state.attack){const dx=player.x-state.x,dz=player.z-state.z,d=Math.max(.001,Math.hypot(dx,dz)),speed=state.profile.phases[phase-1].speed;let mx=0,mz=0
  switch(state.profile.movement){case 'pursuit':if(d>3.6){mx=dx/d;mz=dz/d}break;case 'retreat':if(d<6){mx=-dx/d;mz=-dz/d}else if(d>9){mx=dx/d;mz=dz/d}break;case 'orbit':mx=-dz/d;mz=dx/d;break;case 'sidestep':mx=Math.sin(state.time*.9);mz=d>6?dz/d:0;break;case 'strafe':mx=Math.sin(state.time*1.2)*1.5;mz=d>8?dz/d:0;break;case 'anchor':mx=-state.x*.25;mz=(-69-state.z)*.25;break;default:throw Error('Unknown boss movement')}
  state.x=clamp(state.x+mx*speed*dt,-7,7);state.z=clamp(state.z+mz*speed*dt,-75,-61)
  if(state.time>=state.next)beginArcAttack(state,player)
 }
 const a=state.attack;if(!a)return {damage:0,attack:null,hazards:[]}
 const age=state.time-a.start,hazards=arcHazards(a,age);let damage=0
 if(age>=a.tell&&!a.hit&&hazards.some(h=>hazardContains(h,player))){a.hit=true;damage=state.profile.damage*(1+(phase-1)*.15)}
 if(age>a.tell+a.duration){state.attack=null;state.next=state.time+state.profile.phases[phase-1].cooldown/1000}
 return {damage,attack:a,hazards,active:age>=a.tell}
}

export function hazardVisualPose(h){return h.shape==='line'?{x:h.x+Math.sin(h.angle)*h.length/2,z:h.z+Math.cos(h.angle)*h.length/2,rotation:h.angle,scaleX:h.width*2,scaleY:h.length}:{x:h.x,z:h.z,rotation:0,scaleX:h.r,scaleY:h.r,innerRatio:h.r>0?h.inner/h.r:0}}
