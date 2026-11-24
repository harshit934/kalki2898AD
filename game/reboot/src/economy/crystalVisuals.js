import {Group,Mesh,OctahedronGeometry,TorusGeometry,MeshStandardMaterial,MeshBasicMaterial} from 'three'
export function createCrystalVisual(){
 const object=new Group(),geometry=new OctahedronGeometry(.28,0),material=new MeshStandardMaterial({color:'#74f5f0',emissive:'#1eb6ad',emissiveIntensity:1.1,metalness:.45,roughness:.18}),ringGeometry=new TorusGeometry(.38,.018,6,24),ringMaterial=new MeshBasicMaterial({color:'#e9c879',toneMapped:false}),gem=new Mesh(geometry,material),ring=new Mesh(ringGeometry,ringMaterial)
 gem.scale.set(1,1.7,1);ring.rotation.x=Math.PI/2;object.add(gem,ring)
 return {object,release(){object.removeFromParent();geometry.dispose();material.dispose();ringGeometry.dispose();ringMaterial.dispose()}}
}
// Native objective proximity/LOS remains responsible for Mission 1 collection.
export function decorateMissionCrystals({host,signal}){
 const visuals=[],hidden=[];let closed=false,time=0
 for(const id of ['crystal-01','crystal-02','crystal-03']){const target=host.scene.getObjectByName('mission1-target-'+id);if(!target)continue;for(const child of target.children){hidden.push({child,visible:child.visible});child.visible=false}const visual=createCrystalVisual();target.add(visual.object);visuals.push(visual)}
 const stop=host.subscribeAfterPhysics(delta=>{time+=delta;for(const v of visuals){v.object.rotation.y=time;v.object.position.y=Math.sin(time*2)*.06}})
 const release=()=>{if(closed)return;closed=true;stop();for(const v of visuals)v.release();for(const {child,visible}of hidden)child.visible=visible;signal.removeEventListener('abort',release)}
 signal.addEventListener('abort',release,{once:true});return {release}
}
