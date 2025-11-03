import AppRouter from './router/AppRouter'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
      <Toaster />
    </ThemeProvider>
  )
}

export default App
