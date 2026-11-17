import { useEffect, useMemo } from 'react'
import { makeBladeGeometry } from './bladeGeometry.js'

// WeaponR uses a grip-centred +Y blade axis; keep this prop unrotated.
export default function BhairavaWeapon({ bladeMaterialRef }) {
  const blade = useMemo(() => makeBladeGeometry(), [])
  useEffect(() => () => blade.dispose(), [blade])
  return <group name="bhairava-socket-sword">
    <mesh geometry={blade} castShadow><meshStandardMaterial ref={bladeMaterialRef} color="#c5c0ae" metalness={0.86} roughness={0.32} emissive="#e1ad69" emissiveIntensity={0} /></mesh>
    <mesh position={[0, 0.0025, 0]} castShadow><cylinderGeometry args={[0.016, 0.018, 0.135, 12]} /><meshStandardMaterial color="#36271c" roughness={0.78} /></mesh>
    <mesh position={[0, 0.078, 0]} scale={[0.48, 1, 1]} castShadow><cylinderGeometry args={[0.072, 0.078, 0.014, 12]} /><meshStandardMaterial color="#9d8259" metalness={0.72} roughness={0.44} /></mesh>
    <mesh position={[0, -0.078, 0]} castShadow><sphereGeometry args={[0.023, 10, 6]} /><meshStandardMaterial color="#8d7658" metalness={0.74} roughness={0.42} /></mesh>
  </group>
}
