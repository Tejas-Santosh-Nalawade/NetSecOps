export default function Architecture() {
  const components = [
    { id: 1, name: 'Transaction Gateway', description: 'Receives and processes all incoming transactions' },
    { id: 2, name: 'NetSecOps AI Risk Engine', description: 'AI-powered fraud detection and risk scoring' },
    { id: 3, name: 'Risk Score Generated', description: 'Real-time risk assessment and classification' },
    { id: 4, name: 'External Compliance Check', description: 'High-risk transactions undergo additional verification' },
    { id: 5, name: 'Investigation Team', description: 'Human review and final decision making' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Architecture</h1>
        <p className="text-gray-600 mt-1">End-to-end fraud detection pipeline</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Flow Diagram */}
          <div className="space-y-6">
            {components.map((component, index) => (
              <div key={component.id} className="relative">
                {/* Component Box */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    {component.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {component.description}
                  </p>
                </div>

                {/* Arrow (except for last item) */}
                {index < components.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-0.5 h-8 bg-blue-400"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Real-time transaction processing with sub-100ms latency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>AI model continuously learns from feedback and adapts to new fraud patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Automated escalation for high-risk transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Human-in-the-loop validation ensures accuracy and reduces false positives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Comprehensive audit trail for compliance and investigation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
