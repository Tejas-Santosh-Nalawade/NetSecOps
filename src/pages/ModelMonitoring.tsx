import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';
import StatCard from '../components/StatCard';
import { getModelMetrics, type ModelMetricsResponse } from '../api/client';

export default function ModelMonitoring() {
  const { modelMetrics: storeMetrics, metricsHistory, triggerRetraining, isRetraining } = useStore();
  const [apiMetrics, setApiMetrics] = useState<ModelMetricsResponse | null>(null);

  useEffect(() => {
    getModelMetrics()
      .then(setApiMetrics)
      .catch(() => setApiMetrics(null));
    const interval = setInterval(() => {
      getModelMetrics()
        .then(setApiMetrics)
        .catch(() => setApiMetrics(null));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const modelMetrics = apiMetrics
    ? {
        accuracy: apiMetrics.accuracy,
        precision: apiMetrics.precision,
        recall: apiMetrics.recall,
        f1Score: apiMetrics.f1_score,
        driftScore: apiMetrics.drift_score,
        latency: apiMetrics.latency,
        falsePositiveRate: apiMetrics.false_positive_rate,
        version: apiMetrics.version,
      }
    : storeMetrics;

  // Use real historical data from metrics history, or fallback to mock data
  const generateHistoricalData = (baseValue: number, count: number = 30) => {
    return Array.from({ length: count }, (_, i) => ({
      date: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: baseValue + (Math.random() - 0.5) * 0.1,
    }));
  };

  // Format historical data for charts - use real data if available, otherwise fallback
  const accuracyData = metricsHistory.length > 0
    ? metricsHistory.map(point => ({ date: new Date(point.timestamp).toLocaleTimeString(), value: point.accuracy }))
    : generateHistoricalData(modelMetrics.accuracy);
  
  const driftData = metricsHistory.length > 0
    ? metricsHistory.map(point => ({ date: new Date(point.timestamp).toLocaleTimeString(), value: point.driftScore }))
    : generateHistoricalData(modelMetrics.driftScore);
  
  const latencyData = metricsHistory.length > 0
    ? metricsHistory.map(point => ({ date: new Date(point.timestamp).toLocaleTimeString(), value: point.latency }))
    : generateHistoricalData(modelMetrics.latency);
  
  const fprData = metricsHistory.length > 0
    ? metricsHistory.map(point => ({ date: new Date(point.timestamp).toLocaleTimeString(), value: point.falsePositiveRate }))
    : generateHistoricalData(modelMetrics.falsePositiveRate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Model Monitoring</h1>
          <p className="text-gray-600 mt-1">Track model performance and health metrics</p>
        </div>
        <div className="flex items-center gap-4">
          {apiMetrics?.best_algorithm && (
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <span className="text-xs text-green-600 font-medium">Best Algorithm</span>
              <p className="text-sm font-bold text-green-900">{apiMetrics.best_algorithm}</p>
            </div>
          )}
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-xs text-blue-600 font-medium">Current Version</span>
            <p className="text-sm font-bold text-blue-900">{modelMetrics.version}</p>
          </div>
          <button
            onClick={triggerRetraining}
            disabled={isRetraining}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRetraining ? 'Retraining...' : 'Trigger Retraining'}
          </button>
        </div>
      </div>

      {/* Model Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Precision"
          value={(modelMetrics.precision * 100).toFixed(2) + '%'}
          icon="🎯"
        />
        <StatCard
          title="Recall"
          value={(modelMetrics.recall * 100).toFixed(2) + '%'}
          icon="📈"
        />
        <StatCard
          title="F1 Score"
          value={(modelMetrics.f1Score * 100).toFixed(2) + '%'}
          icon="⭐"
        />
      </div>

      {/* Algorithm comparison (from API) */}
      {apiMetrics?.all_algorithms && apiMetrics.all_algorithms.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Algorithm comparison (best by F1)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-700">Algorithm</th>
                  <th className="text-right py-2 font-medium text-gray-700">F1</th>
                  <th className="text-right py-2 font-medium text-gray-700">Accuracy</th>
                  <th className="text-right py-2 font-medium text-gray-700">Precision</th>
                  <th className="text-right py-2 font-medium text-gray-700">Recall</th>
                  <th className="text-right py-2 font-medium text-gray-700">FPR</th>
                </tr>
              </thead>
              <tbody>
                {apiMetrics.all_algorithms.map((row) => (
                  <tr
                    key={row.algorithm}
                    className={`border-b border-gray-100 ${row.algorithm === apiMetrics.best_algorithm ? 'bg-green-50' : ''}`}
                  >
                    <td className="py-2 font-medium text-gray-900">
                      {row.algorithm}
                      {row.algorithm === apiMetrics.best_algorithm && (
                        <span className="ml-2 text-xs text-green-600 font-normal">(in use)</span>
                      )}
                    </td>
                    <td className="text-right py-2 text-gray-700">{(row.f1_score * 100).toFixed(2)}%</td>
                    <td className="text-right py-2 text-gray-700">{(row.accuracy * 100).toFixed(2)}%</td>
                    <td className="text-right py-2 text-gray-700">{(row.precision * 100).toFixed(2)}%</td>
                    <td className="text-right py-2 text-gray-700">{(row.recall * 100).toFixed(2)}%</td>
                    <td className="text-right py-2 text-gray-700">{(row.false_positive_rate * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Accuracy</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={[0.8, 1.0]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [(value * 100).toFixed(2) + '%', 'Accuracy']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drift Score Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Drift Score</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={driftData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latency (ms)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value.toFixed(2) + 'ms', 'Latency']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* False Positive Rate Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">False Positive Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fprData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [(value * 100).toFixed(2) + '%', 'FPR']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
