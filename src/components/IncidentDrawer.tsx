import { Incident } from '../types';
import { useStore } from '../store/useStore';

interface IncidentDrawerProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function IncidentDrawer({ incident, isOpen, onClose }: IncidentDrawerProps) {
  const { approveIncident, blockIncident } = useStore();

  if (!isOpen || !incident) return null;

  const handleApprove = () => {
    approveIncident(incident.id);
    onClose();
  };

  const handleBlock = () => {
    blockIncident(incident.id);
    onClose();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Incident Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Incident ID */}
            <div>
              <label className="text-sm font-medium text-gray-500">Incident ID</label>
              <p className="text-sm text-gray-900 mt-1">{incident.id}</p>
            </div>

            {/* Risk Level */}
            <div>
              <label className="text-sm font-medium text-gray-500">Risk Level</label>
              <div className="mt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(incident.riskLevel)}`}>
                  {incident.riskLevel}
                </span>
              </div>
            </div>

            {/* Risk Score */}
            <div>
              <label className="text-sm font-medium text-gray-500">Risk Score</label>
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        incident.riskScore > 0.7 ? 'bg-red-500' : incident.riskScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${incident.riskScore * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {(incident.riskScore * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Source IP */}
            <div>
              <label className="text-sm font-medium text-gray-500">Source IP</label>
              <p className="text-sm text-gray-900 mt-1 font-mono">{incident.sourceIp}</p>
            </div>

            {/* Transaction Amount */}
            <div>
              <label className="text-sm font-medium text-gray-500">Transaction Amount</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                ${incident.transactionAmount.toLocaleString()}
              </p>
            </div>

            {/* AI Summary */}
            {incident.aiSummary && (
              <div>
                <label className="text-sm font-medium text-gray-500">AI Summary</label>
                <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">
                  {incident.aiSummary}
                </p>
              </div>
            )}

            {/* Risk Explanation */}
            {incident.riskExplanation && (
              <div>
                <label className="text-sm font-medium text-gray-500">Risk Explanation</label>
                <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">
                  {incident.riskExplanation}
                </p>
              </div>
            )}

            {/* Suggested Action */}
            {incident.suggestedAction && (
              <div>
                <label className="text-sm font-medium text-gray-500">Suggested Action</label>
                <p className="text-sm text-gray-700 mt-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  {incident.suggestedAction}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Approve
              </button>
              <button
                onClick={handleBlock}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
