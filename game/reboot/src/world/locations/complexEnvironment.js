import {buildComplexDistricts} from './complexDistricts.js'
import {COMPLEX_RESEARCH,buildComplexResearch,researchFrontage} from './complexResearch.js'
import {Group,BoxGeometry,MeshStandardMaterial,InstancedMesh,Matrix4,Quaternion,Vector3,Color,Fog,HemisphereLight,DirectionalLight,PointLight,SRGBColorSpace,RepeatWrapping,TextureLoader} from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'
import {requireCondition} from '../../campaign/contracts.js'
import {COMPLEX_LAYOUT as layout} from './complexLayout.js'
export const COMPLEX_ASSETS=Object.freeze({citadel:'/environment/previews/complex.glb',frontage:'/environment/previews/complex-frontage.glb'})
export async function prepareComplex({host,signal,own=()=>{},loadAsset,onTravel=()=>{},onError=()=>{},researchExpansion=false,researchStage=1}){
 requireCondition(host?.scene?.isScene&&host.world&&host.rapier&&!signal.aborted,'COMPLEX_UNAVAILABLE','Live native world required');requireCondition(!host.scene.getObjectByName(layout.id),'DUPLICATE_LOCATION','Complex already mounted')
 const root=new Group(),assets=[],textures=[],geometry=new BoxGeometry(1,1,1),materials=[],previous={background:host.scene.background,fog:host.scene.fog};let stopEnergy,districts,research,body=null,closed=false,decoder,releaseFailure
 root.name=layout.id;root.userData={worldOwned:true,locationId:'complex',assetProvenance:'phase5/phase521/build-environments.py'}
 const check=()=>requireCondition(!closed&&!signal.aborted,'LOCATION_CANCELLED','Complex preparation cancelled')
 function release(){if(closed){if(releaseFailure)throw releaseFailure;return}closed=true;const errors=[],attempt=fn=>{try{fn()}catch(e){errors.push(e)}};attempt(()=>stopEnergy?.());attempt(()=>districts?.release());attempt(()=>research?.release());attempt(()=>root.removeFromParent());if(body)attempt(()=>host.world.removeRigidBody(body));const gs=new Set(),ms=new Set();for(const a of assets)a.scene.traverse(o=>{if(o.isMesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m)}});for(const g of gs)attempt(()=>g.dispose());for(const m of ms)attempt(()=>m.dispose());for(const m of materials)attempt(()=>m.dispose());for(const t of textures)attempt(()=>t.dispose());attempt(()=>geometry.dispose());attempt(()=>decoder?.dispose());host.scene.background=previous.background;host.scene.fog=previous.fog;signal.removeEventListener('abort',release);if(errors.length){releaseFailure=new AggregateError(errors,'Complex cleanup failed');throw releaseFailure}}
 own(release);signal.addEventListener('abort',release,{once:true})
 try{
  body=host.world.createRigidBody(host.rapier.RigidBodyDesc.fixed())
  let loader;if(!loadAsset){decoder=new DRACOLoader().setDecoderPath(import.meta.env.BASE_URL+'environment/kashi/draco/');loader=new GLTFLoader().setDRACOLoader(decoder)}
  for(const url of Object.values(COMPLEX_ASSETS)){const asset=await (loadAsset??(u=>loader.loadAsync(u)))(url);if(closed||signal.aborted){asset?.scene?.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose()}});check()}requireCondition(asset?.scene?.isObject3D,'COMPLEX_ASSET_UNAVAILABLE','Missing authored Complex asset');assets.push(asset)}
  const stone=loadAsset?null:await new TextureLoader().loadAsync('/environment/kashi/stone-color.jpg');if(stone){if(closed||signal.aborted){stone.dispose();check()}stone.colorSpace=SRGBColorSpace;stone.wrapS=stone.wrapT=RepeatWrapping;stone.repeat.set(.6,.6);textures.push(stone)}
  for(const asset of assets)asset.scene.traverse(o=>{if(!o.isMesh)return;o.frustumCulled=true;o.castShadow=false;o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(/Sandstone|limestone/.test(m.name)){m.color.set('#a5b5ad');m.map=stone;m.roughness=.82}else if(/brass/.test(m.name)){m.color.set('#bda06a');m.metalness=.78;m.roughness=.36}else if(/Teal/.test(m.name)){m.color.set('#3c7776');m.emissive.set('#174d4b');m.emissiveIntensity=.35}}})
  root.add(assets[0].scene);assets[1].scene.updateMatrixWorld(true);assets[1].scene.traverse(mesh=>{if(!mesh.isMesh)return;const instanced=new InstancedMesh(mesh.geometry,mesh.material,layout.frontages.length),matrix=new Matrix4(),transform=new Matrix4();layout.frontages.forEach((source,i)=>{const p=researchExpansion?researchFrontage(source,researchStage):source;transform.compose(new Vector3(...p.at),new Quaternion().setFromAxisAngle(new Vector3(0,1,0),p.yaw),new Vector3(p.scale,p.scale,p.scale));matrix.multiplyMatrices(transform,mesh.matrixWorld);instanced.setMatrixAt(i,matrix)});instanced.computeBoundingSphere();root.add(instanced)})
  function material(color,metalness=0,emissive){const m=new MeshStandardMaterial({color,metalness,roughness:.7,...(emissive?{emissive,emissiveIntensity:1.6}:{}),...(stone&&!emissive?{map:stone}:{})});materials.push(m);return m}
  const energy=material('#528f8d');energy.transparent=true;energy.opacity=.12;energy.depthWrite=false;const ground=material('#6b7876'),road=material('#253b40'),trim=material('#b99e6a',.7),light=material('#7cfff4',.2,'#326b65'),parts=[]
  const box=(at,size,mat)=>parts.push({at,size,mat})
  // Scenery beyond the collision perimeter needs a grounded horizon, not open sky below its foundations.
  box([0,-.235,researchStage>=5?-180:-80],[researchStage>=5?900:400,.4,researchStage>=5?700:400],ground)
  box([0,-.225,-28.5],[68,.4,97],ground)
  box([0,-.018,-27],[8,.012,86],road);for(const x of [-30,30])box([x,-.018,-27],[4,.012,85],road)
  for(const z of [15.5,-70])box([0,-.018,z],[64,.012,3],road)
  for(const x of [-4.3,4.3,-27.6,27.6])box([x,.005,-27],[.07,.025,85],light)
  for(const z of [15.5,-70])box([0,.005,z+1.6],[63,.025,.07],light)
  for(const x of [-33.8,33.8])for(const [a,b]of researchExpansion&&x>0?[[-77,10]]:[[-77,20]]){const z=(a+b)/2,d=b-a;box([x,.45,z],[.18,.9,d],trim);box([x,1.02,z],[.12,.09,d],light);box([x,2,z],[.025,4,d],energy)}
  for(const z of [-76.8,19.8]){box([0,.45,z],[68,.9,.18],trim);box([0,1.02,z],[68,.09,.12],light);box([0,2,z],[68,4,.025],energy)}
  for(const x of [-31,31])for(const z of [15,-22,-68]){box([x,2.2,z],[.16,4.4,.16],trim);box([x,4.35,z],[1.4,.1,.25],light)}
  for(const mat of [ground,road,trim,light,energy]){const rows=parts.filter(p=>p.mat===mat),batch=new InstancedMesh(geometry,mat,rows.length),matrix=new Matrix4();rows.forEach((p,i)=>{matrix.compose(new Vector3(...p.at),new Quaternion(),new Vector3(...p.size));batch.setMatrixAt(i,matrix)});batch.computeBoundingSphere();root.add(batch)}
  for(const p of layout.colliders){if(researchExpansion&&p.id==='edge-x-34'){host.world.createCollider(host.rapier.ColliderDesc.cuboid(.25,2,43.5).setTranslation(34,2,-33.5),body);continue}host.world.createCollider(host.rapier.ColliderDesc.cuboid(p.size[0]/2,p.size[1]/2,p.size[2]/2).setTranslation(...p.at),body)}
  if(researchExpansion)research=buildComplexResearch({host,root,body,stage:researchStage})
  if(researchExpansion&&researchStage>=2)districts=buildComplexDistricts({host,root,body,stage:researchStage})
  if(researchStage>=5)stopEnergy=host.subscribeFrame?.(delta=>{if(!closed&&!signal.aborted)districts?.tick(delta)})
  root.add(new HemisphereLight('#c9e8e1','#33323d',1.65));const sun=new DirectionalLight('#ffe0b1',2.1);sun.position.set(-25,45,20);root.add(sun);for(const p of [[0,7,-23],[0,5,13]]){const lamp=new PointLight('#91dcd1',45,35,2);lamp.position.set(...p);root.add(lamp)}
  check();host.scene.background=new Color('#40565f');host.scene.fog=new Fog('#52686c',50,researchStage>=5?320:180);host.scene.add(root)
  const focus=({position})=>{const p=position,exit=Math.hypot(p.x-layout.exit[0],p.z-layout.exit[2])<3;const area=[...layout.areas,...(research?COMPLEX_RESEARCH.areas:[]),...(districts?.areas??[])].sort((a,b)=>Math.hypot(p.x-a.at[0],p.z-a.at[1])-Math.hypot(p.x-b.at[0],p.z-b.at[1]))[0];return {insideLabel:'The Complex · '+area.label,prompt:exit?'Return to Kashi':null,message:'Explore the promenade, arrival courts and citadel concourse. Return gate at the south arrival plaza.'}}
  return {ready:true,root,research:research?COMPLEX_RESEARCH:null,researchMetrics:research?.metrics??null,districtMetrics:districts?.metrics??null,navigationLandmarks:districts?.network??[],spawn:[...layout.spawn],locationId:'complex',allInteriors:[],updateFocus:focus,interact(args){check();if(!focus(args).prompt)return {accepted:false,message:'Approach the arrival gate to return to Kashi.'};void Promise.resolve().then(()=>onTravel('kashi')).catch(onError);return {accepted:true,message:'Returning to Kashi…'}},setMissionActive(){},release}
 }catch(error){try{release()}catch(cleanup){throw new AggregateError([error,cleanup],'Complex preparation and cleanup failed')}throw error}
}

export const prepareComplexPrecinct=args=>prepareComplex({...args,researchExpansion:true})

export const prepareComplexAdvanced=args=>prepareComplex({...args,researchExpansion:true,researchStage:2})

export const prepareComplexProduction=args=>prepareComplex({...args,researchExpansion:true,researchStage:3})

export const prepareComplexContainment=args=>prepareComplex({...args,researchExpansion:true,researchStage:4})

export const prepareComplexComplete=args=>prepareComplex({...args,researchExpansion:true,researchStage:5})
