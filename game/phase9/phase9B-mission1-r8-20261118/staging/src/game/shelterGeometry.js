// Shared visible walls and physical collision. Local coordinates, Y up.
export function shelterParts(site){
 const side=Math.sign(site.position[0])
 return [
  {at:[side*1.1,1.5,0],size:[.16,3,5.6],color:'#75624c'},
  {at:[0,1.5,-2.75],size:[2.3,3,.16],color:'#645b4e'},
  {at:[0,1.5,2.75],size:[2.3,3,.16],color:'#645b4e'},
  {at:[0,3.05,0],size:[2.5,.16,5.8],color:site.variant==='aid'?'#587166':'#95724e'},
 ]
}
