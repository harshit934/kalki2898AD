import { BoxGeometry, CylinderGeometry, ExtrudeGeometry, Shape, Path, LatheGeometry, Vector2, Mesh, Group, MeshStandardMaterial, MeshBasicMaterial, Matrix4, Color, CatmullRomCurve3, TubeGeometry, Vector3, TorusGeometry, IcosahedronGeometry } from 'three'
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import fs from 'node:fs'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
// Original authored city geometry. No protected meshes, film assets or external downloads.
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(v=>{this.result='data:'+blob.type+';base64,'+Buffer.from(v).toString('base64');this.onloadend?.()})}}
const materials={sand:new MeshStandardMaterial({name:'54e-sandstone',color:'#aa9174',roughness:.92,vertexColors:true}),plaster:new MeshStandardMaterial({name:'54e-lime-plaster',color:'#c4bca5',roughness:.96,vertexColors:true}),dark:new MeshStandardMaterial({name:'54e-dark-basalt',color:'#697373',roughness:.9,vertexColors:true}),bronze:new MeshStandardMaterial({name:'54e-bronze',color:'#947d54',metalness:.7,roughness:.4,vertexColors:true}),cloth:new MeshStandardMaterial({name:'54e-cloth',color:'#a56449',roughness:.98,vertexColors:true}),teal:new MeshBasicMaterial({name:'54e-hologram',color:'#69b8a4',transparent:true,opacity:.6,depthWrite:false})}
let buckets;function geometry(g,material='sand',position=[0,0,0],rotation=0){g.rotateY(rotation);g.translate(...position);const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv,colors=[];for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),v=.83+.12*Math.sin(x*.73+z*.31)*Math.cos(y*.9)+.05*Math.sin(z*1.9);colors.push(v,v*.98,v*.94);if(uv){if(Math.abs(n.getY(i))>.6)uv.setXY(i,x*.22,z*.22);else uv.setXY(i,(Math.abs(n.getX(i))>.6?z:x)*.22,y*.22)}}g.setAttribute('color',new (p.constructor)(new Float32Array(colors),3));if(!g.index){}const flat=g.index?g.toNonIndexed():g;buckets[material].push(flat);if(flat!==g)g.dispose()}
const box=(pos,size,mat='sand')=>geometry(new BoxGeometry(...size),mat,pos)
const cylinder=(pos,top,bottom,height,mat='sand',segments=20)=>geometry(new CylinderGeometry(top,bottom,height,segments),mat,pos)
function arch(x,y,z,width,height,depth,mat='sand',rot=0){const w=width/2,t=.22,s=new Shape();s.moveTo(-w,0);s.lineTo(-w,height-w);s.absarc(0,height-w,w,Math.PI,0,true);s.lineTo(w,0);s.lineTo(w-t,0);s.lineTo(w-t,height-w);s.absarc(0,height-w,w-t,0,Math.PI,false);s.lineTo(-w+t,0);s.closePath();geometry(new ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:1,steps:1,curveSegments:14}),mat,[x,y,z],rot)}
function dome(x,y,z,r){const points=[[0,0],[r,0],[r,.15],[r*.93,.38],[r*.7,r*.8],[r*.35,r*1.1],[r*.1,r*1.3],[0,r*1.55]].map(([x,y])=>new Vector2(x,y));geometry(new LatheGeometry(points,28),'sand',[x,y,z]);cylinder([x,y+r*1.55+.2,z],.06,.15,.5,'bronze')}
function pavilion(x,y,z,r=1.3){for(const sx of[-1,1])for(const sz of[-1,1]){cylinder([x+sx*r*.65,y+1,z+sz*r*.65],.1,.14,2,'sand',12);cylinder([x+sx*r*.65,y+.12,z+sz*r*.65],.2,.22,.25,'bronze',12)}box([x,y+2,z],[r*2.1,.2,r*2.1]);dome(x,y+2.15,z,r)}
function temple(x,z,height=22){box([x,.4,z],[12,1.2,12]);box([x,2,z],[9,2.5,9]);cylinder([x,3+height*5.5/13,z],.85,4.35,height*11/13,'sand',28);for(let i=0;i<11;i++){const r=4.8*(1-i/14),y=3+i*height/13;cylinder([x,y,z],r*.83,r,.8,'sand',28);cylinder([x,y+.45,z],r*.8,r*.86,.14,'bronze',28)}dome(x,3+height*11/13,z,1.6);for(const sx of[-1,1])for(const sz of[-1,1])pavilion(x+sx*5,1,z+sz*5,.9);arch(x,1,z+4.55,3.2,5,.3)}
function facade(x,z,width,depth,height,index){const mat=index%3===0?'plaster':'sand';box([x,height/2-.22,z],[width,height,depth],mat);for(let floor=0;floor<Math.floor(height/3);floor++){const y=1.1+floor*3;box([x-width/2-.15,y+1.8,z],[.35,.2,depth+.6],'bronze');for(let k=-1;k<=1;k++){const wz=z+k*depth*.27;box([x-width/2-.015,y+.65,wz],[.06,1.6,1.1],'dark');arch(x-width/2-.04,y-.1,wz,1.25,2.1,.18,'sand',-Math.PI/2)}}box([x,height+.05,z],[width+.5,.25,depth+.6]);if(index%2===0)pavilion(x,height+.2,z,Math.min(1.5,width*.3));else dome(x,height+.2,z,Math.min(2.3,width*.34));for(let j=0;j<Math.floor(depth/1.2);j++)box([x-width/2-.12,height+.5,z-depth/2+.6+j*1.2],[.25,.75,.7])}
function details(x,z,width,depth,height,index){for(let floor=0;floor<Math.floor(height/3);floor++){const y=1.15+floor*3;for(let k=-1;k<=1;k++){const wz=z+k*depth*.27;for(let i=0;i<4;i++)box([x-width/2-.12,y+.5,wz-.38+i*.25],[.12,1.25,.035],'bronze');for(let i=0;i<4;i++)box([x-width/2-.13,y+.05+i*.32,wz],[.12,.035,.95],'bronze');if(floor>0){box([x-width/2-.65,y-.35,wz],[1.5,.18,1.7]);box([x-width/2-1.25,y+.15,wz],[.15,.9,1.7],'bronze');for(let i=0;i<5;i++)box([x-width/2-1.25,y+.05,wz-.65+i*.3],[.13,.8,.055],'sand')}}}for(let j=0;j<4;j++)box([x-width/2-.2,.4+j*.15,z],[.5,.1,depth+.3]);if(index%2===0){box([x-width/2-1.3,2.8,z],[3,.12,depth*.7],'cloth');for(const side of[-1,1])cylinder([x-width/2-2.6,1.2,z+side*depth*.3],.045,.06,2.5,'bronze',8)}}

