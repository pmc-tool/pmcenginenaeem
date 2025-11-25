/**
 * PMC Engine Editor - Main Application
 * Constitutional compliance: Implements persistent dashboard shell
 */

import { ErrorBoundary } from './components/ErrorBoundary'
import { Shell } from './components/shell/Shell'
import './styles/tokens.css'
import './styles/layout.css'
import './styles/responsive.css'

function App() {
  return (
    <ErrorBoundary>
      <Shell />
    </ErrorBoundary>
  )
}

export default App
