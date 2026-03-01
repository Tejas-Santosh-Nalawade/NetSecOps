import { useEffect, useState } from 'react';
import { getDatasetStats, trainWithIEEEDataset, type DatasetStats, type TrainingResponse } from '../api/client';
import StatCard from '../components/StatCard';

export default function DatasetInfo() {
  const [datasetStats, setDatasetStats] = useState<DatasetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState<TrainingResponse | null>(null);

  useEffect(() => {
    loadDatasetStats();
  }, []);

  const loadDatasetStats = async () => {
    try {
      setLoading(true);
      const stats = await getDatasetStats();
      setDatasetStats(stats);
    } catch (error) {
      console.error('Failed to load dataset stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async () => {
    if (training) return;
    
    if (!confirm('Train a new model? This will take 1-2 minutes.')) {
      return;
    }

    try {
      setTraining(true);
      setTrainingResult(null);
      const result = await trainWithIEEEDataset(10000); // Fixed sample size
      setTrainingResult(result);
      
      if (result.status === 'success') {
        // Reload stats after training
        setTimeout(() => loadDatasetStats(), 2000);
      }
    } catch (error: any) {
      setTrainingResult({
        status: 'error',
        message: error.message || 'Training failed',
      });
    } finally {
      setTraining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dataset information...</div>
      </div>
    );
  }

  if (!datasetStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Failed to load dataset statistics</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">IEEE-CIS Dataset</h1>
        <p className="text-gray-600 mt-1">Real-world fraud detection dataset statistics and model training</p>
      </div>

      {/* Dataset Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transactions"
          value={datasetStats.total_transactions.toLocaleString()}
          icon="📊"
        />
        <StatCard
          title="Fraud Cases"
          value={datasetStats.fraud_transactions.toLocaleString()}
          icon="🚨"
        />
        <StatCard
          title="Fraud Rate"
          value={(datasetStats.fraud_rate * 100).toFixed(2) + '%'}
          icon="📈"
        />
        <StatCard
          title="Total Features"
          value={datasetStats.total_features.toString()}
          icon="🔢"
        />
      </div>

      {/* Dataset Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dataset Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Dataset Name</h3>
            <p className="text-gray-900">{datasetStats.dataset_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Transaction Features</h3>
            <p className="text-gray-900">{datasetStats.num_features_transaction} columns</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Identity Features</h3>
            <p className="text-gray-900">{datasetStats.num_features_identity} columns</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Dataset Type</h3>
            <p className="text-gray-900">Imbalanced Classification</p>
          </div>
        </div>
      </div>

      {/* Sample Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sample Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Transaction ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Time Delta</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Is Fraud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {datasetStats.sample_transactions.map((transaction) => (
                <tr key={transaction.TransactionID}>
                  <td className="px-4 py-2 text-sm text-gray-900">{transaction.TransactionID}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{transaction.TransactionDT}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">${transaction.TransactionAmt.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{transaction.ProductCD}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.isFraud ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {transaction.isFraud ? 'Fraud' : 'Legit'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Training */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">� Train Fraud Detection Model</h2>
        <p className="text-gray-600 mb-4">
          Train a new fraud detection model using synthetic transaction data. The model will be trained with  
          multiple algorithms (XGBoost, Random Forest, Logistic Regression, Isolation Forest) and the best one
          will be automatically selected.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Configuration
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Features:</span>
                  <span className="ml-2 text-gray-600">6 (amount, IP, timestamp)</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Algorithms:</span>
                  <span className="ml-2 text-gray-600">4 models compared</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Training Data:</span>
                  <span className="ml-2 text-gray-600">Synthetic transactions</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Duration:</span>
                  <span className="ml-2 text-gray-600">~1-2 minutes</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleTrainModel}
            disabled={training}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {training ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Training Model...
              </>
            ) : (
              '🚀 Start Model Training'
            )}
          </button>

          {/* Training Result */}
          {trainingResult && (
            <div className={`p-4 rounded-lg ${
              trainingResult.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                trainingResult.status === 'success' ? 'text-green-900' : 'text-red-900'
              }`}>
                {trainingResult.status === 'success' ? '✓ Training Successful' : '✗ Training Failed'}
              </h3>
              <p className={`text-sm ${
                trainingResult.status === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {trainingResult.message}
              </p>
              
              {trainingResult.metrics && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-green-600">F1 Score</span>
                    <p className="font-semibold text-green-900">{(trainingResult.metrics.f1_score * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-green-600">Accuracy</span>
                    <p className="font-semibold text-green-900">{(trainingResult.metrics.accuracy * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-green-600">Precision</span>
                    <p className="font-semibold text-green-900">{(trainingResult.metrics.precision * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-green-600">Recall</span>
                    <p className="font-semibold text-green-900">{(trainingResult.metrics.recall * 100).toFixed(2)}%</p>
                  </div>
                </div>
              )}
              
              {trainingResult.model_version && (
                <p className="text-xs text-green-600 mt-2">
                  Model Version: {trainingResult.model_version}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📌 Important Notes</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Training will compare XGBoost, Random Forest, Logistic Regression, and Isolation Forest</li>
          <li>The model with the best F1-score will be automatically selected</li>
          <li>After training completes, the new model will be immediately available via the API</li>
          <li>Check the "Model Monitoring" page to see updated metrics and algorithm comparison</li>
          <li>Trained models use 6 features: amount, IP (3 parts), hour, day-of-week</li>
        </ul>
      </div>
      
      {/* IEEE Dataset Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">🎓 About IEEE-CIS Dataset</h3>
        <p className="text-sm text-purple-800">
          This page shows statistics from the IEEE-CIS fraud detection competition dataset, which contains
          real-world transaction data with 432+ features. The dataset is used for demonstration and
          analysis purposes. The actual model trains on simplified features for API compatibility.</p>
      </div>
    </div>
  );
}