// Authored street composition: different footprints, construction eras and street uses.
// The existing combat lane x=-7..7 stays clear; all new scenery is visual-only.
let trianglesTotal=0;
const outputDir='public/environment/phase54e-final';fs.mkdirSync(outputDir,{recursive:true});
const bevel=(p,size,mat='sand')=>geometry(new RoundedBoxGeometry(...size,1,.045),mat,p);
function start(){buckets=Object.fromEntries(Object.keys(materials).map(k=>[k,[]]))}
async function write(file){const group=new Group();let triangles=0;for(const[key,parts]of Object.entries(buckets)){if(!parts.length)continue;const merged=mergeGeometries(parts),g=mergeVertices(merged,1e-5);merged.dispose();parts.forEach(p=>p.dispose());g.computeBoundingBox();g.computeBoundingSphere();triangles+=(g.index?g.index.count:g.attributes.position.count)/3;const mesh=new Mesh(g,materials[key]);mesh.name=`correction-${key}`;group.add(mesh)}const bytes=await new GLTFExporter().parseAsync(group,{binary:true,onlyVisible:true});fs.writeFileSync(outputDir+'/'+file,Buffer.from(bytes));console.log(file,bytes.byteLength,triangles);return{file,bytes:bytes.byteLength,triangles,batches:group.children.length}}
const pipe=(a,b,r=.08,mat='bronze')=>{const curve=new CatmullRomCurve3(a.map(v=>new Vector3(...v)));geometry(new TubeGeometry(curve,b,r,6,false),mat)};
function column(x,y,z,h,mat='sand'){cylinder([x,y+h/2,z],.18,.25,h,mat,16);for(const dy of[.12,.3,h-.28,h-.1])cylinder([x,y+dy,z],.32,.35,.14,mat,16)}
function relief(x,y,z,w,h){bevel([x,y,z],[w,h,.12],'dark');for(const a of[-1,1]){box([x+a*w*.46,y,z+.09],[.1,h+.18,.14],'bronze');box([x,y+a*h*.46,z+.09],[w+.14,.08,.12],'bronze')}for(let i=0;i<5;i++){geometry(new CylinderGeometry(.075,.075,.06,4),'bronze',[x+Math.sin(i*1.4)*w*.28,y-h*.35+i*h*.17,z+.12],Math.PI/2)}}
function balcony(x,y,z,w,side){bevel([x,y,z],[1.4,.2,w+.4]);for(const dz of[-w/2,w/2])box([x+side*.5,y+.65,z+dz],[.1,1.2,.1],'bronze');box([x+side*.58,y+1.25,z],[.12,.12,w+.3],'bronze');for(let j=0;j<7;j++){const dz=-w/2+j*w/6;box([x+side*.58,y+.65,z+dz],[.08,1.15,.065],'sand')}for(const dz of[-w*.3,w*.3])box([x-side*.25,y-.35,z+dz],[.5,.65,.2],'dark')}
function house({x,z,w,d,h,kind,levels=3}){const side=x<0?1:-1,face=x+side*w/2;bevel([x,(h+3)/2-.22,z],[w,h-3,d],kind===1?'plaster':'sand');box([face-side*2.2,1.25,z],[.25,3.1,d],'dark');for(const dz of[-d/2,d/2])box([x,1.25,z+dz],[w,3.1,.25],kind===1?'plaster':'sand');
 // Plinth, deeply recessed shop bays and separately framed doors face the street.
 for(let k=0;k<3;k++){const wz=z-d*.32+k*d*.32;box([face-side*2.05,1.2,wz],[.16,2.9,d*.24],'dark');arch(face+side*.11,-.22,wz,d*.25,3.1,.26,'sand',side*Math.PI/2);for(const dz of[-1,1])column(face+side*.3,-.15,wz+dz*d*.135,2.8);box([face+side*.18,2.85,wz],[.35,.18,d*.29],'bronze')}
 for(let f=1;f<levels;f++){const y=f*(h-.6)/levels;box([x,y,z],[w+.36,.22,d+.4],f%2?'dark':'sand');for(let k=0;k<3;k++){const wz=z-d*.31+k*d*.31;box([face+side*.04,y+1.25,wz],[.12,1.8,d*.2],'dark');arch(face+side*.16,y+.2,wz,d*.22,2.25,.24,kind===2?'plaster':'sand',side*Math.PI/2);if((f+k+kind)%2===0)balcony(face+side*.7,y+.05,wz,d*.24,side);else for(let j=0;j<5;j++)box([face+side*.24,y+1.13,wz-d*.085+j*d*.043],[.12,1.5,.045],'bronze')}}
 for(const y of[h-.5,h-.22,h+.05])box([x,y,z],[w+.45,.14,d+.6],'sand');
 if(kind===0){pavilion(x,h+.15,z,Math.min(w*.32,1.8));for(const dz of[-d*.4,d*.4])dome(x,h+.1,z+dz,1.05)}
 else if(kind===1){for(let i=0;i<7;i++)box([face,h+.55,z-d*.43+i*d*.14],[.3,.9,d*.085]);box([x,h+.75,z],[w*.65,1.3,d*.5],'dark');for(let i=0;i<4;i++)cylinder([x-w*.25+i*w*.16,h+1.65,z],.18,.22,.65,'bronze',12)}
 else{dome(x,h+.1,z,w*.38);for(let k=0;k<5;k++)box([face+side*.55,h-1-k*.55,z-d*.44],[.6,.18,.3],'bronze')}

 // Street-facing structural bays: shutter guides, masonry piers and timber soffits.
 for(let k=0;k<3;k++){const wz=z-d*.32+k*d*.32;
  for(const dz of[-1,1]){bevel([face+side*.13,1.3,wz+dz*d*.115],[.22,2.8,.18],'dark');for(let y=.35;y<2.6;y+=.35)box([face+side*.26,y,wz+dz*d*.115],[.04,.055,.12],'bronze')}
  if((k+kind)%3===0){for(let j=0;j<9;j++)box([face-side*.22,.2+j*.27,wz],[.12,.23,d*.2],'bronze')}
  else{box([face-side*.4,2.45,wz],[.28,.24,d*.21],'dark')}
 }
 for(let y=1;y<h-1;y+=1.25)for(const dz of[-d*.48,d*.48])bevel([face+side*.1,y,z+dz],[.28,.6,.5],kind===1?'sand':'plaster');
 if(kind===1){for(let k=0;k<3;k++)pipe([[face+side*.7,h-1,z-d*.35+k*d*.35],[face+side*.7,4.2,z-d*.35+k*d*.35],[face+side*1.2,3.8,z-d*.35+k*d*.35]],8,.13,'dark')}
 // Local patches, shutter slats, rain pipes, brackets and electrical service.
 for(let i=0;i<5;i++){const wz=z-d*.4+i*d*.19;box([face-side*2.02,.6+(i%3)*.28,wz],[.16,.5+.25*(i%2),.75],i%2?'plaster':'dark')}
 pipe([[face+side*.35,h+.2,z+d*.4],[face+side*.45,h*.55,z+d*.4],[face+side*.45,.1,z+d*.4]],8,.08,'bronze');
 bevel([face+side*.5,3.6,z+d*.25],[.85,1.5,1.7],'dark');for(let i=0;i<5;i++)box([face+side*.94,3.05+i*.22,z+d*.25],[.08,.055,1.45],'bronze');
}
function market(x,z,type=0){const side=x<0?1:-1;x-=side*.2;for(const dz of[-2,2])column(x-side*1.2,-.2,z+dz,3.2,'dark');
 // Curved patched awning is built as cloth strips with a sag, not a flat box.
 for(let j=0;j<12;j++){const t=j/11,xx=x-side*1.5+side*t*3.2,y=3.4-.45*Math.sin(t*Math.PI);box([xx,y,z],[.29,.055,4.6],j%3?'cloth':'dark')}
 bevel([x,.73,z],[1.2,.12,3.6],'dark');for(const dx of[-.48,.48])for(const dz of[-1.5,1.5])box([x+dx,.22,z+dz],[.12,.9,.12],'dark');
 for(let i=0;i<8;i++){const xx=x-.28+(i%2)*.56,zz=z-1.25+Math.floor(i/2)*.8;if(type%2){cylinder([xx,.92,zz],.12,.16,.28,i%3?'bronze':'dark',16);for(const dy of[-.1,0,.1])cylinder([xx,.92+dy,zz],.165,.165,.025,'bronze',16)}else{cylinder([xx,.84,zz],.2,.15,.15,'cloth',16);geometry(new TorusGeometry(.2,.015,5,20).rotateX(Math.PI/2),'bronze',[xx,.91,zz],0);for(let k=0;k<3;k++)geometry(new IcosahedronGeometry(.055,1),'sand',[xx+(k-1)*.09,.96,zz+(k%2)*.08]);}}
 box([x,2.9,z-2.3],[2.2,.45,.12],'dark');
}
start();
// Dusty irregular paving, actual curb/drain edges and shared utility covers.
box([27,-.47,-40],[68,.4,180],'dark');box([0,-.28,-30],[19,.1,144],'dark');
for(let iz=0;iz<68;iz++)for(let ix=0;ix<9;ix++){const x=-8+ix*2+(iz%2)*.22,z=27-iz*1.8,dy=.008*Math.sin(ix*23+iz*17);bevel([x,-.225+dy,z],[1.985,.035,1.785],(ix+iz*3)%23===0?'dark':'sand')}
for(const x of[-9.5,9.5]){box([x,-.1,-30],[.4,.3,140],'dark');for(let z=26;z>-91;z-=5){box([x-.25,.03,z],[.7,.06,1.5],'bronze');for(let i=0;i<6;i++)box([x-.25,.075,z-.62+i*.25],[.62,.02,.04],'dark')}}
for(let i=0;i<14;i++)box([-12.5-i*.62,-.23-i*.115,-31],[.7,.2,134],i%3?'sand':'dark');
for(const z of[25,-12.5,-52]){for(let j=0;j<9;j++)box([-8.4-j*.9,-.2-j*.13,z],[1,.18,z===-52?3.4:5]);for(const dz of[-3,3])for(let j=0;j<6;j++)column(-10-j*1.5,-.5-j*.17,z+dz,1.25,'dark')}
// Each street-front building has a different section, roof and shop frontage.
const blocks=[{x:13,z:17,w:7,d:12,h:13,kind:0},{x:14,z:1,w:8,d:13,h:18,kind:1,levels:4},{x:13,z:-17,w:7,d:14,h:11,kind:2},{x:15,z:-36,w:10,d:15,h:22,kind:0,levels:5},{x:13,z:-54,w:7,d:13,h:16,kind:1,levels:4},{x:-15,z:16,w:6,d:11,h:9,kind:2},{x:-15,z:-3,w:6,d:12,h:14,kind:0},{x:-16,z:-23,w:7,d:14,h:18,kind:1,levels:4},{x:-16,z:-43,w:7,d:13,h:12,kind:2},{x:-17,z:-61,w:8,d:14,h:20,kind:0,levels:4}];blocks.forEach(house);for(const b of blocks.filter(b=>b.x<0))box([b.x,-1.2,b.z],[b.w+1,2,b.d+.6],'dark');
for(const [x,z,k]of[[9,7,0],[-10,-8,1],[9,-23,1],[-10,-32,0],[10,-43,0]])market(x,z,k);
// A street-facing gateway is the mid-ground focal point, not another box tower.
for(const x of[-11.5,11.5]){bevel([x,5.3,-35],[4.2,11,6],'dark');for(let y=1;y<11;y+=1.5)box([x,y,-31.9],[4.6,.2,.35],'sand');pavilion(x,11,-35,1.8)}
arch(0,6.2,-35,19,9,1.5,'dark');arch(0,6.2,-34.9,17.8,8.5,1.5,'sand');box([0,15.1,-35],[24,.5,6],'dark');
for(let i=-5;i<=5;i++){relief(i*1.9,13.5,-31.8,1.4,1.4)}
// Occupied skyline: varying silhouettes, deep terraces and irregular service crown.
for(const [i,x,z,w,h]of[[0,27,-4,11,37],[1,36,-33,15,58],[2,41,-65,17,74],[3,-27,-35,10,43],[4,-29,-77,13,57]]){
 box([x,-1.8,z],[w+1,3.6,w*.9+1],'dark');bevel([x,h/2,z],[w,h,w*.9],'dark');for(let level=0;level<h/4;level++){const y=level*4+1,offset=level%3===0?1.2:0;box([x,y,z],[w+offset,.35,w*.9+offset],'sand');for(let j=0;j<4;j++)box([x-w/2-.08,y+1.8,z-w*.32+j*w*.21],[.15,2.4,w*.13],'dark')}
 for(let k=0;k<3;k++){bevel([x+(k-1)*w*.3,h+2+(k%2)*2,z],[w*.23,4+(k%2)*4,w*.55],'plaster');cylinder([x+(k-1)*w*.3,h+5+(k%2)*4,z],.18,.4,3,'bronze',12)}}
