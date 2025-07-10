import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import { ThemeProvider } from './components/ThemeProvider'
import { supabase } from './supabase/client'
import { Session } from '@supabase/supabase-js'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-green-400 text-2xl font-bold">
        Initializing Ghost Swarm Console...
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ghost-swarm-theme">
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={session ? <Navigate to="/dashboard" replace /> : <LoginScreen />} 
          />
          <Route 
            path="/dashboard" 
            element={session ? <Dashboard session={session} /> : <Navigate to="/login" replace />} 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App