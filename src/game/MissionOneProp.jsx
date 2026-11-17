import {use} from 'react'
import {cityEnabled,finalCity,loadFinalProp} from './phase54e/cityAssets.js'
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
export default function MissionOneProp({name}){return cityEnabled()&&finalCity()&&['barrier-housing','rotor'].includes(name)?<FinalProp name={name}/>:<OriginalProp name={name}/>}
function FinalProp({name}){const asset=use(loadFinalProp(name));const model=useMemo(()=>{const copy=asset.scene.clone(true);copy.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});return copy},[asset]);return <primitive object={model} dispose={null}/>}
function OriginalProp({name}){
  const {scene}=useGLTF(`/environment/mission1/${name}-v1.glb`,'/environment/kashi/draco/')
  const model=useMemo(()=>{const copy=scene.clone(true);copy.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});return copy},[scene])
  return <primitive object={model} dispose={null} />
}
