export default function Architecture() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Architecture</h1>
        <p className="text-gray-600 mt-1">End-to-end fraud detection pipeline with AI/ML integration</p>
      </div>

      {/* Main Architecture Diagram */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg border-2 border-blue-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">NetSecOps AI Architecture</h2>
        
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Layer 1: Data Ingestion */}
          <div>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                Layer 1: Data Ingestion
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
                <div className="text-2xl mb-2">💳</div>
                <h3 className="font-bold text-gray-900">Transaction Gateway</h3>
                <p className="text-xs text-gray-600 mt-1">Real-time transaction stream</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
                <div className="text-2xl mb-2">🌐</div>
                <h3 className="font-bold text-gray-900">IP Intelligence</h3>
                <p className="text-xs text-gray-600 mt-1">Source IP risk analysis</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
                <div className="text-2xl mb-2">⏰</div>
                <h3 className="font-bold text-gray-900">Temporal Features</h3>
                <p className="text-xs text-gray-600 mt-1">Time-based patterns</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center"><div className="text-4xl text-blue-500">↓</div></div>

          {/* Layer 2: AI/ML Engine */}
          <div>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Layer 2: AI/ML Processing
              </span>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 shadow-xl text-white">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🤖</div>
                <h3 className="text-2xl font-bold">NetSecOps AI Risk Engine</h3>
                <p className="text-blue-100 mt-2">Multi-algorithm ensemble fraud detection</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                  <div className="font-bold">XGBoost</div>
                  <div className="text-xs text-blue-100">Gradient Boosting</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                  <div className="font-bold">Random Forest</div>
                  <div className="text-xs text-blue-100">Ensemble Learning</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                  <div className="font-bold">Logistic Reg.</div>
                  <div className="text-xs text-blue-100">Statistical Model</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                  ⚡ Sub-100ms Latency
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center"><div className="text-4xl text-blue-500">↓</div></div>

          {/* Layer 3: Risk Assessment */}
          <div>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Layer 3: Risk Classification
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 shadow-md border-t-4 border-green-500">
                <div className="text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="font-bold text-green-900">Low Risk</h3>
                  <p className="text-xs text-green-700 mt-1">Score: &lt; 30%</p>
                  <p className="text-xs text-green-600 mt-1">Auto-approve</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 shadow-md border-t-4 border-yellow-500">
                <div className="text-center">
                  <div className="text-3xl mb-2">⚠️</div>
                  <h3 className="font-bold text-yellow-900">Medium Risk</h3>
                  <p className="text-xs text-yellow-700 mt-1">Score: 30-70%</p>
                  <p className="text-xs text-yellow-600 mt-1">Review queue</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 shadow-md border-t-4 border-red-500">
                <div className="text-center">
                  <div className="text-3xl mb-2">🚨</div>
                  <h3 className="font-bold text-red-900">High Risk</h3>
                  <p className="text-xs text-red-700 mt-1">Score: &gt; 70%</p>
                  <p className="text-xs text-red-600 mt-1">Immediate block</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center"><div className="text-4xl text-blue-500">↓</div></div>

          {/* Layer 4: Action & Response */}
          <div>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                Layer 4: Action & Response
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-500">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-bold text-gray-900">Investigation Team</h3>
                <p className="text-xs text-gray-600 mt-1">Human-in-the-loop validation</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-500">
                <div className="text-2xl mb-2">🛡️</div>
                <h3 className="font-bold text-gray-900">Automated Response</h3>
                <p className="text-xs text-gray-600 mt-1">Block or approve transactions</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center"><div className="text-4xl text-blue-500">↓</div></div>

          {/* Layer 5: Continuous Learning */}
          <div>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-semibold">
                Layer 5: MLOps & Continuous Learning
              </span>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg p-6 shadow-xl text-white">
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="text-xl font-bold">Feedback Loop & Model Retraining</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-white/10 backdrop-blur rounded p-2">
                  <div className="font-semibold">Drift Detection</div>
                  <div className="text-xs text-pink-100">Monitor model decay</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded p-2">
                  <div className="font-semibold">Auto Retraining</div>
                  <div className="text-xs text-pink-100">Adapt to new patterns</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded p-2">
                  <div className="font-semibold">Version Control</div>
                  <div className="text-xs text-pink-100">Model registry</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🖥️</span>
            Technology Stack
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-28 font-semibold text-gray-700">Frontend:</div>
              <div className="text-gray-600">React, TypeScript, Vite, Tailwind CSS</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-28 font-semibold text-gray-700">Backend:</div>
              <div className="text-gray-600">Python, FastAPI, Uvicorn</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-28 font-semibold text-gray-700">ML/AI:</div>
              <div className="text-gray-600">Scikit-learn, XGBoost, Pandas</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-28 font-semibold text-gray-700">MLOps:</div>
              <div className="text-gray-600">Model Registry, Drift Detection</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Performance Metrics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Prediction Latency:</span>
              <span className="font-bold text-green-600">&lt; 100ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Model Accuracy:</span>
              <span className="font-bold text-blue-600">91.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">F1 Score:</span>
              <span className="font-bold text-blue-600">69.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">False Positive Rate:</span>
              <span className="font-bold text-orange-600">3.68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Events/Second:</span>
              <span className="font-bold text-purple-600">100-150</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          Key Features & Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-semibold text-gray-900">Real-time Processing</h3>
              <p className="text-sm text-gray-600">Sub-100ms transaction analysis</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-semibold text-gray-900">High Precision</h3>
              <p className="text-sm text-gray-600">76.5% precision, low FPR</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <span className="text-2xl">🔄</span>
            <div>
              <h3 className="font-semibold text-gray-900">Continuous Learning</h3>
              <p className="text-sm text-gray-600">Adapts to new fraud patterns</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
            <span className="text-2xl">👥</span>
            <div>
              <h3 className="font-semibold text-gray-900">Human-in-the-Loop</h3>
              <p className="text-sm text-gray-600">Expert validation & feedback</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="font-semibold text-gray-900">Automated Escalation</h3>
              <p className="text-sm text-gray-600">Smart risk-based routing</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
            <span className="text-2xl">📈</span>
            <div>
              <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
              <p className="text-sm text-gray-600">Real-time insights & metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Compliance */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          Security & Compliance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-2 text-blue-300">Data Protection</div>
            <ul className="space-y-1 text-gray-300">
              <li>• End-to-end encryption</li>
              <li>• Secure data storage</li>
              <li>• Access control & audit logs</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-green-300">Compliance</div>
            <ul className="space-y-1 text-gray-300">
              <li>• PCI-DSS compliant</li>
              <li>• GDPR ready</li>
              <li>• SOC 2 certified</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-purple-300">Model Governance</div>
            <ul className="space-y-1 text-gray-300">
              <li>• Model versioning</li>
              <li>• Explainable AI</li>
              <li>• Bias monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
