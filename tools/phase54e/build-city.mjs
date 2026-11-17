import { BoxGeometry, CylinderGeometry, ExtrudeGeometry, Shape, Path, LatheGeometry, Vector2, Mesh, Group, MeshStandardMaterial, MeshBasicMaterial, Matrix4, Color, CatmullRomCurve3, TubeGeometry, Vector3 } from 'three'
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import fs from 'node:fs'
// Original authored city geometry. No protected meshes, film assets or external downloads.
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(v=>{this.result='data:'+blob.type+';base64,'+Buffer.from(v).toString('base64');this.onloadend?.()})}}
const materials={sand:new MeshStandardMaterial({name:'54e-sandstone',color:'#81725b',roughness:.92,vertexColors:true}),plaster:new MeshStandardMaterial({name:'54e-lime-plaster',color:'#8d8b79',roughness:.96,vertexColors:true}),dark:new MeshStandardMaterial({name:'54e-dark-basalt',color:'#303a36',roughness:.9,vertexColors:true}),bronze:new MeshStandardMaterial({name:'54e-bronze',color:'#947d54',metalness:.7,roughness:.4,vertexColors:true}),cloth:new MeshStandardMaterial({name:'54e-cloth',color:'#735140',roughness:.98,vertexColors:true}),teal:new MeshBasicMaterial({name:'54e-hologram',color:'#69b8a4',transparent:true,opacity:.6,depthWrite:false})}
let buckets;function geometry(g,material='sand',position=[0,0,0],rotation=0){g.rotateY(rotation);g.translate(...position);const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv,colors=[];for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),v=.83+.12*Math.sin(x*.73+z*.31)*Math.cos(y*.9)+.05*Math.sin(z*1.9);colors.push(v,v*.98,v*.94);if(uv){if(Math.abs(n.getY(i))>.6)uv.setXY(i,x*.22,z*.22);else uv.setXY(i,(Math.abs(n.getX(i))>.6?z:x)*.22,y*.22)}}g.setAttribute('color',new (p.constructor)(new Float32Array(colors),3));if(!g.index){}const flat=g.index?g.toNonIndexed():g;buckets[material].push(flat);if(flat!==g)g.dispose()}
const box=(pos,size,mat='sand')=>geometry(new BoxGeometry(...size),mat,pos)
const cylinder=(pos,top,bottom,height,mat='sand',segments=20)=>geometry(new CylinderGeometry(top,bottom,height,segments),mat,pos)
function arch(x,y,z,width,height,depth,mat='sand',rot=0){const w=width/2,t=.2,s=new Shape();s.moveTo(-w,0);s.lineTo(-w,height-w);s.absarc(0,height-w,w,Math.PI,0,true);s.lineTo(w,0);s.lineTo(-w,0);const h=new Path();h.moveTo(-w+t,0);h.lineTo(w-t,0);h.lineTo(w-t,height-w);h.absarc(0,height-w,w-t,0,Math.PI,false);h.lineTo(-w+t,0);s.holes.push(h);geometry(new ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:1,steps:1,curveSegments:10}),mat,[x,y,z],rot)}
function dome(x,y,z,r){const points=[[0,0],[r,0],[r,.15],[r*.93,.38],[r*.7,r*.8],[r*.35,r*1.1],[r*.1,r*1.3],[0,r*1.55]].map(([x,y])=>new Vector2(x,y));geometry(new LatheGeometry(points,28),'sand',[x,y,z]);cylinder([x,y+r*1.55+.2,z],.06,.15,.5,'bronze')}
function pavilion(x,y,z,r=1.3){for(const sx of[-1,1])for(const sz of[-1,1]){cylinder([x+sx*r*.65,y+1,z+sz*r*.65],.1,.14,2,'sand',12);cylinder([x+sx*r*.65,y+.12,z+sz*r*.65],.2,.22,.25,'bronze',12)}box([x,y+2,z],[r*2.1,.2,r*2.1]);dome(x,y+2.15,z,r)}
function temple(x,z,height=22){box([x,.4,z],[12,1.2,12]);box([x,2,z],[9,2.5,9]);cylinder([x,3+height*5.5/13,z],.85,4.35,height*11/13,'sand',28);for(let i=0;i<11;i++){const r=4.8*(1-i/14),y=3+i*height/13;cylinder([x,y,z],r*.83,r,.8,'sand',28);cylinder([x,y+.45,z],r*.8,r*.86,.14,'bronze',28)}dome(x,3+height*11/13,z,1.6);for(const sx of[-1,1])for(const sz of[-1,1])pavilion(x+sx*5,1,z+sz*5,.9);arch(x,1,z+4.55,3.2,5,.3)}
function facade(x,z,width,depth,height,index){const mat=index%3===0?'plaster':'sand';box([x,height/2-.22,z],[width,height,depth],mat);for(let floor=0;floor<Math.floor(height/3);floor++){const y=1.1+floor*3;box([x-width/2-.15,y+1.8,z],[.35,.2,depth+.6],'bronze');for(let k=-1;k<=1;k++){const wz=z+k*depth*.27;box([x-width/2-.015,y+.65,wz],[.06,1.6,1.1],'dark');arch(x-width/2-.04,y-.1,wz,1.25,2.1,.18,'sand',-Math.PI/2)}}box([x,height+.05,z],[width+.5,.25,depth+.6]);if(index%2===0)pavilion(x,height+.2,z,Math.min(1.5,width*.3));else dome(x,height+.2,z,Math.min(2.3,width*.34));for(let j=0;j<Math.floor(depth/1.2);j++)box([x-width/2-.12,height+.5,z-depth/2+.6+j*1.2],[.25,.75,.7])}
function details(x,z,width,depth,height,index){for(let floor=0;floor<Math.floor(height/3);floor++){const y=1.15+floor*3;for(let k=-1;k<=1;k++){const wz=z+k*depth*.27;for(let i=0;i<4;i++)box([x-width/2-.12,y+.5,wz-.38+i*.25],[.12,1.25,.035],'bronze');for(let i=0;i<4;i++)box([x-width/2-.13,y+.05+i*.32,wz],[.12,.035,.95],'bronze');if(floor>0){box([x-width/2-.65,y-.35,wz],[1.5,.18,1.7]);box([x-width/2-1.25,y+.15,wz],[.15,.9,1.7],'bronze');for(let i=0;i<5;i++)box([x-width/2-1.25,y+.05,wz-.65+i*.3],[.13,.8,.055],'sand')}}}for(let j=0;j<4;j++)box([x-width/2-.2,.4+j*.15,z],[.5,.1,depth+.3]);if(index%2===0){box([x-width/2-1.3,2.8,z],[3,.12,depth*.7],'cloth');for(const side of[-1,1])cylinder([x-width/2-2.6,1.2,z+side*depth*.3],.045,.06,2.5,'bronze',8)}}
const buildings=[];for(let row=0;row<4;row++)for(let i=0;i<8;i++){const x=15+row*12+(i%2)*1.2,z=22-i*16+row*2.6,w=6.5+(i%3)*.8,d=10+(row%2),h=8+row*4+(i*7%5)*1.3;buildings.push({x,z,w,d,h,index:i+row*8})}
function start(){buckets=Object.fromEntries(Object.keys(materials).map(k=>[k,[]]))}
async function write(file){const group=new Group();let triangles=0;for(const[key,parts]of Object.entries(buckets)){if(!parts.length)continue;const merged=mergeGeometries(parts),g=mergeVertices(merged,1e-5);merged.dispose();parts.forEach(p=>p.dispose());g.computeBoundingBox();g.computeBoundingSphere();triangles+=(g.index?g.index.count:g.attributes.position.count)/3;const mesh=new Mesh(g,materials[key]);mesh.name=`54e-${key}`;group.add(mesh)}const result=await new GLTFExporter().parseAsync(group,{binary:true,onlyVisible:true});fs.writeFileSync('public/environment/phase54e/'+file,Buffer.from(result));console.log(file,result.byteLength,triangles,'triangles',group.children.length,'draw batches');return {file,bytes:result.byteLength,triangles,batches:group.children.length}}
start();
// Continuous plinth, stepped waterfront and streets rather than scattered scenic props.
box([28,-.45,-34],[72,.45,145],'dark');box([0,-.23,-32],[19,.1,130],'sand');
for(let i=0;i<14;i++)box([-13-i*.58,-.25-i*.115,-32],[.65,.18,127],i%4?'sand':'dark');
for(const z of[12,-20,-52]){for(let i=0;i<9;i++)box([-8.5-i*.9,-.2-i*.13,z],[1,.15,5.2]);for(const side of[-1,1])box([-13,-.05,z+side*2.8],[9,.3,.35],'bronze')}
for(const b of buildings)facade(b.x,b.z,b.w,b.d,b.h,b.index)
// Monuments compose foreground, middle riverfront and distant skyline.
temple(25,-68,25);temple(3,-93,30);temple(-22,-52,13)
for(const z of[14,-20,-54])pavilion(-12,-.18,z,1.55)
for(const z of[-10,-42]){arch(0,-.22,z,17,15,1.5,'sand');arch(0,-.15,z+.15,15.5,14,1.6,'bronze');for(const x of[-9,9])box([x,5,z],[1.8,10,2.2])}
// Elevated utility spine follows the upper street, integrated into its service edge.
for(let i=0;i<8;i++){const z=25-i*16;box([24,8.5,z],[.35,17,.35],'dark');box([24,16.5,z-7],[.3,.3,16],'bronze');box([24,15.8,z-7],[.15,.1,16],'teal')}
// Visible river-side market arcade with continuous terraces.
for(let i=0;i<9;i++){const z=22-i*12;arch(-16,-1.1,z,3,3.8,.3,'sand',Math.PI/2);box([-17,3,z],[2.2,.3,11.5]);}

