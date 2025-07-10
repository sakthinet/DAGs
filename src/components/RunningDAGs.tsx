import React from 'react'
import { Play, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { DAGRun } from '../types/airflow'
import LoadingSpinner from './LoadingSpinner'

interface RunningDAGsProps {
  runningRuns?: DAGRun[]
  isLoading: boolean
}

const RunningDAGs: React.FC<RunningDAGsProps> = ({ runningRuns = [], isLoading }) => {
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Mock data for demonstration
  const mockRunningRuns = [
    {
      dag_run_id: 'daily_etl_2024-01-07T09:00:00+00:00',
      dag_id: 'daily_etl',
      state: 'running',
      execution_date: '2024-01-07T09:00:00+00:00',
      start_date: '2024-01-07T09:00:00+00:00',
      end_date: null
    },
    {
      dag_run_id: 'data_sync_2024-01-07T09:30:00+00:00',
      dag_id: 'data_sync',
      state: 'running',
      execution_date: '2024-01-07T09:30:00+00:00',
      start_date: '2024-01-07T09:30:00+00:00',
      end_date: null
    }
  ]

  const displayRuns = runningRuns.length > 0 ? runningRuns : mockRunningRuns

  return (
    <div className="space-y-4">
      {displayRuns.map((run) => (
        <div 
          key={run.dag_run_id}
          className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Play size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{run.dag_id}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(run.start_date!), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm text-blue-600 dark:text-blue-400">Running</span>
            </div>
          </div>
        </div>
      ))}
      
      {displayRuns.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Clock size={24} className="mx-auto mb-2" />
          <p>No running DAGs</p>
        </div>
      )}
    </div>
  )
}

export default RunningDAGs