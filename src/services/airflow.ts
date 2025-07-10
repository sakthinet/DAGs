import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type {
  AirflowHealth,
  DAG,
  DAGRun,
  TaskInstance,
  Connection,
  Pool,
  Variable,
  DashboardStats,
  AirflowConfig
} from '../types/airflow'

class AirflowService {
  private client: AxiosInstance
  private config: AirflowConfig

  constructor(config?: Partial<AirflowConfig>) {
    this.config = {
      base_url: config?.base_url || 'http://localhost:8080',
      username: config?.username || 'airflow',
      password: config?.password || 'airflow',
      api_version: config?.api_version || 'v1'
    }

    this.client = axios.create({
      baseURL: `${this.config.base_url}/api/${this.config.api_version}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add auth if credentials are provided
    if (this.config.username && this.config.password) {
      this.client.defaults.auth = {
        username: this.config.username,
        password: this.config.password,
      }
    }

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Airflow API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  // Health and Config
  async getHealth(): Promise<AirflowHealth> {
    const response: AxiosResponse<AirflowHealth> = await this.client.get('/health')
    return response.data
  }

  async getConfig(): Promise<any> {
    const response = await this.client.get('/config')
    return response.data
  }

  async getVersion(): Promise<any> {
    const response = await this.client.get('/version')
    return response.data
  }

  // DAGs
  async getDAGs(limit = 100, offset = 0): Promise<{ dags: DAG[], total_entries: number }> {
    const response = await this.client.get('/dags', {
      params: { limit, offset }
    })
    return response.data
  }

  async getDAG(dagId: string): Promise<DAG> {
    const response: AxiosResponse<DAG> = await this.client.get(`/dags/${dagId}`)
    return response.data
  }

  async pauseDAG(dagId: string): Promise<DAG> {
    const response: AxiosResponse<DAG> = await this.client.patch(`/dags/${dagId}`, {
      is_paused: true
    })
    return response.data
  }

  async unpauseDAG(dagId: string): Promise<DAG> {
    const response: AxiosResponse<DAG> = await this.client.patch(`/dags/${dagId}`, {
      is_paused: false
    })
    return response.data
  }

  // DAG Runs
  async getDAGRuns(dagId?: string, limit = 100, offset = 0): Promise<{ dag_runs: DAGRun[], total_entries: number }> {
    const url = dagId ? `/dags/${dagId}/dagRuns` : '/dagRuns'
    const response = await this.client.get(url, {
      params: { limit, offset }
    })
    return response.data
  }

  async getDAGRun(dagId: string, dagRunId: string): Promise<DAGRun> {
    const response: AxiosResponse<DAGRun> = await this.client.get(`/dags/${dagId}/dagRuns/${dagRunId}`)
    return response.data
  }

  async triggerDAG(dagId: string, config?: any): Promise<DAGRun> {
    const response: AxiosResponse<DAGRun> = await this.client.post(`/dags/${dagId}/dagRuns`, {
      conf: config || {}
    })
    return response.data
  }

  // Task Instances
  async getTaskInstances(dagId: string, dagRunId: string): Promise<{ task_instances: TaskInstance[] }> {
    const response = await this.client.get(`/dags/${dagId}/dagRuns/${dagRunId}/taskInstances`)
    return response.data
  }

  async getTaskInstance(dagId: string, dagRunId: string, taskId: string): Promise<TaskInstance> {
    const response: AxiosResponse<TaskInstance> = await this.client.get(
      `/dags/${dagId}/dagRuns/${dagRunId}/taskInstances/${taskId}`
    )
    return response.data
  }

  async getTaskInstanceLogs(dagId: string, dagRunId: string, taskId: string, tryNumber = 1): Promise<any> {
    const response = await this.client.get(
      `/dags/${dagId}/dagRuns/${dagRunId}/taskInstances/${taskId}/logs/${tryNumber}`
    )
    return response.data
  }

  // Connections
  async getConnections(): Promise<{ connections: Connection[] }> {
    const response = await this.client.get('/connections')
    return response.data
  }

  async getConnection(connectionId: string): Promise<Connection> {
    const response: AxiosResponse<Connection> = await this.client.get(`/connections/${connectionId}`)
    return response.data
  }

  async testConnection(connectionId: string): Promise<any> {
    const response = await this.client.post(`/connections/${connectionId}/test`)
    return response.data
  }

  // Pools
  async getPools(): Promise<{ pools: Pool[] }> {
    const response = await this.client.get('/pools')
    return response.data
  }

  async getPool(poolName: string): Promise<Pool> {
    const response: AxiosResponse<Pool> = await this.client.get(`/pools/${poolName}`)
    return response.data
  }

  // Variables
  async getVariables(): Promise<{ variables: Variable[] }> {
    const response = await this.client.get('/variables')
    return response.data
  }

  async getVariable(key: string): Promise<Variable> {
    const response: AxiosResponse<Variable> = await this.client.get(`/variables/${key}`)
    return response.data
  }

  // Dashboard Stats (aggregated data)
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [dagsResponse, dagRunsResponse, taskInstancesResponse] = await Promise.all([
        this.getDAGs(),
        this.getDAGRuns(),
        this.client.get('/dagRuns') // Get more recent runs for better stats
      ])

      const dags = dagsResponse.dags
      const dagRuns = dagRunsResponse.dag_runs

      // Calculate stats
      const stats: DashboardStats = {
        total_dags: dags.length,
        active_dags: dags.filter(dag => dag.is_active && !dag.is_paused).length,
        paused_dags: dags.filter(dag => dag.is_paused).length,
        total_dag_runs: dagRuns.length,
        running_dag_runs: dagRuns.filter(run => run.state === 'running').length,
        successful_dag_runs: dagRuns.filter(run => run.state === 'success').length,
        failed_dag_runs: dagRuns.filter(run => run.state === 'failed').length,
        total_task_instances: 0, // Will be calculated from task instances API
        running_task_instances: 0,
        successful_task_instances: 0,
        failed_task_instances: 0,
      }

      return stats
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  // Recent Activity
  async getRecentDAGRuns(limit = 10): Promise<DAGRun[]> {
    const response = await this.getDAGRuns(undefined, limit)
    return response.dag_runs.sort((a, b) => 
      new Date(b.execution_date).getTime() - new Date(a.execution_date).getTime()
    )
  }

  async getFailedDAGRuns(limit = 10): Promise<DAGRun[]> {
    const response = await this.getDAGRuns(undefined, 100) // Get more to filter
    return response.dag_runs
      .filter(run => run.state === 'failed')
      .sort((a, b) => new Date(b.execution_date).getTime() - new Date(a.execution_date).getTime())
      .slice(0, limit)
  }

  async getRunningDAGRuns(): Promise<DAGRun[]> {
    const response = await this.getDAGRuns(undefined, 100)
    return response.dag_runs.filter(run => run.state === 'running')
  }

  // Utility methods
  async isConnected(): Promise<boolean> {
    try {
      await this.getHealth()
      return true
    } catch {
      return false
    }
  }

  updateConfig(newConfig: Partial<AirflowConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.client.defaults.baseURL = `${this.config.base_url}/api/${this.config.api_version}`
    
    if (this.config.username && this.config.password) {
      this.client.defaults.auth = {
        username: this.config.username,
        password: this.config.password,
      }
    }
  }
}

// Create default instance
export const airflowService = new AirflowService()

// Export service class for custom instances
export default AirflowService