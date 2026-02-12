const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PredictRequest {
  amount: number;
  source_ip: string;
  timestamp?: number;
}

export interface PredictResponse {
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  ai_summary?: string;
  risk_explanation?: string;
  suggested_action?: string;
}

export interface AlgorithmComparison {
  algorithm: string;
  f1_score: number;
  accuracy: number;
  precision: number;
  recall: number;
  false_positive_rate: number;
}

export interface ModelMetricsResponse {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  drift_score: number;
  latency: number;
  false_positive_rate: number;
  version: string;
  best_algorithm?: string;
  all_algorithms?: AlgorithmComparison[];
}

export interface FeedbackRequest {
  incident_id: string;
  is_fraud: boolean;
  comment: string;
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`API ${path}: ${res.status}`);
    }
    return res.json() as Promise<T>;
  } catch (error) {
    // Re-throw with more context
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to API at ${API_BASE}. Is the backend running?`);
    }
    throw error;
  }
}

export async function predictRisk(
  amount: number,
  sourceIp: string,
  timestamp?: number
): Promise<PredictResponse> {
  return fetchApi<PredictResponse>('/predict', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      source_ip: sourceIp,
      ...(timestamp != null && { timestamp }),
    }),
  });
}

export async function getModelMetrics(): Promise<ModelMetricsResponse> {
  return fetchApi<ModelMetricsResponse>('/metrics');
}

export async function submitFeedback(
  incidentId: string,
  isFraud: boolean,
  comment: string
): Promise<{ ok: boolean; message: string }> {
  return fetchApi<{ ok: boolean; message: string }>('/feedback', {
    method: 'POST',
    body: JSON.stringify({
      incident_id: incidentId,
      is_fraud: isFraud,
      comment,
    }),
  });
}

export async function healthCheck(): Promise<{ status: string; model_loaded: boolean }> {
  return fetchApi<{ status: string; model_loaded: boolean }>('/health');
}

export async function triggerRetraining(): Promise<{ status: string; trigger: string; timestamp: string; metrics?: any }> {
  return fetchApi<{ status: string; trigger: string; timestamp: string; metrics?: any }>('/mlops/retrain', {
    method: 'POST',
  });
}
