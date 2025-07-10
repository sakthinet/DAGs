# TCS ECM Airflow Dashboard

A modern, dynamic, and responsive dashboard for monitoring Apache Airflow workflows. Built with React, TypeScript, and Tailwind CSS, this dashboard provides real-time insights into your Airflow instances with a beautiful, intuitive interface.

![TCS ECM Airflow Dashboard](https://via.placeholder.com/800x400/3b82f6/ffffff?text=TCS+ECM+Airflow+Dashboard)

## ✨ Features

### 🚀 **Live Data Monitoring**
- Real-time DAG execution status
- Live metrics and statistics
- Auto-refreshing dashboard (configurable intervals)
- Connection health monitoring

### 📊 **Rich Visualizations**
- Interactive charts for DAG runs over time
- Task status distribution pie charts
- Trend analysis and success rate metrics
- Real-time activity feeds

### 💻 **Modern UI/UX**
- Responsive design for desktop and mobile
- Dark/light theme support
- Smooth animations and transitions
- Modern card-based layout

### 🔧 **Comprehensive Management**
- DAG management and controls
- Task instance monitoring
- Connection testing and validation
- System health indicators

### 🎯 **Key Components**
- **Dashboard**: Overview with key metrics and charts
- **DAG Management**: Workflow control and monitoring
- **Task Instances**: Individual task execution details
- **Connections**: Database and external service connections
- **Logs**: System and execution logs

## 🏗️ Architecture

The dashboard follows a modern React architecture with:

- **Frontend**: React 18 with TypeScript
- **State Management**: React Query for server state
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **API Integration**: Axios with Airflow REST API v1/v2

## 📋 Prerequisites

Before setting up the dashboard, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Apache Airflow** instance running (v2.0+)
- Airflow REST API enabled

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Airflow Connection

Update the Airflow configuration in `src/services/airflow.ts`:

```typescript
const config = {
  base_url: 'http://localhost:8080', // Your Airflow URL
  username: 'airflow',              // Your Airflow username
  password: 'airflow',              // Your Airflow password
  api_version: 'v1'                 // API version
}
```

### 3. Start Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## 🔧 Configuration

### Airflow Connection Settings

The dashboard connects to your Airflow instance via REST API. Configure the connection in `src/services/airflow.ts`:

```typescript
// Default configuration
const defaultConfig = {
  base_url: 'http://localhost:8080',
  username: 'airflow',
  password: 'airflow',
  api_version: 'v1'
}
```

### Environment Variables

Create a `.env` file for environment-specific settings:

```env
VITE_AIRFLOW_BASE_URL=http://localhost:8080
VITE_AIRFLOW_USERNAME=airflow
VITE_AIRFLOW_PASSWORD=airflow
VITE_AIRFLOW_API_VERSION=v1
```

### Refresh Intervals

Customize data refresh intervals in the hooks:

```typescript
// In src/hooks/useAirflow.ts
const refreshIntervals = {
  health: 30000,        // 30 seconds
  dashboardStats: 30000, // 30 seconds
  dagRuns: 30000,       // 30 seconds
  runningRuns: 15000,   // 15 seconds
}
```

## 📊 Dashboard Features

### Real-Time Metrics Cards

- **Total DAGs**: Count of all workflow definitions
- **Running DAGs**: Currently executing workflows
- **Failed Runs**: Runs requiring attention
- **Success Rate**: Overall execution success percentage
- **Task Instances**: Total task executions
- **System Health**: Component status indicators

### Interactive Charts

- **DAG Runs Over Time**: Line chart showing execution trends
- **Task Status Distribution**: Pie chart of task states
- **Recent Activity**: Timeline of latest executions
- **Running DAGs**: Live status of active workflows

### Navigation Features

- **Responsive Sidebar**: Collapsible navigation with quick actions
- **Connection Status Bar**: Real-time Airflow connection monitoring
- **Live Data Indicators**: Visual feedback for data freshness

## 🎨 Customization

### Theming

The dashboard uses CSS custom properties for theming. Modify theme colors in `index.html`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  /* ... more theme variables */
}
```

### Adding New Components

Create new dashboard components following the existing pattern:

```typescript
// src/components/MyComponent.tsx
import React from 'react'
import { useAirflowData } from '../hooks/useAirflow'

const MyComponent: React.FC = () => {
  const { data, isLoading } = useAirflowData()
  
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">My Component</h3>
      </div>
      <div className="card-content">
        {/* Component content */}
      </div>
    </div>
  )
}

export default MyComponent
```

## 🔌 API Integration

### Airflow REST API Endpoints

The dashboard integrates with these Airflow API endpoints:

- `GET /api/v1/health` - System health
- `GET /api/v1/dags` - DAG information
- `GET /api/v1/dagRuns` - DAG execution history
- `GET /api/v1/connections` - Connection details
- `GET /api/v1/pools` - Resource pools

### Custom API Service

Extend the API service in `src/services/airflow.ts`:

```typescript
class AirflowService {
  // Add custom methods
  async getCustomMetrics(): Promise<any> {
    const response = await this.client.get('/custom-endpoint')
    return response.data
  }
}
```

## 🚀 Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment Configuration

Set production environment variables:

```bash
export VITE_AIRFLOW_BASE_URL=https://your-airflow-instance.com
export VITE_AIRFLOW_USERNAME=your-username
export VITE_AIRFLOW_PASSWORD=your-password
```

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── services/           # API services
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

### Adding New Features

1. **Create Types**: Define TypeScript interfaces in `src/types/`
2. **Add API Methods**: Extend `src/services/airflow.ts`
3. **Create Hooks**: Add React Query hooks in `src/hooks/`
4. **Build Components**: Create UI components in `src/components/`
5. **Add Routes**: Update routing in `src/App.tsx`

## 📖 API Reference

### Airflow Service Methods

- `getHealth()` - Get system health status
- `getDAGs()` - Retrieve all DAGs
- `getDAGRuns()` - Get DAG execution history
- `triggerDAG(dagId)` - Trigger DAG execution
- `pauseDAG(dagId)` - Pause a DAG
- `getConnections()` - Get connection list

### React Hooks

- `useAirflowHealth()` - Monitor system health
- `useDashboardStats()` - Get dashboard metrics
- `useDAGs()` - Manage DAG data
- `useRecentDAGRuns()` - Recent execution data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Open an issue on GitHub
- Check the [Documentation](docs/)
- Review the [FAQ](docs/FAQ.md)

## 🙏 Acknowledgments

- Apache Airflow team for the excellent workflow platform
- React and TypeScript communities
- Tailwind CSS for the styling framework
- Lucide React for beautiful icons

---

**Built with ❤️ for the TCS ECM team**