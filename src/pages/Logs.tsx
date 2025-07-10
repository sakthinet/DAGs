import React from 'react'
import { FileText } from 'lucide-react'

const Logs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Logs</h1>
        <p className="text-muted-foreground mt-1">
          View system logs and task execution details
        </p>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Logs</h3>
              <p className="text-muted-foreground">
                This page will display Airflow logs and execution details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logs