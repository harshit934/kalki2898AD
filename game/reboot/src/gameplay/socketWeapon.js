import {Group,Mesh,MeshStandardMaterial,CylinderGeometry,SphereGeometry} from 'three'
import {makeBladeGeometry} from '../../../src/game/player/bladeGeometry.js'

// Native scene equivalent of BhairavaWeapon.jsx. Same grip-centred +Y axis,
// geometry generator, dimensions and materials; no additional input/combat owner.
export function attachSocketWeapon(scene){
 const socket=scene.getObjectByName('WeaponR')??scene.getObjectByName('RightHand')
 if(!socket)return {ready:false,reason:'WEAPON_SOCKET_UNAVAILABLE',release(){}}
 const root=new Group();root.name='bhairava-socket-sword';const parts=[]
 const add=(geometry,settings,position=[0,0,0],scale=[1,1,1])=>{const material=new MeshStandardMaterial(settings),mesh=new Mesh(geometry,material);mesh.position.set(...position);mesh.scale.set(...scale);mesh.castShadow=true;root.add(mesh);parts.push(mesh)}
 try{add(makeBladeGeometry(),{color:'#c5c0ae',metalness:.86,roughness:.32});add(new CylinderGeometry(.016,.018,.135,12),{color:'#36271c',roughness:.78},[0,.0025,0]);add(new CylinderGeometry(.072,.078,.014,12),{color:'#9d8259',metalness:.72,roughness:.44},[0,.078,0],[.48,1,1]);add(new SphereGeometry(.023,10,6),{color:'#8d7658',metalness:.74,roughness:.42},[0,-.078,0]);socket.add(root)}catch(error){for(const p of parts){p.geometry.dispose();p.material.dispose()}throw error}
 let released=false;return {ready:true,object:root,release(){if(released)return;released=true;root.removeFromParent();for(const p of parts){p.geometry.dispose();p.material.dispose()}}}
}
