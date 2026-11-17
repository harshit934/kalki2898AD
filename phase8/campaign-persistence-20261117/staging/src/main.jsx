import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const Root = new URLSearchParams(location.search).get('kashiPrototype') === 'review'
  ? lazy(() => import('./game/kashi54c/KashiPrototypeReview.jsx'))
  : new URLSearchParams(location.search).get('kashiPrototype') === 'revision-review'
    ? lazy(() => import('./game/kashiRevision/RevisionReview.jsx'))
  : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<p role="status">Loading Kashi study…</p>}><Root /></Suspense>
  </StrictMode>,
)
