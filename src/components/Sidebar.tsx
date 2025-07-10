import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Workflow, 
  List, 
  Database, 
  FileText, 
  Settings,
  Zap,
  X,
  Monitor,
  Activity
} from 'lucide-react'
import { clsx } from 'clsx'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and metrics'
  },
  {
    name: 'DAG Management',
    href: '/dags',
    icon: Workflow,
    description: 'Manage your workflows'
  },
  {
    name: 'Task Instances',
    href: '/tasks',
    icon: List,
    description: 'View task executions'
  },
  {
    name: 'Connections',
    href: '/connections',
    icon: Database,
    description: 'Manage connections'
  },
  {
    name: 'Logs',
    href: '/logs',
    icon: FileText,
    description: 'View system logs'
  },
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          'nav-sidebar',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap size={18} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-foreground">TCS ECM</h1>
                <p className="text-xs text-muted-foreground">Airflow Dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Main Navigation
            </div>
            
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href === '/dashboard' && location.pathname === '/')
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={clsx(
                    'sidebar-nav-item group',
                    isActive && 'active bg-primary text-primary-foreground'
                  )}
                >
                  <item.icon 
                    size={18} 
                    className={clsx(
                      'flex-shrink-0 transition-colors',
                      isActive 
                        ? 'text-primary-foreground' 
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={clsx(
                      'text-sm font-medium truncate',
                      isActive 
                        ? 'text-primary-foreground' 
                        : 'text-foreground group-hover:text-foreground'
                    )}>
                      {item.name}
                    </span>
                    <span className={clsx(
                      'text-xs truncate',
                      isActive 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground group-hover:text-muted-foreground'
                    )}>
                      {item.description}
                    </span>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-4 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Quick Actions
            </div>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                <Monitor size={16} />
                <span>System Status</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                <Activity size={16} />
                <span>Health Check</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Airflow Connected</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Version 2.11.0
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar