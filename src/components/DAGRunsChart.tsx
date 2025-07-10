import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDAGRuns } from '../hooks/useAirflow'
import LoadingSpinner from './LoadingSpinner'

// Mock data for demonstration
const mockData = [
  { date: '2024-01-01', successful: 12, failed: 2, running: 3 },
  { date: '2024-01-02', successful: 15, failed: 1, running: 2 },
  { date: '2024-01-03', successful: 18, failed: 3, running: 4 },
  { date: '2024-01-04', successful: 14, failed: 2, running: 1 },
  { date: '2024-01-05', successful: 20, failed: 1, running: 5 },
  { date: '2024-01-06', successful: 16, failed: 4, running: 2 },
  { date: '2024-01-07', successful: 22, failed: 2, running: 3 },
]

const DAGRunsChart: React.FC = () => {
  const { data: dagRuns, isLoading } = useDAGRuns()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              color: 'hsl(var(--card-foreground))'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="successful" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="failed" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="running" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DAGRunsChart