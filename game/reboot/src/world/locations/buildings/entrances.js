import {Group,Mesh,BoxGeometry,MeshStandardMaterial} from 'three'
import {BUILDINGS} from './definitions.js'
// Adds only reversible entrance trim; accepted exterior assets/collision remain owned as before.
export function withBuildingEntrances(content,{host,signal,own,onEnter,onError,locationId='complex'}){
 const root=new Group();root.name=locationId+'-building-entrances';const geometry=new BoxGeometry(1,1,1),material=new MeshStandardMaterial({color:'#b9c6b2',emissive:'#24473f',roughness:.6});let closed=false
 const release=()=>{if(closed)return;closed=true;root.removeFromParent();geometry.dispose();material.dispose()};own(release)
 const buildings=BUILDINGS.filter(b=>b.parent===locationId);try{for(const b of buildings){const [x,y,z]=b.entrance,side=b.outward[0]||b.outward[1],front=b.outward[0]===0;for(const dz of [-.9,.9]){const m=new Mesh(geometry,material);m.position.set(front?x+dz:x-side*.18,y+1.15,front?z-side*.18:z+dz);m.scale.set(.08,2.3,.08);root.add(m)}const top=new Mesh(geometry,material);top.position.set(front?x:x-side*.18,y+2.3,front?z-side*.18:z);top.scale.set(front?1.88:.08,.12,front?.08:1.88);root.add(top)}host.scene.add(root)
 const nearest=position=>buildings.find(b=>Math.hypot(position.x-b.entrance[0],position.z-b.entrance[2])<1.8&&Math.abs(position.y-b.entrance[1])<1)
 return {...content,updateFocus(args){const b=nearest(args.position),base=content.updateFocus?.(args)??{};return b?{...base,prompt:'Enter '+b.label,message:'E to enter '+b.label+'. Return through its marked exit.'}:base},interact(args){const b=nearest(args.position);if(!b)return content.interact(args);if(closed||signal.aborted)return {accepted:false,message:'Entrance released'};void Promise.resolve().then(()=>onEnter(b)).catch(onError);return {accepted:true,message:'Entering '+b.label+'...'}},release(){release();return content.release()}}
 }catch(e){release();throw e}
}
