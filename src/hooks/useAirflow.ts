import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { airflowService } from '../services/airflow'
import type {
  AirflowHealth,
  DAG,
  DAGRun,
  TaskInstance,
  Connection,
  Pool,
  DashboardStats
} from '../types/airflow'

// Query keys
export const QUERY_KEYS = {
  HEALTH: 'health',
  DAGS: 'dags',
  DAG: 'dag',
  DAG_RUNS: 'dagRuns',
  DAG_RUN: 'dagRun',
  TASK_INSTANCES: 'taskInstances',
  CONNECTIONS: 'connections',
  POOLS: 'pools',
  DASHBOARD_STATS: 'dashboardStats',
  RECENT_RUNS: 'recentRuns',
  FAILED_RUNS: 'failedRuns',
  RUNNING_RUNS: 'runningRuns',
}

// Health Hook
export const useAirflowHealth = () => {
  return useQuery<AirflowHealth, Error>(
    QUERY_KEYS.HEALTH,
    () => airflowService.getHealth(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      retry: 3,
      staleTime: 10000, // Consider data stale after 10 seconds
    }
  )
}

// DAGs Hooks
export const useDAGs = (limit = 100, offset = 0) => {
  return useQuery(
    [QUERY_KEYS.DAGS, limit, offset],
    () => airflowService.getDAGs(limit, offset),
    {
      refetchInterval: 60000, // Refetch every minute
      staleTime: 30000,
    }
  )
}

export const useDAG = (dagId: string) => {
  return useQuery(
    [QUERY_KEYS.DAG, dagId],
    () => airflowService.getDAG(dagId),
    {
      enabled: !!dagId,
      refetchInterval: 30000,
    }
  )
}

export const usePauseDAG = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (dagId: string) => airflowService.pauseDAG(dagId),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(QUERY_KEYS.DAGS)
        queryClient.invalidateQueries([QUERY_KEYS.DAG, data.dag_id])
        toast.success(`DAG ${data.dag_id} paused successfully`)
      },
      onError: (error: any) => {
        toast.error(`Failed to pause DAG: ${error.message}`)
      },
    }
  )
}

export const useUnpauseDAG = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (dagId: string) => airflowService.unpauseDAG(dagId),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(QUERY_KEYS.DAGS)
        queryClient.invalidateQueries([QUERY_KEYS.DAG, data.dag_id])
        toast.success(`DAG ${data.dag_id} unpaused successfully`)
      },
      onError: (error: any) => {
        toast.error(`Failed to unpause DAG: ${error.message}`)
      },
    }
  )
}

export const useTriggerDAG = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ dagId, config }: { dagId: string; config?: any }) =>
      airflowService.triggerDAG(dagId, config),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([QUERY_KEYS.DAG_RUNS, data.dag_id])
        queryClient.invalidateQueries(QUERY_KEYS.DASHBOARD_STATS)
        toast.success(`DAG ${data.dag_id} triggered successfully`)
      },
      onError: (error: any) => {
        toast.error(`Failed to trigger DAG: ${error.message}`)
      },
    }
  )
}

// DAG Runs Hooks
export const useDAGRuns = (dagId?: string, limit = 100, offset = 0) => {
  return useQuery(
    [QUERY_KEYS.DAG_RUNS, dagId, limit, offset],
    () => airflowService.getDAGRuns(dagId, limit, offset),
    {
      refetchInterval: 30000,
      staleTime: 15000,
    }
  )
}

export const useDAGRun = (dagId: string, dagRunId: string) => {
  return useQuery(
    [QUERY_KEYS.DAG_RUN, dagId, dagRunId],
    () => airflowService.getDAGRun(dagId, dagRunId),
    {
      enabled: !!dagId && !!dagRunId,
      refetchInterval: 15000,
    }
  )
}

// Task Instances Hooks
export const useTaskInstances = (dagId: string, dagRunId: string) => {
  return useQuery(
    [QUERY_KEYS.TASK_INSTANCES, dagId, dagRunId],
    () => airflowService.getTaskInstances(dagId, dagRunId),
    {
      enabled: !!dagId && !!dagRunId,
      refetchInterval: 20000,
    }
  )
}

// Connections Hooks
export const useConnections = () => {
  return useQuery(
    QUERY_KEYS.CONNECTIONS,
    () => airflowService.getConnections(),
    {
      staleTime: 5 * 60000, // 5 minutes
    }
  )
}

export const useTestConnection = () => {
  return useMutation(
    (connectionId: string) => airflowService.testConnection(connectionId),
    {
      onSuccess: () => {
        toast.success('Connection test successful')
      },
      onError: (error: any) => {
        toast.error(`Connection test failed: ${error.message}`)
      },
    }
  )
}

// Pools Hook
export const usePools = () => {
  return useQuery(
    QUERY_KEYS.POOLS,
    () => airflowService.getPools(),
    {
      staleTime: 2 * 60000, // 2 minutes
    }
  )
}

// Dashboard Hooks
export const useDashboardStats = () => {
  return useQuery<DashboardStats, Error>(
    QUERY_KEYS.DASHBOARD_STATS,
    () => airflowService.getDashboardStats(),
    {
      refetchInterval: 30000,
      staleTime: 15000,
    }
  )
}

export const useRecentDAGRuns = (limit = 10) => {
  return useQuery(
    [QUERY_KEYS.RECENT_RUNS, limit],
    () => airflowService.getRecentDAGRuns(limit),
    {
      refetchInterval: 30000,
      staleTime: 15000,
    }
  )
}

export const useFailedDAGRuns = (limit = 10) => {
  return useQuery(
    [QUERY_KEYS.FAILED_RUNS, limit],
    () => airflowService.getFailedDAGRuns(limit),
    {
      refetchInterval: 60000,
      staleTime: 30000,
    }
  )
}

export const useRunningDAGRuns = () => {
  return useQuery(
    QUERY_KEYS.RUNNING_RUNS,
    () => airflowService.getRunningDAGRuns(),
    {
      refetchInterval: 15000,
      staleTime: 10000,
    }
  )
}

// Utility Hooks
export const useAirflowConnection = () => {
  return useQuery(
    'airflow-connection',
    () => airflowService.isConnected(),
    {
      refetchInterval: 30000,
      retry: 1,
    }
  )
}

// Custom hook for real-time updates
export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient()

  const refreshAll = () => {
    queryClient.invalidateQueries(QUERY_KEYS.DASHBOARD_STATS)
    queryClient.invalidateQueries(QUERY_KEYS.RECENT_RUNS)
    queryClient.invalidateQueries(QUERY_KEYS.RUNNING_RUNS)
    queryClient.invalidateQueries(QUERY_KEYS.FAILED_RUNS)
    queryClient.invalidateQueries(QUERY_KEYS.HEALTH)
  }

  const refreshDAGs = () => {
    queryClient.invalidateQueries(QUERY_KEYS.DAGS)
    queryClient.invalidateQueries(QUERY_KEYS.DAG_RUNS)
  }

  return {
    refreshAll,
    refreshDAGs,
    queryClient,
  }
}