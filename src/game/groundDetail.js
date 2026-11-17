import { useMemo, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { RepeatWrapping, SRGBColorSpace } from 'three'

export function useGroundDetail() {
  const source=useTexture(['stone-color.jpg','stone-normal.jpg','stone-roughness.jpg','stone-ao.jpg'].map(n=>'/environment/kashi/'+n))
  const maps=useMemo(()=>{
    const [color,normal,roughness,ao]=source.map(t=>t.clone())
    color.colorSpace=SRGBColorSpace
    for(const t of [color,normal,roughness,ao]){t.wrapS=t.wrapT=RepeatWrapping;t.repeat.set(90,90);t.anisotropy=4}
    return {color,normal,roughness,ao}
  },[source])
  useEffect(()=>()=>Object.values(maps).forEach(t=>t.dispose()),[maps])
  return maps
}
