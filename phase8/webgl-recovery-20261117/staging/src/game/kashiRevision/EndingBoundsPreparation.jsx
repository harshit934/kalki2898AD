import { Component, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { endingActor, prepareEndingBounds } from './endingBounds.js'

function Preparation({ onReady, onError }) {
  const asset = useGLTF(endingActor.src)
  useEffect(() => {
    let active = true
    prepareEndingBounds(asset).then(value => { if (active) onReady(value) }, error => { if (active) onError(error) })
    return () => { active = false }
  }, [asset, onReady, onError])
  return null
}
class LoadBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) {
    // Only a rejected load is evicted; successful shared GLTFs stay cached.
    useGLTF.clear(endingActor.src)
    this.props.onError(error)
  }
  render() { return this.state.failed ? null : this.props.children }
}
export default function EndingBoundsPreparation({ onReady, onError }) {
  const [callbacks] = useState(() => ({ onReady, onError }))
  return <LoadBoundary onError={callbacks.onError}><Preparation {...callbacks} /></LoadBoundary>
}
