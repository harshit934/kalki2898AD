import { useEffect, useMemo } from 'react'
import { BoxGeometry, CylinderGeometry } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

export default function EnemyArmor({ type }) {
  const heavy = type === 'heavy' || type === 'glassBrute'
  const glass = type === 'glassStalker' || type === 'glassBrute'
  const scout = type === 'scout'
  const geometry = useMemo(() => {
    const pieces = []
    const width = heavy ? 0.82 : scout ? 0.52 : 0.48
    const chest = heavy ? 1.6 : 1.25
    for (let row = 0; row < 4; row += 1) {
      const plate = new BoxGeometry(width * (1 - row * 0.06), 0.13, 0.12)
      plate.rotateX(-0.13)
      plate.translate(0, chest - row * 0.16, heavy ? -0.61 : -0.43)
      pieces.push(plate)
    }
    for (const side of [-1, 1]) {
      for (let tier = 0; tier < 3; tier += 1) {
        const plate = new BoxGeometry(heavy ? 0.65 : 0.29, 0.12, heavy ? 0.8 : 0.4)
        plate.rotateZ(side * (0.12 + tier * 0.08))
        plate.translate(side * (heavy ? 0.86 : 0.53), chest + 0.4 - tier * 0.1, 0)
        pieces.push(plate)
      }
      const piston = new CylinderGeometry(heavy ? 0.105 : 0.045, heavy ? 0.105 : 0.045, heavy ? 0.83 : 0.55, 10)
      piston.translate(side * (heavy ? 0.49 : 0.24), chest + 0.16, 0.38)
      pieces.push(piston)
    }
    const result = mergeGeometries(pieces)
    pieces.forEach((piece) => piece.dispose())
    return result
  }, [heavy, scout])
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={glass ? '#4b7e89' : heavy ? '#635d50' : scout ? '#49666b' : '#89735a'}
        metalness={glass ? 0.62 : 0.7}
        roughness={glass ? 0.24 : 0.47}
      />
    </mesh>
  )
}
