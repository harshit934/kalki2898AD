import { useMemo, useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { RepeatWrapping, SRGBColorSpace, Vector2, FrontSide, DoubleSide } from 'three'

const PATH='/environment/kashi/'
// Drei shares a decoder instance between useGLTF calls; keep every default call local too.
useGLTF.setDecoderPath(PATH+'draco/')
export default function KashiEnvironment({ assetPath=PATH+'kashi-courtyard.glb',castShadow=true }) {
  const asset=useGLTF(assetPath,PATH+'draco/')
  const sourceMaps=useTexture(['stone-color.jpg','stone-normal.jpg','stone-roughness.jpg','stone-ao.jpg'].map(n=>PATH+n))
  const model=useMemo(()=>{
    const [color,normal,roughness,ao]=sourceMaps.map(t=>t.clone())
    color.colorSpace=SRGBColorSpace
    for(const texture of [color,normal,roughness,ao]){texture.flipY=false;texture.wrapS=texture.wrapT=RepeatWrapping;texture.anisotropy=4}
    const scene=asset.scene.clone(true),owned=[]
    scene.traverse(o=>{
      if(!o.isMesh)return
      o.castShadow=castShadow;o.receiveShadow=true
      const prepare=source=>{
        const m=source.clone();owned.push(m)
        m.side=/cloth/.test(m.name)?DoubleSide:FrontSide
        if(/Sandstone|limestone|Terracotta/.test(m.name)){
          m.map=color;m.normalMap=normal;m.normalScale=new Vector2(.55,.55);m.roughnessMap=roughness;m.roughness=.94;m.aoMap=ao;m.aoMapIntensity=.5;m.metalness=0
          if(assetPath.includes('/mission1/')||assetPath.includes('/mission531/')){
            m.onBeforeCompile=shader=>{
              shader.vertexShader='varying vec3 vKashiStone;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvKashiStone=(modelMatrix*vec4(transformed,1.0)).xyz;')
              shader.fragmentShader='varying vec3 vKashiStone;\n'+shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nfloat stoneAge=.5+.5*sin(vKashiStone.x*.43+vKashiStone.z*.17)*sin(vKashiStone.y*.7+vKashiStone.z*.31);\ndiffuseColor.rgb*=mix(vec3(.76,.81,.78),vec3(1.08,1.02,.94),stoneAge);\nfloat dampBase=(1.0-smoothstep(0.0,1.4,vKashiStone.y))*.15;\ndiffuseColor.rgb=mix(diffuseColor.rgb,vec3(.16,.12,.085),dampBase);')
            }
            m.customProgramCacheKey=()=> 'mission531-weathered-stone-v1'
          }
          if(assetPath.includes('/complex.')){
            m.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n diffuseColor.rgb=mix(vec3(dot(diffuseColor.rgb,vec3(.2126,.7152,.0722))),diffuseColor.rgb,.18);')}
            m.customProgramCacheKey=()=> 'complex-concrete-albedo-v1'
          }
        }
        if(/brass/.test(m.name)){m.roughness=.4;m.metalness=.72}
        if(/cloth/.test(m.name)){m.roughness=.96}
        if(/Teal/.test(m.name)){m.emissive.set('#12443e');m.emissiveIntensity=.12}
        return m
      }
      o.material=Array.isArray(o.material)?o.material.map(prepare):prepare(o.material)
    })
    return {scene,owned,maps:[color,normal,roughness,ao]}
  },[asset,sourceMaps,assetPath,castShadow])
  useEffect(()=>()=>{model.owned.forEach(m=>m.dispose());model.maps.forEach(t=>t.dispose())},[model])
  return <primitive object={model.scene} />
}
