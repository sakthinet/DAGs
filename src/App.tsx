import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import DAGManagement from './pages/DAGManagement'
import TaskInstances from './pages/TaskInstances'
import Connections from './pages/Connections'
import Logs from './pages/Logs'
import { useAirflowHealth } from './hooks/useAirflow'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { data: healthData, error: healthError } = useAirflowHealth()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    // Hide loading screen when app loads
    const loadingElement = document.getElementById('loading')
    if (loadingElement) {
      loadingElement.style.display = 'none'
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-md shadow-lg md:hidden"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
      }`}>
        {/* Header with connection status */}
        <Header 
          healthData={healthData} 
          healthError={healthError}
          onMenuClick={toggleSidebar}
          showMenuButton={isMobile}
        />

        {/* Page content */}
        <main className="p-6 pt-24">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dags" element={<DAGManagement />} />
            <Route path="/tasks" element={<TaskInstances />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default App