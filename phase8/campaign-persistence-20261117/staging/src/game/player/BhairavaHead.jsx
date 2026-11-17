import { useEffect, useMemo } from 'react'
import { CatmullRomCurve3, SphereGeometry, TubeGeometry, Vector3 } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

function mergeHair() {
  const pieces = []
  for (let strand = 0; strand < 19; strand += 1) {
    const angle = (strand / 18 - 0.5) * 2.8
    const x = Math.sin(angle) * 0.195
    const points = [
      new Vector3(x, 0.11 + Math.cos(angle) * 0.07, -0.155),
      new Vector3(x * 0.96, 0.245 - Math.abs(x) * 0.35, -0.025),
      new Vector3(x * 0.85, 0.21, 0.13),
      new Vector3(x * 0.5, 0.12, 0.225),
      new Vector3(x * 0.25, 0.025, 0.235),
    ]
    pieces.push(new TubeGeometry(new CatmullRomCurve3(points), 12, 0.019, 5, false))
  }
  const result = mergeGeometries(pieces)
  pieces.forEach((geometry) => geometry.dispose())
  return result
}

export default function BhairavaHead() {
  const geometry = useMemo(() => {
    const face = new SphereGeometry(0.22, 32, 28)
    const positions = face.attributes.position
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)
      const jaw = y < -0.035 ? 0.72 + (y + 0.22) * 0.95 : 0.94
      const cheek = Math.exp(-Math.pow((y + 0.005) * 22, 2)) * Math.abs(x) * 0.12
      positions.setXYZ(i, x * jaw, y * 1.13, z * 0.9 - (z < 0 ? cheek : 0))
    }
    face.computeVertexNormals()
    const scalp = new SphereGeometry(0.232, 32, 20, 0, Math.PI * 2, 0, 2.05)
    const scalpPositions = scalp.attributes.position
    for (let i = 0; i < scalpPositions.count; i += 1) {
      const z = scalpPositions.getZ(i)
      const y = scalpPositions.getY(i)
      // A swept hairline above the brows, with full coverage at the back.
      if (z < -0.04 && y < 0.1) scalpPositions.setY(i, 0.1 + Math.abs(scalpPositions.getX(i)) * 0.12)
    }
    scalp.computeVertexNormals()
    const beard = new SphereGeometry(0.21, 28, 20, Math.PI, Math.PI)
    const vertices = beard.attributes.position
    for (let i = 0; i < vertices.count; i += 1) {
      const x = vertices.getX(i)
      const y = vertices.getY(i)
      const z = vertices.getZ(i)
      vertices.setXYZ(i, x * 0.89, y * 0.58 - 0.13, z * 0.87 - 0.025)
    }
    beard.computeVertexNormals()
    return { face, beard, scalp, hair: mergeHair() }
  }, [])
  useEffect(() => () => Object.values(geometry).forEach((item) => item.dispose()), [geometry])

  return (
    <group position={[0, 1.76, 0]}>
      <mesh geometry={geometry.face} castShadow>
        <meshStandardMaterial color="#aa795b" roughness={0.68} />
      </mesh>
      <mesh geometry={geometry.beard} castShadow>
        <meshStandardMaterial color="#241b16" roughness={0.94} />
      </mesh>
      <mesh geometry={geometry.scalp} castShadow>
        <meshStandardMaterial color="#241c18" roughness={0.82} />
      </mesh>
      <mesh geometry={geometry.hair} castShadow>
        <meshStandardMaterial color="#211a17" roughness={0.73} />
      </mesh>
      <mesh castShadow position={[0, 0.075, 0.205]} scale={[1, 0.8, 0.75]}>
        <sphereGeometry args={[0.09, 14, 10]} />
        <meshStandardMaterial color="#201916" roughness={0.86} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.083, 0.015, -0.184]} scale={[1.3, 0.48, 0.4]}>
            <sphereGeometry args={[0.034, 12, 8]} />
            <meshStandardMaterial color="#b5a18b" roughness={0.4} />
          </mesh>
          <mesh position={[side * 0.083, 0.014, -0.199]} scale={[0.65, 0.85, 0.3]}>
            <sphereGeometry args={[0.017, 10, 8]} />
            <meshStandardMaterial color="#20140c" roughness={0.25} />
          </mesh>
          <mesh position={[side * 0.085, 0.043, -0.185]} rotation={[0, 0, Math.PI / 2 + side * -0.12]}>
            <capsuleGeometry args={[0.012, 0.057, 4, 8]} />
            <meshStandardMaterial color="#302019" roughness={0.93} />
          </mesh>
          <mesh position={[side * 0.204, -0.015, 0]} scale={[0.5, 1, 0.65]} castShadow>
            <sphereGeometry args={[0.057, 12, 10]} />
            <meshStandardMaterial color="#a67354" roughness={0.72} />
          </mesh>
          <mesh position={[side * 0.066, -0.078, -0.19]} rotation={[0, 0, Math.PI / 2 + side * 0.18]}>
            <capsuleGeometry args={[0.022, 0.075, 4, 8]} />
            <meshStandardMaterial color="#2d2019" roughness={0.94} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.025, -0.207]} scale={[0.027, 0.055, 0.036]} castShadow>
        <sphereGeometry args={[1, 14, 12]} />
        <meshStandardMaterial color="#b7815f" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.105, -0.202]} scale={[0.055, 0.012, 0.009]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#87503c" roughness={0.76} />
      </mesh>
    </group>
  )
}
