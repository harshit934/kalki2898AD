import{firstCity}from'./cityAssets.js'
import FirstCityEnvironment,{CityCollisions as FirstCollisions}from'./FirstCityEnvironment.jsx'
import CorrectedCity from'./CorrectedCity.jsx'
import{CuboidCollider,RigidBody}from'@react-three/rapier'
const footprints=[[13,17,7,12,13],[14,1,8,13,18],[13,-17,7,14,11],[15,-36,10,15,22],[13,-54,7,13,16],[-15,16,6,11,9],[-15,-3,6,12,14],[-16,-23,7,14,18],[-16,-43,7,13,12],[-17,-61,8,14,20]]
export function CityCollisions(){if(firstCity())return <FirstCollisions/>;return <RigidBody type="fixed" colliders={false} name="corrected-city-collisions">
 {footprints.map(([x,z,w,d,h])=><CuboidCollider key={`${x}/${z}`} args={[w/2,h/2,d/2]} position={[x,h/2-.22,z]}/>)}
 {[[9,7],[-10,-8],[9,-23],[-10,-32],[10,-43]].map(([x,z])=><CuboidCollider key={`${x}/${z}`} args={[1,.6,1.8]} position={[x,.4,z]}/>)}
 {Array.from({length:14},(_,i)=><CuboidCollider key={i} args={[.35,.1,67]} position={[-12.5-i*.62,-.23-i*.115,-31]}/>)}
 {[25,-12.5,-52].flatMap(z=>Array.from({length:9},(_,j)=><CuboidCollider key={`${z}/${j}`} args={[.5,.09,z===-52?1.7:2.5]} position={[-8.4-j*.9,-.2-j*.13,z]}/>))}
 <CuboidCollider args={[.2,1,70]} position={[-21,-.6,-32]}/>
 </RigidBody>}
export default function CityEnvironment(props){return firstCity()?<FirstCityEnvironment {...props}/>:<CorrectedCity {...props}/>}