// Dystopian megastructure: a continuous inhabited industrial canopy over the city.
// Offset decks preserve sunlight slots and the original ground combat route.
for(const [x,z,h,w] of [[32,12,58,16],[50,-28,76,18],[61,-75,91,20],[35,-101,64,15],[-26,-48,39,10]]){
 box([x,h/2,z],[w,h,w*.8],'dark');
 for(let level=0;level<Math.floor(h/5);level++){
  const y=3+level*5;box([x,y,z],[w+1,.5,w*.8+1],'sand');
  for(let j=0;j<5;j++){box([x-w/2-.02,y+1.5,z-w*.32+j*w*.15],[.1,2.4,.8],'dark');box([x-w/2-.12,y+2.8,z-w*.32+j*w*.15],[.3,.15,1.2],'bronze')}
 }
 box([x,h+1,z],[w*1.2,2,w],'sand');
 for(let i=0;i<4;i++)box([x-w*.4+i*w*.26,h+3,z],[.8,3,w*.8],'dark');
}
for(const z of [-12,-55]){
 for(const x of [-26,27]){box([x,13,z],[5,26,7],'dark');for(let y=2;y<25;y+=3)box([x,y,z],[5.6,.35,7.6],'sand')}
 box([0,27,z],[64,3,11],'dark');box([0,29,z],[66,1,12],'sand');
 for(let x=-30;x<32;x+=5){box([x,25.2,z],[.4,.55,11],'bronze');box([x,30,z-5],[.2,1.2,.2],'dark');box([x,30,z+5],[.2,1.2,.2],'dark')}
 box([0,30.5,z-5],[64,.18,.18],'bronze');box([0,30.5,z+5],[64,.18,.18],'bronze');
}
box([34,34,-35],[16,3,120],'dark');box([34,36,-35],[17,1,120],'sand');
for(let z=20;z>-100;z-=8){box([25.8,32,z],[.4,3,.5],'bronze');box([42.2,32,z],[.4,3,.5],'bronze')}
// Recessed machinery/service wings break the flat-building silhouette.
for(const b of buildings.filter(b=>b.x<30)){
 box([b.x-b.w/2-.5,b.h*.55,b.z+2],[1,2.5,2.2],'dark');
 for(let k=0;k<6;k++)box([b.x-b.w/2-1.05,b.h*.55-.8+k*.32,b.z+2],[.08,.08,1.8],'bronze');
 cylinder([b.x-b.w/2-.4,b.h*.5,b.z-b.d*.4],.16,.16,b.h,'dark',12);
}
// Sagging cable runs are authored once into shared geometry, never rebuilt per frame.
for(const z of [15,3,-23,-36,-65])for(let i=0;i<3;i++){
 const curve=new CatmullRomCurve3([new Vector3(-10,8+i*.35,z),new Vector3(0,6.2+i*.35,z-1),new Vector3(11,9+i*.35,z)]);
 geometry(new TubeGeometry(curve,20,.025,5,false),'dark');
}

