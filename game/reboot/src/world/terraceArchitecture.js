// Authored embellishment for the two existing Terrace Walk buildings only.
// All solid parts join their existing compound bodies; trim uses shared
// materials/geometry. Balconies and roof crowns are not new playable rooms.
export function appendTerraceBuildingFinish({b,room,box,part}){
 const front=room.entry[2]
 // Recessed wall planes gain projecting pilasters and shaded arch bays.
 // Four metres of central approach remain free, including the E-key door.
 for(const dx of [-8,-4,4,8]){
  box('light',[b.x+dx,2.1,front+.65],[.42,4.2,.5],true)
  box('brass',[b.x+dx,4.3,front+.65],[.7,.2,.75])
  box('cyan',[b.x+dx,2.2,front+.92],[.08,2.7,.04])
 }
 for(const dx of [-6,6])part('arch','brass',[b.x+dx,3.35,front+1],[1.75,1.1,.8])
 box('light',[b.x,4.78,front+1],[b.w+.8,.2,2.6],true)
 box('brass',[b.x,4.94,front+1.3],[b.w+1,.12,.18])
 for(const dx of [-6,0,6])box('cyan',[b.x+dx,4.66,front+1.3],[2.4,.04,.1])
 // Jali-like side panels and deep cornice shadows articulate human scale.
 for(const side of [-1,1])for(const dz of [-4,0,4]){
  const x=b.x+side*(b.w/2+.12)
  box('indigo',[x,2.5,b.z+dz],[.12,2.5,2],true)
  for(const offset of [-.6,0,.6])box('brass',[x+side*.08,2.5,b.z+dz+offset],[.1,2.6,.08])
 }
 if(b.id==='terrace-arcade'){
  // Low asymmetrical canopy roofs keep the arcade distinct from the taller
  // hall and do not compete with the existing city's civic landmark.
  box('light',[b.x-4,8.2,b.z],[9,.22,b.d*.78],true)
  box('light',[b.x+5,7.55,b.z],[7,.18,b.d*.78],true)
  for(let dx=-7;dx<=-1;dx+=1.5)box('brass',[b.x+dx,8.55,b.z],[.16,.7,b.d*.72])
  for(const dx of [-6.5,6.5])for(const dz of [-3,0,3])box('brass',[b.x+dx,3.9,b.z+dz],[2.5,.12,.12])
  for(const dx of [-6.5,6.5])box('cyan',[b.x+dx,4.18,b.z],[.1,.04,8])
 }else{
  // Upper facade ledges are ornamental, without doors or access markers.
  // Their solid footprint sits above the preserved ground-floor ceiling.
  for(const dx of [-5,5]){
   box('light',[b.x+dx,7.25,front-1.8],[4,.25,2],true)
   box('brass',[b.x+dx,7.95,front-.85],[4,.12,.12])
   for(const rail of [-1.7,0,1.7])box('brass',[b.x+dx+rail,7.65,front-.85],[.1,.7,.1])
   box('cyan',[b.x+dx,7.06,front-1.5],[2.4,.04,.12])
  }
  box('light',[b.x,14.2,b.z],[12,.25,10.8],true)
  for(const dx of [-4.2,4.2])for(const dz of [-3.2,3.2]){
   part('cylinder','brass',[b.x+dx,14.575,b.z+dz],[1.3,.5,1.3])
   part('dome','light',[b.x+dx,14.825,b.z+dz],[1.5,.85,1.5])
   part('cylinder','brass',[b.x+dx,16,b.z+dz],[.08,1.1,.08])
  }
 }
 appendTerraceInteriorFinish({b,room,box,part})
}

