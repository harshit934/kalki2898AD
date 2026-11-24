import {Group,Mesh,MeshStandardMaterial,MeshPhysicalMaterial,BoxGeometry,CylinderGeometry,TorusGeometry,ConeGeometry,SphereGeometry,Shape,ExtrudeGeometry,Vector3} from 'three'

// Original procedural vehicle art. No downloaded models or production assets.
function kit(){const root=new Group(),geometries=new Set(),materials=new Set();let closed=false
 const material=(options,glass=false)=>{const m=glass?new MeshPhysicalMaterial(options):new MeshStandardMaterial(options);materials.add(m);return m}
 const black=material({color:'#101719',metalness:.88,roughness:.27}),gold=material({color:'#c49b44',metalness:.9,roughness:.24}),energy=material({color:'#82fff0',emissive:'#41dfce',emissiveIntensity:1.5,metalness:.35,roughness:.2}),glass=material({color:'#244b55',metalness:.25,roughness:.1,transparent:true,opacity:.8,clearcoat:1},true),rubber=material({color:'#080c0d',roughness:.85})
 function part(geometry,mat,at=[0,0,0],scale=[1,1,1],rotation=[0,0,0]){geometries.add(geometry);const mesh=new Mesh(geometry,mat);mesh.position.set(...at);mesh.scale.set(...scale);mesh.rotation.set(...rotation);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);return mesh}
 const box=(at,size,mat=black)=>part(new BoxGeometry(...size),mat,at)
 function pipe(a,b,r=.035,mat=gold){const from=new Vector3(...a),to=new Vector3(...b),mesh=part(new CylinderGeometry(r,r,from.distanceTo(to),8),mat,from.clone().add(to).multiplyScalar(.5).toArray());mesh.quaternion.setFromUnitVectors(new Vector3(0,1,0),to.sub(from).normalize());return mesh}
 function prism(points,depth,mat=black){const shape=new Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();return part(new ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:6}),mat)}
 return {root,black,gold,energy,glass,rubber,part,box,pipe,prism,release(){if(closed)return;closed=true;root.removeFromParent();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();geometries.clear();materials.clear()}}
}
export function createJetModel(){
 const k=kit(),{root,black,gold,energy,glass,part,box,prism}=k;root.name='player-courier-hull'
 const body=prism([[0,-2.05],[.48,-1.1],[.58,1.4],[0,2],[-.58,1.4],[-.48,-1.1]],.4);body.rotation.x=Math.PI/2;body.position.y=.22
 for(const side of [-1,1]){
  const wing=prism([[side*.35,-.7],[side*2.05,.9],[side*2.05,1.25],[side*.4,.8]],.08);wing.rotation.x=Math.PI/2;wing.position.y=-.02
  box([side*1.45,.06,.95],[1.1,.045,.1],gold)
  part(new CylinderGeometry(.28,.35,1.5,20),black,[side*.75,-.18,.9],[1,1,1],[Math.PI/2,0,0])
  const ring=part(new TorusGeometry(.26,.05,8,24),gold,[side*.75,-.18,1.68]);ring.name='jet-engine-rim'
  part(new SphereGeometry(.22,12,8),energy,[side*.75,-.18,1.68],[1,1,.45])
  const exhaust=part(new ConeGeometry(.23,1.4,16),energy,[side*.75,-.18,2.15],[1,1,1],[Math.PI/2,0,0]);exhaust.name='jet-energy-exhaust'
  const fin=box([side*.55,.35,1.25],[.065,.75,.65],gold);fin.rotation.z=side*-.22
  k.pipe([side*.4,.25,-1.5],[side*.48,.25,1.2],.028,gold)
 }
 part(new SphereGeometry(1,20,12),glass,[0,.31,-.6],[.4,.38,.9]);box([0,.18,-1.46],[.5,.04,.06],gold)
 const streaks=[];for(const x of [-.75,.75]){const streak=box([x,-.18,2.02],[.055,.055,.2],energy);streak.name='jet-energy-trail';streaks.push(streak)}
 const airframe=new Group();airframe.rotation.y=Math.PI;for(const child of [...root.children])airframe.add(child);root.add(airframe)
 return {...k,update({speed=0,time=0,up=false}={}){const power=Math.min(1,Math.abs(speed)/13+(up?.35:0));energy.emissiveIntensity=.8+power*1.8+Math.sin(time*9)*.12;for(const mesh of airframe.children)if(mesh.name==='jet-energy-exhaust'){mesh.scale.y=.25+power*.5;mesh.position.z=1.68+.7*mesh.scale.y;mesh.visible=power>.03}for(const mesh of streaks){mesh.scale.z=1+power*4;mesh.visible=power>.03}},identity:'Existing sky courier — black and gold upgrade'}
}
export function createBikeModel(){
 const k=kit(),{root,black,gold,energy,rubber,glass,part,box,prism}=k;root.name='surya-motorcycle'
 const wheels=[]
 for(const z of [-1.1,1.05]){const wheel=new Group();wheel.position.set(0,.42,z);root.add(wheel);for(const [radius,width,mat]of [[.42,.25,rubber],[.29,.27,gold],[.15,.28,black]]){const mesh=part(new CylinderGeometry(radius,radius,width,24),mat);mesh.rotation.z=Math.PI/2;root.remove(mesh);wheel.add(mesh)}for(const x of [-.145,.145]){const mesh=part(new TorusGeometry(.22,.025,6,24),energy);mesh.rotation.y=Math.PI/2;mesh.position.x=x;root.remove(mesh);wheel.add(mesh)}wheels.push(wheel)}
 const fairing=prism([[-1.15,.6],[-.55,1.15],[.4,1.05],[.9,.55]],.55);fairing.rotation.y=Math.PI/2;fairing.position.x=-.275
 box([0,.95,.35],[.48,.1,.8],rubber);box([0,1.04,.58],[.4,.055,.28],gold)
 for(const side of [-1,1]){k.pipe([side*.25,.5,1.05],[side*.25,.9,0],.06);k.pipe([side*.25,.9,0],[side*.25,.5,-1.1],.06);k.pipe([side*.28,1.15,-.65],[side*.28,.42,-1.1],.055);box([side*.32,.8,-.05],[.035,.13,.85],gold);part(new TorusGeometry(.18,.035,8,24),energy,[side*.34,.65,0],[1,1,1],[0,Math.PI/2,0]);k.pipe([side*.1,1.14,-.65],[side*.5,1.15,-.6],.03,gold);box([side*.5,1.15,-.6],[.18,.065,.065],rubber)}
 part(new SphereGeometry(1,16,10),glass,[0,1.17,-.7],[.28,.24,.34]);box([0,.88,-1.35],[.32,.12,.06],energy);box([0,.82,1.3],[.3,.065,.04],gold)
 return {...k,wheels,update({speed=0,turn=0,time=0,delta=1/60}={}){for(const w of wheels)w.rotation.x-=speed*delta/.42;wheels[0].rotation.y=turn*.25;energy.emissiveIntensity=1+Math.min(1,Math.abs(speed)/14)+Math.sin(time*7)*.1},seat:[0,.95,.25]}
}
