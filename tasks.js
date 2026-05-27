import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  // Still waiting for Supabase to return session — show spinner
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--pilot-surface)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground font-mono">Loading ProjectPilot...</span>
        </div>
      </div>
    )
  }

  // Session is definitively null — redirect to login
  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Session confirmed — render protected content
  return children
}

function PublicRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--pilot-surface)]">
        <div className="w-8 h-8 border-2 border-[var(--pilot-blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Already logged in — redirect to dashboard
  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