// Integrated market work surfaces, ventilation and patched cloth at the street edge.
for(const [index,z]of[-5,-25,-43,-62].entries()){
 const x=9.5;box([x,.55,z],[1.6,.16,2.7],'dark');
 for(const side of[-1,1])box([x,.2,z+side*1.1],[1.3,.7,.12],'sand');
 for(let i=0;i<5;i++)cylinder([x-.5+(i%2)*.5,.82,z-.8+i*.38],.13,.17,.35,'bronze',10);
 box([x,2.8,z],[2.7,.12,3.6],'cloth');
 for(const side of[-1,1])cylinder([x-1.1,1.25,z+side*1.5],.035,.035,2.5,'dark',8);
 box([12,3.5,z+3],[.2,3.5,1.2],index%2?'cloth':'dark');
}
const output=[await write('riverfront-core.glb')]
for(const [name,min,max]of[['north-detail',-12,45],['market-detail',-52,-12],['temple-detail',-110,-52]]){start();for(const b of buildings.filter(b=>b.x<32&&b.z>=min&&b.z<max))details(b.x,b.z,b.w,b.d,b.h,b.index);for(let z=Math.ceil(min/4)*4;z<max;z+=4){box([10,.04,z],[.14,.18,2.8],'bronze');for(let i=0;i<6;i++)box([10.3+i*.16,.2,z],[.055,.5,.06],'sand')}output.push(await write(name+'.glb'))}
fs.writeFileSync('phase5/phase54e-20261113/city-geometry-manifest.json',JSON.stringify({authorship:'Original code-authored architecture; existing stone maps reused without modification',output},null,2))
