import AppRouter from './router/AppRouter'
import { ThemeProvider } from './contexts/ThemeContext'
import { SimulationModeModalProvider } from './contexts/SimulationModeModalContext'
import { Toaster as SonnerToaster } from './components/ui/sonner'
import { Toaster as UiToaster } from './components/ui/toaster'

function App() {
  return (
    <ThemeProvider>
      <SimulationModeModalProvider>
        <AppRouter />
        <UiToaster />
        <SonnerToaster position="top-right" richColors />
      </SimulationModeModalProvider>
    </ThemeProvider>
  )
}

export default App
