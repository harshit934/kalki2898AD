import { useRef } from 'react'
import { createDuel } from './missionTwoSequence.js'
import { useCinematic } from './cinematics/controller.js'
import ContractActor from './MissionTwoContractActor.jsx'
export default function FinisherOpponent({ session }) {
  const runtime = useRef(session.config.finisherState ?? createDuel())
  return <ContractActor source="/models/soldier-source.glb" runtime={runtime} enabled={useCinematic(s => s.phase) === 'playing'} cinematicSession={session} />
}

