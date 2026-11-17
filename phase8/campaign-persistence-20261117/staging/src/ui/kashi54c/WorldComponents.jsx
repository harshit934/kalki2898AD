import './worldTokens.css'

export function WorldPanel({ children, className = '', ...props }) {
  return <section className={`world-panel ${className}`} {...props}>{children}</section>
}
export function WorldButton({ children, tone = 'secondary', ...props }) {
  return <button type="button" className="world-button" data-tone={tone} {...props}>{children}</button>
}
export function WorldMeter({ value, label }) {
  return <div className="world-meter" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
}
export function WorldMissionTile() {
  return <article className="world-mission"><span className="world-kicker">01 / Kashi river district</span><strong>A city built in layers</strong><p>Carved stone below. Repair shops, solar-water infrastructure and a working river above.</p></article>
}