// Lower transit spine is clearly visible above the standard street camera.
for(const z of[-26,-58]){for(const dz of[-2,0,2])pipe([[-23,10.1,z+dz],[0,9.8,z+dz],[23,10.1,z+dz]],12,.12,'bronze');for(const x of[-22,23]){bevel([x,7,z],[4,14,6],'dark');for(let y=1;y<10;y+=2)box([x,y,z],[4.6,.25,6.5],'sand')}
 box([0,11.3,z],[50,1.6,8],'dark');box([0,12.3,z],[51,.5,8.8],'plaster');for(let x=-23;x<=23;x+=3)box([x,10.2,z],[.25,1,7.8],'bronze');for(const dz of[-4,4]){box([0,13,z+dz],[50,.15,.15],'bronze');for(let x=-24;x<=24;x+=3)box([x,12.7,z+dz],[.12,1,.12],'dark')}}
for(const z of[10,-4,-22,-40,-58])for(let i=0;i<4;i++)pipe([[-11,6+i*.24,z],[0,4.6+i*.24,z-1],[11,7+i*.24,z]],18,.026,'dark');
for(const z of[13,-20,-51]){pavilion(-12.5,-.1,z,1.4);box([-17,2.9,z],[7,.25,9],'dark')}
temple(2,-104,34);temple(-27,-69,20);
const output=[await write('street-core.glb')];
// Rearwards detail kept in one optional chunk; no mandatory duplicate 20 MiB core.
start();for(const b of blocks.filter(b=>b.x>0)){for(let k=0;k<5;k++){const z=b.z-b.d*.36+k*b.d*.18;box([b.x-b.w/2-.2,4.5,z],[.1,2,.035],'bronze')}}output.push(await write('street-detail.glb'));
// Ten genuinely different architectural arena settings. Central movement/attack area stays unchanged.
for(let n=1;n<=10;n++){start();const z=-69,accent=n%3===0?'plaster':n%3===1?'bronze':'dark';
 // Architectural enclosure and inhabited outer precinct: the arena is a place in the city.
 const wallMaterial=[2,6,9].includes(n)?'dark':n===4||n===10?'plaster':'sand';
 for(const side of[-1,1]){const x=side*21;bevel([x,7,-78],[9,14,47],wallMaterial);for(let j=0;j<7;j++){const zz=-58-j*6;box([x-side*4.55,3.5,zz],[.2,5,3.7],'dark');arch(x-side*4.7,.5,zz,4,6,.35,'sand',side*Math.PI/2);for(let f=1;f<3;f++){box([x-side*4.65,f*4.6+2,zz],[.15,2.9,2.4],'dark');arch(x-side*4.8,f*4.6+.4,zz,2.8,4,.25,n%2?'sand':'plaster',side*Math.PI/2)}}for(const y of[.1,5,9.6,14])box([x,y,-78],[9.6,.25,47.6],'bronze');for(let j=0;j<6;j++)box([x,15,-59-j*7],[10,.5,4.5],wallMaterial)}
 if([2,6,9].includes(n)){
 bevel([0,10,-115],[43,20,10],'dark');for(const x of[-14,0,14]){bevel([x,5.5,-109.8],[10,11,.35],'bronze');for(let j=0;j<13;j++)box([x-4.5+j*.75,5.5,-109.5],[.09,10.5,.16],'dark');box([x,11.5,-109.2],[11,.4,.5],'sand');for(const dx of[-5.8,5.8])column(x+dx,-.2,-109,13,'sand')}
 for(const y of[14,17,20]){box([0,y,-109.3],[44,.3,.5],'bronze');for(let x=-20;x<=20;x+=4){bevel([x,y+1,-109.5],[2.7,1.4,.4],'dark');for(let k=0;k<5;k++)box([x-1+k*.5,y+1,-109.1],[.06,1.1,.1],'bronze')}}
 for(const x of[-18,18])pipe([[x,22,-112],[x,24,-106],[x,8,-106],[x+(x>0?-3:3),6,-106]],12,.35,'bronze');
 }else{
 bevel([0,10,-115],[43,20,10],wallMaterial);for(let f=0;f<4;f++){const yy=f*5;box([0,yy+.2,-109.8],[44,.24,.5],'bronze');for(let j=-3;j<=3;j++){const x=j*5.6;box([x,yy+2.3,-109.9],[3.6,3.8,.2],'dark');arch(x,yy+.5,-109.7,4,4.5,.4,f%2?'sand':'plaster');for(let k=0;k<4;k++)box([x-1.3+k*.87,yy+2.3,-109.15],[.06,3,.08],'bronze')}}
 }
 for(const x of[-18,18]){pavilion(x,20,-115,2.2);for(let k=0;k<3;k++)cylinder([x+(k-1)*1.3,23,-114],.15,.28,4,'dark',12)}
 for(const side of[-1,1]){box([side*11,.12,-69],[.5,.5,24],wallMaterial);for(let j=0;j<4;j++)cylinder([side*11,.65,-60-j*6],.35,.5,1.1,'bronze',16)}

 for(let i=-5;i<=5;i++)for(let j=-5;j<=5;j++)bevel([i*1.65,-.2,z+j*1.65],[1.59,.025,1.59],(i+j+n)%5===0?'dark':'sand');
 box([0,-.55,-108],[65,.6,80],'dark');
 // Only peripheral scenery. No new collision, encounter logic or boss statistics.
 if(n===1){for(const x of[-12,12]){house({x,z:-80,w:7,d:8,h:14,kind:0});for(let j=0;j<4;j++)box([x-3+j*2,14.5,-76],[.8,1.2,1],'dark')}arch(0,1,-88,19,14,2);}
 if(n===2){for(const x of[-12,12]){column(x,-.2,-73,12,'dark');column(x,-.2,-83,12,'dark');box([x,12,-78],[1.5,1,13],'bronze');for(let j=0;j<5;j++){const zz=-73-j*2;for(let k=0;k<9;k++)geometry(new TorusGeometry(.18,.055,5,12),k%2?'bronze':'dark',[x,10-k*.32,zz],k%2*Math.PI/2)}}arch(0,4,-87,23,10,1.4,'dark');for(const x of[-8,-4,4,8])for(let k=0;k<15;k++)geometry(new TorusGeometry(.22,.055,5,14),k%2?'bronze':'dark',[x,11-k*.38,-86],k%2*Math.PI/2);}
 if(n===3){for(let i=0;i<8;i++){const a=i*Math.PI/4;column(Math.sin(a)*15,-.2,z+Math.cos(a)*15,9,accent)}for(let r=7;r<=12;r+=2)geometry(new TorusGeometry(r,.18,6,64),r%2?'bronze':'sand',[0,10,-87],(r-7)*.12);temple(0,-96,17);}
 if(n===4){for(const x of[-13,13])for(let j=0;j<6;j++){column(x,-.2,-58-j*5,7);bevel([x,4.5,-58-j*5],[.25,6,3],'bronze');for(let k=0;k<4;k++)box([x,2+k*1.7,-58-j*5],[.4,.12,3.5],'dark')}arch(0,0,-89,24,10,1.2,'plaster');for(const x of[-8,-4,4,8]){bevel([x,4,-88],[2.7,6,.25],'bronze');for(const y of[1,7])box([x,y,-87.8],[3,.14,.18],'dark');}}
 if(n===5){for(const x of[-13,13]){box([x,3,-72],[4,6,27],'dark');for(let j=0;j<5;j++){cylinder([x,7,-61-j*5],1.3,1.6,2,'bronze');pipe([[x,7,-61-j*5],[x,4,-61-j*5],[x>0?10.5:-10.5,2,-61-j*5]],6,.35,'dark')}}box([0,4,-88],[30,8,5],'sand');for(let i=-3;i<=3;i++)arch(i*4,0,-85,2.8,5,.6,'dark');}
 if(n===6){for(const x of[-14,14]){for(let j=0;j<4;j++){bevel([x,1.5,-62-j*7],[4,3,5],j%2?'dark':'bronze');for(let k=0;k<6;k++)box([x+(x>0?-2.03:2.03),1.4,-64-j*7+k*.8],[.1,2.6,.1],'sand')}for(const zz of[-58,-87])column(x,-.2,zz,9,'dark');box([x,9,-72],[5,.6,34],'bronze')}arch(0,4,-90,26,8,1.2,'dark');for(const x of[-8,0,8]){bevel([x,1.5,-92],[4,3,4],'bronze');for(let j=0;j<5;j++)box([x-1.6+j*.8,1.5,-89.95],[.1,2.7,.12],'dark');}}
 if(n===7){for(const x of[-14,14])for(let j=0;j<5;j++)box([x+(x>0?j:-j),j*.6,-72],[1.2,.65,30],'sand');for(let j=-3;j<=3;j++){column(j*4,0,-89,10);relief(j*4,7,-88.5,2.4,3)}box([0,10.5,-89],[30,1,6],'bronze');dome(0,11,-89,5);}
 if(n===8){for(const x of[-13,13]){bevel([x,5,-74],[5,10,29],'dark');for(let j=0;j<7;j++)box([x,10.7,-61-j*4],[5.5,1.4,1.7],'sand');for(let j=0;j<4;j++)arch(x+(x>0?-2.6:2.6),.5,-62-j*7,3.8,6,.4,'sand',Math.PI/2)}for(const x of[-8,8]){box([x,6,-90],[6,12,5],'sand');pavilion(x,12,-90,1.8)}}
 if(n===9){for(let j=0;j<5;j++){const zz=-60-j*7;arch(0,4,zz,30,14,.5,'dark');for(const x of[-15,15]){bevel([x,4,zz],[2.6,8,4],'dark');for(let i=0;i<7;i++)box([x+(x>0?-1.4:1.4),2+i*.6,zz],[.15,.2,3],'bronze')}}box([0,11,-93],[33,22,5],'dark');relief(0,10,-90,12,12);}
 if(n===10){for(let j=0;j<3;j++){arch(0,j*1.2,-86-j*3,24-j*4,17-j*1.5,.7,j%2?'bronze':'plaster')}for(const x of[-13,13])for(let j=0;j<4;j++){column(x,-.2,-60-j*7,8,'plaster');dome(x,7.8,-60-j*7,1.2)}temple(0,-106,36);for(let i=0;i<8;i++){const a=i*Math.PI/4;geometry(new TorusGeometry(2.6,.12,6,32,Math.PI),accent,[Math.sin(a)*6,10+Math.cos(a)*6,-94],a)}}

 // Final art pass: functional hero details beyond x=+-10 and rear z=-85.
 if(n===1){for(const x of[-8,-4,0,4,8]){bevel([x,3.1,-89],[3.7,6.2,.6],'bronze');for(let j=0;j<6;j++)box([x,1+j*.85,-88.65],[3.3,.14,.15],'dark')}for(const x of[-12,12])relief(x,7,-75.8,3,4)}
 if(n===2){for(const x of[-13,13]){cylinder([x,2.3,-78],1.7,2.1,4.5,'dark',24);for(const y of[.5,1,3.8,4.4])cylinder([x,y,-78],2.05,2.05,.12,'bronze',24);pipe([[x,4,-78],[x,6,-82],[x,13,-84]],10,.35,'bronze')}for(let x=-8;x<=8;x+=2)box([x,.4,-91],[.15,.8,9],'bronze')}
 if(n===3){for(const x of[-12,12]){for(let j=0;j<5;j++)relief(x,2+j*1.2,-87,2.3,.8);geometry(new TorusGeometry(3,.13,8,48),'bronze',[x,9,-87]);for(let a=0;a<8;a++){const angle=a*Math.PI/4;pipe([[x,9,-87],[x+Math.sin(angle)*3,9+Math.cos(angle)*3,-87]],2,.055,'bronze')}}}
 if(n===4){for(const x of[-8,-4,4,8]){for(const y of[1.5,3,4.5,6]){box([x,y,-87.6],[2.5,.06,.12],'sand');for(const dx of[-1.2,1.2])box([x+dx,y,-87.5],[.08,.6,.18],'bronze')}}}
 if(n===5){for(let i=-3;i<=3;i++){const x=i*4;pipe([[x,6,-85],[x,7,-84],[x,.8,-84]],10,.24,'bronze');geometry(new TorusGeometry(.6,.08,6,24),'bronze',[x,4,-83.7]);for(const y of[.6,2,5.5])box([x,y,-83.7],[1.6,.12,.2],'dark')}}
 if(n===6){for(const x of[-14,14]){box([x,4.5,-78],[4,.35,20],'dark');for(let j=0;j<5;j++){const zz=-62-j*6;pipe([[x,6,zz],[x,7,zz-1],[x,8,zz-1]],4,.18,'bronze');relief(x+(x>0?-2.15:2.15),2,zz,1.4,2.2)}}for(const x of[-8,0,8]){for(let j=0;j<6;j++)box([x-1.6+j*.64,2.8,-89.8],[.1,.3,.12],'sand')}}
 if(n===7){for(let x=-12;x<=12;x+=4){relief(x,3.4,-88.4,2.5,4);for(const dx of[-1.3,1.3])column(x+dx,.2,-88.2,6,'bronze')}for(let i=0;i<5;i++)box([0,i*.22,-84-i*.65],[24,.25,.7],'plaster')}
 if(n===8){for(const x of[-8,8]){for(const y of[1.5,4,6.5,9]){box([x,y,-87.4],[4.8,.24,.5],'dark');for(const dx of[-2,2])relief(x+dx,y+1,-87.1,.65,1.5)}}for(const x of[-3,0,3]){bevel([x,3,-89],[2.7,6,.8],'bronze');for(let j=0;j<5;j++)box([x,.8+j,-88.5],[2.3,.12,.12],'dark')}}
 if(n===9){for(const x of[-10,-5,0,5,10]){bevel([x,6,-90],[4.6,12,.5],'bronze');for(let j=0;j<12;j++)box([x,.5+j,-89.7],[4.3,.1,.2],'dark')}for(const x of[-14,14])pipe([[x,1,-88],[x,14,-88],[x*.5,18,-88]],10,.4,'bronze')}
 if(n===10){for(let x=-10;x<=10;x+=2.5){column(x,0,-97,7,'plaster');relief(x,4,-96.7,1.5,2.4)}for(let j=0;j<6;j++)box([0,.2*j,-91-j*.7],[21-j*.7,.23,.75],'plaster')}
 output.push(await write('arena-'+(n*10)+'.glb'));
}
start();bevel([0,0,0],[3.2,.5,.5],'dark');for(const x of[-1.48,1.48]){bevel([x,0,0],[.22,.7,.7],'bronze');for(const y of[-.22,.22])cylinder([x,y,.34],.045,.045,.06,'bronze',8)}for(let i=0;i<12;i++){const x=-1.3+i*.235;box([x,0,.275],[.13,.32,.09],i%3?'bronze':'dark')}output.push(await write('barrier-housing.glb'));
start();cylinder([0,-.05,0],.36,.44,.23,'dark',24);cylinder([0,.1,0],.3,.35,.14,'bronze',24);for(let i=0;i<4;i++){const a=i*Math.PI/2;const g=new RoundedBoxGeometry(1.08,.12,.25,2,.05);g.translate(.78,0,0);g.rotateY(a);geometry(g,'bronze',[0,0,0]);for(let k=0;k<4;k++){const r=.45+k*.22;box([Math.cos(a)*r,.08,-Math.sin(a)*r],[.12,.04,.12],'dark')}}geometry(new TorusGeometry(.38,.045,6,24).rotateX(Math.PI/2),'bronze',[0,.17,0]);output.push(await write('rotor.glb'));
fs.writeFileSync('phase5/phase54e-final-20261114/geometry-manifest.json' ,JSON.stringify({authorship:'Original authored architecture; no film geometry or protected files',output},null,2));
