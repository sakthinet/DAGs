import React from 'react'
import { Workflow, Search, Filter, Plus } from 'lucide-react'

const DAGManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">DAG Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your Airflow workflows
          </p>
        </div>
        <button className="btn btn-primary btn-md gap-2">
          <Plus size={16} />
          Create DAG
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search DAGs..."
            className="input pl-9"
          />
        </div>
        <button className="btn btn-outline btn-md gap-2">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Workflow size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">DAG Management</h3>
              <p className="text-muted-foreground">
                This page will display and manage your Airflow DAGs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DAGManagement