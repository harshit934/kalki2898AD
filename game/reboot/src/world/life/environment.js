import {Color,Group,Mesh,BoxGeometry,MeshStandardMaterial,InstancedMesh,Matrix4,Quaternion,Vector3} from 'three'
import {createKashiVehicleGeometry} from '../livingKashi.js'
export function createEnvironmentLife({host,content,profile,clock=null}){
 const root=new Group();root.name='phase6d-environment-'+profile.id
 const lights=[];content.root.traverse(o=>{if(o.isLight)lights.push({light:o,intensity:o.intensity,color:o.color.clone()})})
 const nightColor=new Color(profile.night),dayColor=new Color(profile.tint),tintColor=new Color(),trafficMatrix=new Matrix4(),trafficPosition=new Vector3(),trafficRotation=new Quaternion(),trafficAxis=new Vector3(0,1,0),trafficScale=new Vector3(.7,.7,.7)
 const original={background:host.scene.background?.clone(),fogColor:host.scene.fog?.color.clone(),fogNear:host.scene.fog?.near,fogFar:host.scene.fog?.far}
 const geometry=new BoxGeometry(1,1,1),material=new MeshStandardMaterial({color:profile.id==='complex'?'#cfa66f':'#93bcb6',emissive:'#376c71',emissiveIntensity:.5}),terminal=new Mesh(geometry,material),body=host.world.createRigidBody(host.rapier.RigidBodyDesc.fixed());let trafficGeometry,trafficMaterial,traffic,closed=false,time=clock?.value??0,ventilation=false,lightingOverride=null
 const [x,y,z]=profile.terminal;terminal.position.set(x-1.5,y+.65,z+1);terminal.scale.set(.55,1.3,.5);root.add(terminal);host.world.createCollider(host.rapier.ColliderDesc.cuboid(.275,.65,.25).setTranslation(x-1.5,y+.65,z+1),body)
 if(profile.id!=='kashi'){
  trafficGeometry=createKashiVehicleGeometry('courier');trafficMaterial=new MeshStandardMaterial({vertexColors:true,roughness:.7});traffic=new InstancedMesh(trafficGeometry,trafficMaterial,2);traffic.name='ambient-world-transit';root.add(traffic)
 }
 function snapshot(){const day=(time%profile.daySeconds)/profile.daySeconds,weather=profile.weather[Math.floor(time/profile.weatherSeconds)%profile.weather.length];return {seconds:time,dayFraction:day,weather,ventilation,traffic:traffic?2:0,night:Math.cos(day*Math.PI*2)<0}}
 function update(){
  const state=snapshot(),brightness=.16+.84*Math.max(0,Math.cos(state.dayFraction*Math.PI*2)),tint=tintColor.copy(nightColor).lerp(dayColor,brightness),weather=state.weather==='clear'?0:ventilation?.15:.6
  if(host.scene.background?.isColor)host.scene.background.copy(tint)
  if(host.scene.fog){host.scene.fog.color.copy(tint);host.scene.fog.near=original.fogNear*(1-weather*.45);host.scene.fog.far=original.fogFar*(1-weather*.35)}
  for(const row of lights){row.light.intensity=row.intensity*(row.light.isPointLight?.6+.6*(1-brightness):brightness);row.light.color.copy(row.color).lerp(tint,(1-brightness)*.3)}
  if(traffic){const matrix=trafficMatrix;for(let i=0;i<2;i++){const a=time*.025+i*Math.PI,cx=profile.id==='complex'?250:230,cz=profile.id==='complex'?-20:120;matrix.compose(trafficPosition.set(cx+60*Math.cos(a),profile.id==='complex'?100:95,cz+40*Math.sin(a)),trafficRotation.setFromAxisAngle(trafficAxis,-a),trafficScale);traffic.setMatrixAt(i,matrix)}traffic.instanceMatrix.needsUpdate=true;traffic.computeBoundingSphere()}
  material.emissiveIntensity=ventilation?1:.3
 }
 function tick(delta,active=true){if(closed||!active)return;time+=delta;if(lightingOverride!==null){time=lightingOverride;lightingOverride=null}if(clock)clock.value=time;update()}
 function near(p){return p&&Math.hypot(p.x-terminal.position.x,p.z-terminal.position.z)<2&&Math.abs(p.y-y)<.8}
 host.scene.add(root);update()
 return {root,tick,snapshot,near,interact(p){if(closed||!near(p))return {accepted:false};ventilation=!ventilation;update();return {accepted:true,message:profile.id==='complex'?'Ventilation '+(ventilation?'boost enabled.':'returned to normal.'):'Route lanterns '+(ventilation?'brightened.':'returned to normal.')}},setLighting(mode){lightingOverride=mode==='night'?profile.daySeconds/2:0;tick(0)},release(){if(closed)return;closed=true;root.removeFromParent();host.world.removeRigidBody(body);geometry.dispose();material.dispose();traffic?.dispose();trafficGeometry?.dispose();trafficMaterial?.dispose();for(const row of lights){row.light.intensity=row.intensity;row.light.color.copy(row.color)}if(original.background&&host.scene.background?.copy)host.scene.background.copy(original.background);if(host.scene.fog){host.scene.fog.color.copy(original.fogColor);host.scene.fog.near=original.fogNear;host.scene.fog.far=original.fogFar}}}
}
