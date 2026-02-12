import { useState } from 'react';
import { useStore } from '../store/useStore';
import StatCard from '../components/StatCard';

export default function Feedback() {
  const { incidents, feedbacks, confirmedFraud, falsePositives, addFeedback } = useStore();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState<'fraud' | 'false-positive' | null>(null);

  const openIncidents = incidents.filter((inc) => inc.status === 'Open');

  const handleSubmitFeedback = () => {
    if (!selectedIncidentId || !feedbackType) return;

    addFeedback({
      incidentId: selectedIncidentId,
      isFraud: feedbackType === 'fraud',
      comment,
      timestamp: Date.now(),
    });

    // Reset form
    setSelectedIncidentId('');
    setComment('');
    setFeedbackType(null);
  };

  const totalFeedback = confirmedFraud + falsePositives;
  const confirmedFraudPercent = totalFeedback > 0 ? (confirmedFraud / totalFeedback) * 100 : 0;
  const falsePositivePercent = totalFeedback > 0 ? (falsePositives / totalFeedback) * 100 : 0;
  const retrainingThreshold = 80; // 80% feedback triggers retraining
  const feedbackProgress = totalFeedback > 0 ? Math.min((totalFeedback / 50) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback & Validation</h1>
        <p className="text-gray-600 mt-1">Validate incidents and improve model accuracy</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Confirmed Fraud"
          value={`${confirmedFraudPercent.toFixed(1)}%`}
          icon="🚨"
        />
        <StatCard
          title="False Positives"
          value={`${falsePositivePercent.toFixed(1)}%`}
          icon="✅"
        />
        <StatCard
          title="Total Feedback"
          value={totalFeedback}
          icon="📝"
        />
      </div>

      {/* Retraining Threshold */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Retraining Trigger Progress</h3>
          <span className="text-sm text-gray-600">
            {totalFeedback} / 50 feedback entries
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              feedbackProgress >= retrainingThreshold ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${feedbackProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {feedbackProgress >= retrainingThreshold
            ? '✓ Ready for retraining'
            : `${retrainingThreshold}% feedback required to trigger retraining`}
        </p>
      </div>

      {/* Feedback Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Provide Feedback</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Incident
            </label>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose an incident...</option>
              {openIncidents.map((incident) => (
                <option key={incident.id} value={incident.id}>
                  {incident.id} - ${incident.transactionAmount.toLocaleString()} - {incident.riskLevel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Was this a fraud?
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setFeedbackType('fraud')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                  feedbackType === 'fraud'
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl block mb-1">👎</span>
                <span className="text-sm font-medium">Confirmed Fraud</span>
              </button>
              <button
                onClick={() => setFeedbackType('false-positive')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                  feedbackType === 'false-positive'
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl block mb-1">👍</span>
                <span className="text-sm font-medium">False Positive</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any additional notes..."
            />
          </div>

          <button
            onClick={handleSubmitFeedback}
            disabled={!selectedIncidentId || !feedbackType}
            className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Feedback
          </button>
        </div>
      </div>

      {/* Recent Feedback */}
      {feedbacks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
          <div className="space-y-3">
            {feedbacks.slice(-5).reverse().map((feedback, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-2xl">
                  {feedback.isFraud ? '👎' : '👍'}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {feedback.isFraud ? 'Confirmed Fraud' : 'False Positive'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Incident: {feedback.incidentId}</p>
                  {feedback.comment && (
                    <p className="text-sm text-gray-700 mt-1">{feedback.comment}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(feedback.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
