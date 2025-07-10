import React from 'react'
import { 
  Menu, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Database,
  Server
} from 'lucide-react'
import { format } from 'date-fns'
import type { AirflowHealth } from '../types/airflow'

interface HeaderProps {
  healthData?: AirflowHealth
  healthError?: Error | null
  onMenuClick: () => void
  showMenuButton: boolean
}

const Header: React.FC<HeaderProps> = ({ 
  healthData, 
  healthError, 
  onMenuClick, 
  showMenuButton 
}) => {
  const isHealthy = healthData && 
    healthData.metadatabase.status === 'healthy' && 
    healthData.scheduler.status === 'healthy'

  const getConnectionStatus = () => {
    if (healthError) {
      return {
        status: 'error',
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        icon: WifiOff,
        text: 'Disconnected',
        description: 'Unable to connect to Airflow'
      }
    }

    if (!healthData) {
      return {
        status: 'loading',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        icon: RefreshCw,
        text: 'Connecting...',
        description: 'Establishing connection'
      }
    }

    if (isHealthy) {
      return {
        status: 'healthy',
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        icon: CheckCircle,
        text: 'Connected',
        description: 'All systems operational'
      }
    }

    return {
      status: 'warning',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      icon: AlertCircle,
      text: 'Issues Detected',
      description: 'Some components unhealthy'
    }
  }

  const connectionStatus = getConnectionStatus()
  const currentTime = format(new Date(), 'PPp')

  return (
    <header className="fixed top-0 right-0 left-64 md:left-64 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              TCS ECM Airflow Dashboard
            </h2>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Right side - Connection Status */}
        <div className="flex items-center gap-4">
          {/* Connection Status Card */}
          <div className={`
            flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-200
            ${connectionStatus.bgColor} ${connectionStatus.borderColor}
          `}>
            <connectionStatus.icon 
              size={16} 
              className={`${connectionStatus.color} ${
                connectionStatus.status === 'loading' ? 'animate-spin' : ''
              }`}
            />
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${connectionStatus.color}`}>
                {connectionStatus.text}
              </span>
              <span className="text-xs text-muted-foreground">
                {connectionStatus.description}
              </span>
            </div>
          </div>

          {/* System Health Indicators */}
          {healthData && (
            <div className="hidden md:flex items-center gap-2">
              {/* Database Status */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted">
                <Database size={14} className={
                  healthData.metadatabase.status === 'healthy' 
                    ? 'text-green-500' 
                    : 'text-red-500'
                } />
                <span className="text-xs text-muted-foreground">DB</span>
              </div>

              {/* Scheduler Status */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted">
                <Server size={14} className={
                  healthData.scheduler.status === 'healthy' 
                    ? 'text-green-500' 
                    : 'text-red-500'
                } />
                <span className="text-xs text-muted-foreground">Scheduler</span>
              </div>
            </div>
          )}

          {/* Connection Indicator Dot */}
          <div className="flex items-center gap-2">
            <div className={`
              h-3 w-3 rounded-full 
              ${isHealthy 
                ? 'bg-green-500 animate-pulse' 
                : healthError 
                  ? 'bg-red-500' 
                  : 'bg-yellow-500 animate-pulse'
              }
            `} />
            <span className="hidden lg:inline text-sm text-muted-foreground">
              http://localhost:8080
            </span>
          </div>
        </div>
      </div>

      {/* Sub-header with additional info */}
      {healthData && (
        <div className="px-6 py-2 bg-muted/50 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Airflow v2.11.0</span>
              <span>•</span>
              <span>API v1</span>
              {healthData.scheduler.latest_scheduler_heartbeat && (
                <>
                  <span>•</span>
                  <span>
                    Last heartbeat: {format(
                      new Date(healthData.scheduler.latest_scheduler_heartbeat), 
                      'HH:mm:ss'
                    )}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={12} className="text-green-500" />
              <span>Live Data</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header