import React from 'react'
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Pause,
  TrendingUp,
  AlertTriangle,
  Database,
  Workflow,
  List,
  RefreshCw
} from 'lucide-react'
import { 
  useDashboardStats, 
  useRecentDAGRuns, 
  useFailedDAGRuns, 
  useRunningDAGRuns,
  useDAGs,
  useRealTimeUpdates
} from '../hooks/useAirflow'
import MetricCard from '../components/MetricCard'
import DAGRunsChart from '../components/DAGRunsChart'
import TaskStatusChart from '../components/TaskStatusChart'
import RecentActivity from '../components/RecentActivity'
import RunningDAGs from '../components/RunningDAGs'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: recentRuns, isLoading: recentLoading } = useRecentDAGRuns(10)
  const { data: failedRuns, isLoading: failedLoading } = useFailedDAGRuns(5)
  const { data: runningRuns, isLoading: runningLoading } = useRunningDAGRuns()
  const { data: dagsData, isLoading: dagsLoading } = useDAGs()
  const { refreshAll } = useRealTimeUpdates()

  const handleRefresh = () => {
    refreshAll()
  }

  if (statsLoading || recentLoading || dagsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center">
        <div className="max-w-md">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-4">
            Unable to connect to Airflow. Please check your connection and try again.
          </p>
          <button 
            onClick={handleRefresh}
            className="btn btn-primary btn-md"
          >
            <RefreshCw size={16} />
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your Airflow workflows and system health
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="btn btn-outline btn-md gap-2"
        >
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="dashboard-grid">
        <MetricCard
          title="Total DAGs"
          value={stats?.total_dags || 0}
          icon={Workflow}
          description="Workflow definitions"
          trend={{ value: stats?.active_dags || 0, label: "active" }}
          color="blue"
        />
        
        <MetricCard
          title="Running DAGs"
          value={stats?.running_dag_runs || 0}
          icon={Play}
          description="Currently executing"
          trend={{ value: runningRuns?.length || 0, label: "instances" }}
          color="green"
          pulse={true}
        />
        
        <MetricCard
          title="Failed Runs"
          value={stats?.failed_dag_runs || 0}
          icon={XCircle}
          description="Require attention"
          trend={{ value: failedRuns?.length || 0, label: "recent" }}
          color="red"
        />
        
        <MetricCard
          title="Success Rate"
          value={`${stats ? Math.round(
            (stats.successful_dag_runs / (stats.total_dag_runs || 1)) * 100
          ) : 0}%`}
          icon={CheckCircle}
          description="Overall success"
          trend={{ 
            value: stats?.successful_dag_runs || 0, 
            label: "successful" 
          }}
          color="green"
        />
        
        <MetricCard
          title="Task Instances"
          value={stats?.total_task_instances || 0}
          icon={List}
          description="Total executions"
          trend={{ 
            value: stats?.running_task_instances || 0, 
            label: "running" 
          }}
          color="purple"
        />
        
        <MetricCard
          title="Paused DAGs"
          value={stats?.paused_dags || 0}
          icon={Pause}
          description="Temporarily disabled"
          trend={{ 
            value: (stats?.total_dags || 0) - (stats?.paused_dags || 0), 
            label: "active" 
          }}
          color="yellow"
        />
        
        <MetricCard
          title="System Health"
          value="Healthy"
          icon={Activity}
          description="All systems operational"
          trend={{ value: 99.9, label: "uptime %" }}
          color="green"
          pulse={true}
        />
        
        <MetricCard
          title="Data Pipeline"
          value="Online"
          icon={Database}
          description="Database connected"
          trend={{ value: 1, label: "connection" }}
          color="blue"
        />
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DAG Runs Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <TrendingUp size={20} />
              DAG Runs Over Time
            </h3>
            <p className="card-description">
              Execution trends for the last 7 days
            </p>
          </div>
          <div className="card-content">
            <DAGRunsChart />
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <Activity size={20} />
              Task Status Distribution
            </h3>
            <p className="card-description">
              Current task instance states
            </p>
          </div>
          <div className="card-content">
            <TaskStatusChart />
          </div>
        </div>
      </div>

      {/* Activity and Running DAGs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-2">
                <Clock size={20} />
                Recent Activity
              </h3>
              <p className="card-description">
                Latest DAG executions and events
              </p>
            </div>
            <div className="card-content">
              <RecentActivity 
                recentRuns={recentRuns}
                failedRuns={failedRuns}
                isLoading={recentLoading || failedLoading}
              />
            </div>
          </div>
        </div>

        {/* Running DAGs */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-2">
                <Play size={20} />
                Currently Running
              </h3>
              <p className="card-description">
                DAGs in execution
              </p>
            </div>
            <div className="card-content">
              <RunningDAGs 
                runningRuns={runningRuns}
                isLoading={runningLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>
          Dashboard updates every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

export default Dashboard