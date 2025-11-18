import AppRouter from './router/AppRouter'
import { ThemeProvider } from './contexts/ThemeContext'
import { SimulationModeModalProvider } from './contexts/SimulationModeModalContext'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <ThemeProvider>
      <SimulationModeModalProvider>
        <AppRouter />
        <Toaster />
      </SimulationModeModalProvider>
    </ThemeProvider>
  )
}

export default App
