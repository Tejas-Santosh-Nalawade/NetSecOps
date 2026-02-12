export interface Transaction {
  id: string;
  timestamp: number;
  sourceIp: string;
  amount: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Approved' | 'Blocked';
}

export interface Incident {
  id: string;
  sourceIp: string;
  transactionAmount: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Resolved' | 'False Positive';
  timestamp: number;
  aiSummary?: string;
  riskExplanation?: string;
  suggestedAction?: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  driftScore: number;
  latency: number;
  falsePositiveRate: number;
  version: string;
}

export interface Feedback {
  incidentId: string;
  isFraud: boolean;
  comment: string;
  timestamp: number;
}

export interface AnomalyDataPoint {
  timestamp: number;
  value: number;
}
