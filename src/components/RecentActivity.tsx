import React from 'react'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { DAGRun } from '../types/airflow'
import LoadingSpinner from './LoadingSpinner'

interface RecentActivityProps {
  recentRuns?: DAGRun[]
  failedRuns?: DAGRun[]
  isLoading: boolean
}

const getStatusIcon = (state: string) => {
  switch (state) {
    case 'success':
      return <CheckCircle size={16} className="text-green-500" />
    case 'failed':
      return <XCircle size={16} className="text-red-500" />
    case 'running':
      return <Clock size={16} className="text-blue-500 animate-spin" />
    default:
      return <AlertCircle size={16} className="text-yellow-500" />
  }
}

const getStatusColor = (state: string) => {
  switch (state) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'running':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  recentRuns = [], 
  failedRuns = [], 
  isLoading 
}) => {
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Mock data for demonstration
  const mockRuns = [
    {
      dag_run_id: 'example_dag_2024-01-07T10:30:00+00:00',
      dag_id: 'example_dag',
      state: 'success',
      execution_date: '2024-01-07T10:30:00+00:00',
      start_date: '2024-01-07T10:30:00+00:00',
      end_date: '2024-01-07T10:45:00+00:00'
    },
    {
      dag_run_id: 'data_pipeline_2024-01-07T09:00:00+00:00',
      dag_id: 'data_pipeline',
      state: 'running',
      execution_date: '2024-01-07T09:00:00+00:00',
      start_date: '2024-01-07T09:00:00+00:00',
      end_date: null
    },
    {
      dag_run_id: 'etl_process_2024-01-07T08:00:00+00:00',
      dag_id: 'etl_process',
      state: 'failed',
      execution_date: '2024-01-07T08:00:00+00:00',
      start_date: '2024-01-07T08:00:00+00:00',
      end_date: '2024-01-07T08:15:00+00:00'
    }
  ]

  const displayRuns = recentRuns.length > 0 ? recentRuns : mockRuns

  return (
    <div className="space-y-4">
      {displayRuns.slice(0, 10).map((run) => (
        <div 
          key={run.dag_run_id} 
          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(run.state)}
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{run.dag_id}</span>
              <span className="text-sm text-muted-foreground">
                {run.dag_run_id}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`status-indicator ${getStatusColor(run.state)}`}>
              {run.state}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(run.execution_date), { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
      
      {displayRuns.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Clock size={24} className="mx-auto mb-2" />
          <p>No recent activity</p>
        </div>
      )}
    </div>
  )
}

export default RecentActivity