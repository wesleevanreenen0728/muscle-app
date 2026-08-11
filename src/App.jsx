import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import WeightTracker from './pages/WeightTracker'
import WaistTracker from './pages/WaistTracker'
import Training from './pages/Training'
import FoodDiary from './pages/FoodDiary'
import FoodLibrary from './pages/FoodLibrary'
import Settings from './pages/Settings'
import NavBar from './components/NavBar'

function AppShell() {
  const { session } = useAuth()

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-text-dim">Loading...</p>
      </div>
    )
  }

  if (session === null) {
    return <Login />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/weight" element={<WeightTracker />} />
        <Route path="/waist" element={<WaistTracker />} />
        <Route path="/training" element={<Training />} />
        <Route path="/food" element={<FoodDiary />} />
        <Route path="/library" element={<FoodLibrary />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <NavBar />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      {/* HashRouter avoids needing server-side rewrite rules on GitHub Pages */}
      <HashRouter>
        <AppShell />
      </HashRouter>
    </AuthProvider>
  )
}
