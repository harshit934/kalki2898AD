import { Component } from 'react'

// Keep renderer failures outside the menu and campaign state owners.
export default class GraphicsBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    const menu = this.props.mode === 'menu'
    return <section role="alert" aria-label="Graphics unavailable" style={{
      position: menu ? 'relative' : 'fixed', inset: menu ? undefined : 0,
      zIndex: 10000, padding: '2rem', background: '#101419', color: '#f0eee8',
      display: 'grid', alignContent: 'center', gap: '1rem',
    }}>
      <h2>3D graphics unavailable</h2>
      <p>{menu ? 'The menu remains available without its 3D backdrop.' : 'The game could not initialize its 3D renderer.'}</p>
      <p>Chrome may have disabled WebGL after a graphics-process failure. Check chrome://gpu before trying again. Your saved progress has not been reset.</p>
      {!menu && <button type="button" onClick={() => window.location.reload()}>Reload page</button>}
    </section>
  }
}
