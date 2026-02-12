import { Transaction, Incident, AnomalyDataPoint } from '../types';

/**
 * Fraud Engine Simulation
 * Generates random transactions and calculates risk scores
 */

// Risk thresholds
const RISK_THRESHOLDS = {
  LOW: 0.3,
  MEDIUM: 0.7,
  HIGH: 0.85,
};

/**
 * Generate a random IP address
 */
function generateRandomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

/**
 * Calculate risk score based on transaction characteristics
 */
function calculateRiskScore(amount: number, sourceIp: string): number {
  // Simulate risk factors
  const amountRisk = Math.min(amount / 10000, 0.5); // Higher amounts = higher risk
  const ipRisk = parseFloat(sourceIp.split('.')[0]) / 255; // Simulate IP-based risk
  const randomFactor = Math.random() * 0.3; // Random component
  
  return Math.min(amountRisk + ipRisk + randomFactor, 1.0);
}

/**
 * Determine risk level from score
 */
function getRiskLevel(score: number): 'Low' | 'Medium' | 'High' {
  if (score >= RISK_THRESHOLDS.HIGH) return 'High';
  if (score >= RISK_THRESHOLDS.MEDIUM) return 'Medium';
  return 'Low';
}

/**
 * Generate a random transaction
 */
export function generateTransaction(): Transaction {
  const amount = Math.random() * 50000 + 100; // $100 - $50,100
  const sourceIp = generateRandomIP();
  const riskScore = calculateRiskScore(amount, sourceIp);
  const riskLevel = getRiskLevel(riskScore);
  
  return {
    id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    sourceIp,
    amount: Math.round(amount * 100) / 100,
    riskScore: Math.round(riskScore * 1000) / 1000,
    riskLevel,
    status: 'Pending',
  };
}

/**
 * Convert transaction to incident if high risk
 */
export function transactionToIncident(transaction: Transaction): Incident | null {
  if (transaction.riskLevel === 'High' || transaction.riskScore >= RISK_THRESHOLDS.MEDIUM) {
    return {
      id: `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceIp: transaction.sourceIp,
      transactionAmount: transaction.amount,
      riskScore: transaction.riskScore,
      riskLevel: transaction.riskLevel,
      status: 'Open',
      timestamp: transaction.timestamp,
      aiSummary: generateAISummary(transaction),
      riskExplanation: generateRiskExplanation(transaction),
      suggestedAction: generateSuggestedAction(transaction),
    };
  }
  return null;
}

/**
 * Generate AI summary for incident
 */
function generateAISummary(transaction: Transaction): string {
  const factors = [];
  if (transaction.amount > 20000) factors.push('unusually high transaction amount');
  if (transaction.riskScore > 0.8) factors.push('multiple risk indicators detected');
  if (transaction.sourceIp.startsWith('192.') || transaction.sourceIp.startsWith('10.')) {
    factors.push('suspicious IP pattern');
  }
  
  // Handle case when no specific factors are identified
  const factorDescription = factors.length > 0 
    ? factors.join(', ')
    : 'anomalous transaction patterns';
  
  return `Transaction flagged due to ${factorDescription}. Risk score of ${(transaction.riskScore * 100).toFixed(1)}% indicates potential fraudulent activity.`;
}

/**
 * Generate risk explanation
 */
function generateRiskExplanation(transaction: Transaction): string {
  return `The transaction from IP ${transaction.sourceIp} with amount $${transaction.amount.toLocaleString()} has been flagged. The risk score is calculated based on transaction patterns, IP reputation, and behavioral analysis.`;
}

/**
 * Generate suggested action
 */
function generateSuggestedAction(transaction: Transaction): string {
  if (transaction.riskLevel === 'High') {
    return 'Immediate block recommended. Escalate to security team for investigation.';
  }
  return 'Review transaction details. Consider additional verification before approval.';
}

/**
 * Generate anomaly data point for chart
 */
export function generateAnomalyDataPoint(): AnomalyDataPoint {
  return {
    timestamp: Date.now(),
    value: Math.random() * 100, // Anomaly score 0-100
  };
}
