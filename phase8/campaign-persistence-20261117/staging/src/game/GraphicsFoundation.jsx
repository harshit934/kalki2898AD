import WorldArchitecture from './WorldArchitecture.jsx'

// Detailed facade meshes replace the former decorative block/torus horizon.
// Existing collision, mission coordinates and combat geometry stay in World.
export default function GraphicsFoundation({ missionId }) {
  return <group name="phase52-horizon-architecture"><WorldArchitecture missionId={missionId} /></group>
}
