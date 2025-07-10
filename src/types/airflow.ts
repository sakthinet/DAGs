// Airflow API Types
export interface AirflowHealth {
  metadatabase: {
    status: 'healthy' | 'unhealthy'
  }
  scheduler: {
    status: 'healthy' | 'unhealthy'
    latest_scheduler_heartbeat: string
  }
}

export interface DAG {
  dag_id: string
  description: string | null
  file_token: string
  fileloc: string
  has_import_errors: boolean
  has_task_concurrency_limits: boolean
  is_active: boolean
  is_paused: boolean
  last_expired: string | null
  last_pickled: string | null
  last_updated: string
  max_active_runs: number
  max_active_tasks: number
  next_dagrun: string | null
  next_dagrun_create_after: string | null
  next_dagrun_data_interval_end: string | null
  next_dagrun_data_interval_start: string | null
  owners: string[]
  pickle_id: string | null
  root_dag_id: string | null
  schedule_interval: any
  scheduler_lock: string | null
  tags: Array<{ name: string }>
  timetable_description: string | null
}

export interface DAGRun {
  dag_run_id: string
  dag_id: string
  logical_date: string
  execution_date: string
  start_date: string | null
  end_date: string | null
  state: 'queued' | 'running' | 'success' | 'failed' | 'up_for_retry' | 'up_for_reschedule' | 'upstream_failed' | 'skipped' | 'scheduled'
  external_trigger: boolean
  run_type: 'manual' | 'scheduled' | 'dataset_triggered' | 'backfill'
  conf: Record<string, any>
  data_interval_end: string | null
  data_interval_start: string | null
  last_scheduling_decision: string | null
  note: string | null
}

export interface TaskInstance {
  task_id: string
  dag_id: string
  dag_run_id: string
  logical_date: string
  execution_date: string
  start_date: string | null
  end_date: string | null
  duration: number | null
  state: 'none' | 'scheduled' | 'queued' | 'running' | 'success' | 'shutdown' | 'restarting' | 'failed' | 'skipped' | 'upstream_failed' | 'up_for_retry' | 'up_for_reschedule' | 'sensing' | 'deferred' | 'removed'
  try_number: number
  max_tries: number
  hostname: string
  unixname: string
  job_id: number | null
  pool: string
  pool_slots: number
  queue: string | null
  priority_weight: number
  operator: string
  queued_dttm: string | null
  queued_by_job_id: number | null
  pid: number | null
  executor_config: Record<string, any>
  sla_miss: any | null
  rendered_fields: Record<string, any>
  test_mode: boolean
  triggerer_id: number | null
  triggerer_job_id: number | null
  note: string | null
}

export interface Connection {
  connection_id: string
  conn_type: string
  description: string | null
  host: string | null
  login: string | null
  schema: string | null
  port: number | null
  password: string | null
  extra: string | null
  uri: string
  is_encrypted: boolean
  is_extra_encrypted: boolean
}

export interface Pool {
  name: string
  slots: number
  occupied_slots: number
  running_slots: number
  queued_slots: number
  scheduled_slots: number
  open_slots: number
  description: string | null
}

export interface Variable {
  key: string
  val: string | null
  description: string | null
  is_encrypted: boolean
}

export interface XCom {
  key: string
  timestamp: string
  execution_date: string
  task_id: string
  dag_id: string
  value: any
}

// Dashboard specific types
export interface DashboardStats {
  total_dags: number
  active_dags: number
  paused_dags: number
  total_dag_runs: number
  running_dag_runs: number
  successful_dag_runs: number
  failed_dag_runs: number
  total_task_instances: number
  running_task_instances: number
  successful_task_instances: number
  failed_task_instances: number
}

export interface AirflowConfig {
  base_url: string
  username?: string
  password?: string
  api_version: string
}

export interface LogEntry {
  timestamp: string
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  message: string
  dag_id?: string
  task_id?: string
  execution_date?: string
}

// Chart data types
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface TaskStatusDistribution {
  status: string
  count: number
  color: string
}

export interface DAGRunsTimeline {
  dag_id: string
  runs: Array<{
    run_id: string
    start_date: string
    end_date: string | null
    state: string
    duration: number | null
  }>
}