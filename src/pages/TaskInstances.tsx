import React from 'react'
import { List } from 'lucide-react'

const TaskInstances: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Task Instances</h1>
        <p className="text-muted-foreground mt-1">
          View and monitor individual task executions
        </p>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <List size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Task Instances</h3>
              <p className="text-muted-foreground">
                This page will display task instance details and logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskInstances