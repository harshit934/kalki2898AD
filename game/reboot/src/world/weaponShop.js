import {Group,Mesh,PlaneGeometry,MeshBasicMaterial,CanvasTexture,DoubleSide} from 'three'
import {KASHI_INTERIORS} from './kashiDistrict.js'
import {requireCondition} from '../campaign/contracts.js'
const room=KASHI_INTERIORS.find(r=>r.id==='sandstone-arcade')
export const WEAPON_SHOP=Object.freeze({buildingId:room.id,label:'Bhairava Weapon Shop',number:room.number,entry:Object.freeze([...room.entry]),counter:Object.freeze([room.entry[0],room.floor,room.entry[2]-4])})
export function createWeaponShop({host,signal,player,canOpen=()=>true,onOpen=()=>{},onClose=()=>{},onChange=()=>{}}){
 let open=false,closed=false,texture=null;const root=new Group();root.name='bhairava-weapon-shop';root.userData.label='WEAPON SHOP · HOUSE 01'
 const geometry=new PlaneGeometry(6,1.1),material=new MeshBasicMaterial({color:'#d7b679',side:DoubleSide}),sign=new Mesh(geometry,material);sign.position.set(room.entry[0],room.floor+4.5,room.entry[2]+.12);root.add(sign)
 if(globalThis.document?.createElement){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=192;const c=canvas.getContext('2d');if(c){c.fillStyle='#10201e';c.fillRect(0,0,1024,192);c.strokeStyle='#d7b679';c.lineWidth=8;c.strokeRect(4,4,1016,184);c.fillStyle='#faedca';c.font='bold 54px sans-serif';c.textAlign='center';c.fillText('BHAIRAVA WEAPONS',512,82);c.font='36px sans-serif';c.fillText('HOUSE 01 · WALK INSIDE · E',512,144);texture=new CanvasTexture(canvas);material.map=texture;material.color.set('#ffffff')}}
 host.scene.add(root)
 function nearby(){if(closed||signal.aborted||!canOpen())return false;const p=player.body.translation(),[x,y,z]=WEAPON_SHOP.counter;if(Math.hypot(p.x-x,p.z-z)>2||Math.abs(p.y-y)>.35)return false;const dx=x-p.x,dz=z-p.z,length=Math.hypot(dx,dz);if(length<.01)return true;const ray=new host.rapier.Ray({x:p.x,y:p.y+1.1,z:p.z},{x:dx/length,y:0,z:dz/length}),hit=host.world.castRay(ray,length,true,host.rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,player.body.collider(0),player.body);return !hit||hit.timeOfImpact>=length-.04}
 function status(){const p=player.body.translation(),dx=room.entry[0]-p.x,dz=room.entry[2]-p.z,angle=Math.atan2(dx,-dz),direction=['north','north-east','east','south-east','south','south-west','west','north-west'][(Math.round(angle/(Math.PI/4))+8)%8];return {open,nearby:nearby(),label:WEAPON_SHOP.label,houseNumber:1,distance:Math.round(Math.hypot(dx,dz)),direction}}
 function close(){if(!open)return false;open=false;onClose();onChange();return true}
 function release(){if(closed)return;closed=true;open=false;signal.removeEventListener('abort',release);root.removeFromParent();texture?.dispose();geometry.dispose();material.dispose()}
 signal.addEventListener('abort',release,{once:true})
 return {status,nearby,close,release,open(){requireCondition(!closed&&!signal.aborted&&nearby(),'SHOP_OUT_OF_RANGE','Walk inside House01 Sandstone Arcade and approach the shop counter');if(open)return false;onOpen();open=true;onChange();return true}}
}
