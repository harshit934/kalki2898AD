export const missionOneEnding={
  id:'kashi-contract-return',storyPlacement:'mission-ending',presentation:'kashi',duration:10.5,waitForSpawn:false,enterDuration:.6,returnDuration:.8,
  titles:[{at:.6,duration:3,eyebrow:'CONTRACT SECURED',text:'A WAY BACK'}],
  camera:[{at:0,position:[3.8,2.4,4.7],focus:[0,1.1,0],fov:46},{at:5,position:[2.5,1.8,3.4],focus:[0,1.35,0],fov:40},{at:10.5,position:[.8,2.6,5.2],focus:[0,1.2,-1],fov:44}],
  actors:[{id:'bhairava',src:'/models/bhairava-free-rig.glb?v=4',height:1.78,appearance:'bhairava',weapon:true,rotation:[0,Math.PI,0],position:[0,0,0],actions:[{at:0,clip:'Sword idle (guard)'}]}],
  dialogue:[
    {at:1.3,duration:3.6,speaker:'BUJJI',lang:'te',text:'దారి గుర్తుంది. సంపాదించినదంతా జాగ్రత్తగా తీసుకెళ్దాం.',translation:'Route saved. Let’s get everything we earned back safely.'},
    {at:5.3,duration:3.7,speaker:'BHAIRAVA',lang:'te',text:'ముందు లెక్క చూసుకో, బుజ్జీ. తర్వాతి పని మనకోసం ఆగదు.',translation:'Check the account first, Bujji. The next job won’t wait for us.'},
  ],
  audio:[{at:.2,src:'/audio/cinematics/phase41-chime.wav',channel:'effects',gain:.22}],
}