// Static environmental displays only. Counter ornaments stay inside existing
// blocking furniture footprints; thin rotated trim never adds colliders.
function appendTerraceInteriorFinish({b,room,box,part}){
 const front=room.entry[2]
 if(b.id==='terrace-arcade'){
  for(const dx of [-6.5,6.5])for(const dz of [-1.8,1.8]){
   const x=b.x+dx,z=b.z+dz
   // Tray bottoms meet the existing counter top at Y=1.05.
   box('dark',[x,1.1,z],[1.6,.1,1.5])
   if(dx<0&&dz>0){
    // Cream ceramic bowls on three stepped brass stands.
    for(let i=0;i<3;i++){
     const px=x+(i-1)*.45,h=.12+i*.12
     part('cylinder','brass',[px,1.15+h/2,z],[.19,h,.19])
     part('dome','light',[px,1.15+h,z],[.2,.18,.2])
    }
   }else if(dx<0){
    // Paired vessels with necks and rim bands.
    for(const side of [-1,1]){
     const px=x+side*.34,h=side<0?.48:.7
     part('cylinder','brass',[px,1.15+h/2,z],[.22,h,.22])
     part('cylinder','light',[px,1.15+h+.06,z],[.13,.12,.13])
     part('cylinder','brass',[px,1.15+h+.13,z],[.18,.02,.18])
    }
   }else if(dz>0){
    // Freestanding woven sample: the solid counter already excludes walking.
    for(const side of [-1,1])box('brass',[x+side*.58,1.56,z],[.08,.82,.12])
    box('brass',[x,2.01,z],[1.24,.08,.12])
    for(let i=-2;i<=2;i++)box('indigo',[x+i*.2,1.58,z],[.11,.7,.1])
    for(const y of [1.4,1.7])box('light',[x,y,z+.07],[1.05,.06,.06])
   }else{
    // Miniature stepped architectural studies, not collectible items.
    for(let i=-1;i<=1;i++){
     const px=x+i*.43,h=i===0?.65:.35
     box('light',[px,1.15+h/2,z],[.35,h,.5])
     box('brass',[px,1.15+h+.035,z],[.4,.07,.55])
    }
   }
  }
 }else if(b.id==='terrace-hall'){
  const back=b.z-b.d/2+.7
  // A shallow axis-aligned backing meets the existing rear wall. Its face
  // relief is trim; only the backing joins the building's compound collider.
  box('indigo',[b.x,2.1,back+.09],[5.6,1.6,.18],true)
  for(let i=-3;i<=3;i++){
   const h=1.35-Math.abs(i)*.28
   box('brass',[b.x+i*.66,1.4+h/2,back+.26],[.4,h,.16])
  }
  for(const y of [1.34,2.86])box('light',[b.x,y,back+.21],[5.6,.08,.06])
  // Two supported alcove panels have different compositions. They remain
  // above existing side furniture, leaving the central room entirely open.
  for(const side of [-1,1]){
   const x=b.x+side*6.5,z=b.z-2.5
   box('indigo',[x,2.06,z],[1.8,1.6,.12])
   box('light',[x,2.9,z],[2,.08,.18])
   if(side<0){
    for(let i=-1;i<=1;i++)box('brass',[x+i*.46,2.04,z+.11],[.1,1.1,.1])
   }else{
    for(const y of [1.65,2.4]){
     box('brass',[x,y,z+.12],[1.3,.08,.12])
     for(const dx of [-.6,.6])box('light',[x+dx,y+.16,z+.12],[.08,.32,.12])
    }
   }
  }
 }
 // One long stroke beside three/four ticks echoes 13/14 without another
 // numbered sign. Flush interior inlays are <=6mm above the existing floor.
 box('brass',[b.x-.85,room.floor+.003,front-.85],[.12,.006,1.05])
 const ticks=b.id==='terrace-arcade'?3:4
 for(let i=0;i<ticks;i++)box('light',[b.x+.35,room.floor+.003,front-1.25+i*.26],[.55,.006,.08])
}

export function appendTerracePlazaFinish({box,part,publicBox,plaza}){
 // Corners frame, rather than fill, the existing plaza. The main X=264
 // promenade and Z=155 crossing remain unobstructed at walking height.
 for(const x of [248,280])for(const z of [145,165]){
  publicBox('light',[x,1.6,z],[.65,3.6,.65])
  box('brass',[x,3.5,z],[1.1,.2,1.1])
  box('cyan',[x,2.1,z+.36],[.12,1.5,.04])
 }
 for(const z of [145,165]){
  publicBox('light',[264,3.72,z],[32,.24,.55])
  box('brass',[264,3.91,z],[32.5,.12,.7])
 }
 // Flush civic inlay is environmental art, not a pickup or service marker.
 part('cylinder','brass',[plaza.x,-.19,plaza.z],[2.5,.01,2.5])
 for(const dx of [-3.5,3.5])box('light',[plaza.x+dx,-.188,plaza.z],[.3,.008,5])
 // Backrests refine the existing four seats instead of adding more clutter.
 for(const x of [252,276])for(const z of [149,161]){
  const back=z<plaza.z?z-.55:z+.55
  publicBox('indigo',[x,.95,back],[3,.7,.15])
  box('brass',[x,1.34,back],[3.1,.08,.2])
 }
}
