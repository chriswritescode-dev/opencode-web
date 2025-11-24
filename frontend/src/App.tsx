import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Repos } from './pages/Repos'
import { RepoDetail } from './pages/RepoDetail'
import { SessionDetail } from './pages/SessionDetail'
import { SettingsDialog } from './components/settings/SettingsDialog'
import { useSettingsDialog } from './hooks/useSettingsDialog'
import { useTheme } from './hooks/useTheme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      refetchOnWindowFocus: true,
    },
  },
})

function AppContent() {
  const { isOpen, close } = useSettingsDialog()
  useTheme()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Repos />} />
        <Route path="/repos/:id" element={<RepoDetail />} />
        <Route path="/repos/:id/sessions/:sessionId" element={<SessionDetail />} />
        <Route path="/session/:sessionId" element={<SessionDetail />} />
      </Routes>
      <SettingsDialog open={isOpen} onOpenChange={close} />
    </BrowserRouter>
  )
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
