import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const {
    totalTransactions,
    openIncidents,
    blockedTransactions,
    eventProcessingRate,
    anomalyData,
    simulateHighRiskEvent,
    triggerRetraining,
    isRetraining,
  } = useStore();

  // Format anomaly data for chart
  const chartData = anomalyData.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString(),
    anomaly: point.value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time fraud monitoring and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          icon="💳"
        />
        <StatCard
          title="Open Incidents"
          value={openIncidents}
          icon="🚨"
        />
        <StatCard
          title="Blocked Transactions"
          value={blockedTransactions.toLocaleString()}
          icon="🛡️"
        />
        <StatCard
          title="Event Processing Rate"
          value={`${eventProcessingRate}/sec`}
          icon="⚡"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={triggerRetraining}
            disabled={isRetraining}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRetraining ? 'Retraining...' : 'Retrain Model'}
          </button>
          <button
            onClick={simulateHighRiskEvent}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Simulate High Risk Event
          </button>
        </div>
      </div>

      {/* Anomaly Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Anomaly Detection</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="anomaly"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Anomaly Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Real-time anomaly scores from transaction analysis
        </p>
      </div>
    </div>
  );
}
