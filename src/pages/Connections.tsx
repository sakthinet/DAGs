import React from 'react'
import { Database } from 'lucide-react'

const Connections: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Connections</h1>
        <p className="text-muted-foreground mt-1">
          Manage your Airflow connections and credentials
        </p>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Database size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Connections</h3>
              <p className="text-muted-foreground">
                This page will display and manage Airflow connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Connections