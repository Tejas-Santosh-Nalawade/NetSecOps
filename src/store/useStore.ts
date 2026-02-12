import { create } from 'zustand';
import { Transaction, Incident, ModelMetrics, Feedback, AnomalyDataPoint } from '../types';
import { generateTransaction, transactionToIncident, generateAnomalyDataPoint } from '../utils/fraudEngine';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  userRole: string;
  login: (email: string, password: string, mfaCode: string) => void;
  logout: () => void;

  // Transactions
  transactions: Transaction[];
  totalTransactions: number;
  blockedTransactions: number;
  eventProcessingRate: number;

  // Incidents
  incidents: Incident[];
  openIncidents: number;

  // Anomaly data for charts
  anomalyData: AnomalyDataPoint[];

  // Model metrics
  modelMetrics: ModelMetrics;
  isRetraining: boolean;

  // Feedback
  feedbacks: Feedback[];
  confirmedFraud: number;
  falsePositives: number;

  // Actions
  addTransaction: (transaction: Transaction) => void;
  addIncident: (incident: Incident) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  approveIncident: (id: string) => void;
  blockIncident: (id: string) => void;
  addFeedback: (feedback: Feedback) => void;
  triggerRetraining: () => void;
  simulateHighRiskEvent: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
}

const initialModelMetrics: ModelMetrics = {
  accuracy: 0.94,
  precision: 0.91,
  recall: 0.89,
  f1Score: 0.90,
  driftScore: 0.12,
  latency: 45,
  falsePositiveRate: 0.08,
  version: 'v2.3.1',
};

export const useStore = create<AppState>((set, get) => {
  let simulationInterval: number | null = null;
  let anomalyInterval: number | null = null;

  return {
    // Auth
    isAuthenticated: false,
    userRole: 'Security Analyst',
    login: (email: string, password: string, mfaCode: string) => {
      // Simple validation
      if (email && password && mfaCode) {
        set({ isAuthenticated: true });
        get().startSimulation();
      }
    },
    logout: () => {
      set({ isAuthenticated: false });
      get().stopSimulation();
    },

    // Initial state
    transactions: [],
    totalTransactions: 0,
    blockedTransactions: 0,
    eventProcessingRate: 0,
    incidents: [],
    openIncidents: 0,
    anomalyData: [],
    modelMetrics: initialModelMetrics,
    isRetraining: false,
    feedbacks: [],
    confirmedFraud: 0,
    falsePositives: 0,

    // Actions
    addTransaction: (transaction) => {
      const incident = transactionToIncident(transaction);
      set((state) => {
        const newTransactions = [...state.transactions, transaction];
        const newIncidents = incident ? [...state.incidents, incident] : state.incidents;
        const openIncidents = newIncidents.filter((i) => i.status === 'Open').length;
        const blocked = transaction.status === 'Blocked' ? state.blockedTransactions + 1 : state.blockedTransactions;

        return {
          transactions: newTransactions.slice(-100), // Keep last 100
          totalTransactions: state.totalTransactions + 1,
          incidents: newIncidents,
          openIncidents,
          blockedTransactions: blocked,
        };
      });
    },

    addIncident: (incident) => {
      set((state) => {
        const newIncidents = [...state.incidents, incident];
        return {
          incidents: newIncidents,
          openIncidents: newIncidents.filter((i) => i.status === 'Open').length,
        };
      });
    },

    updateIncidentStatus: (id, status) => {
      set((state) => {
        const updatedIncidents = state.incidents.map((incident) =>
          incident.id === id ? { ...incident, status } : incident
        );
        return {
          incidents: updatedIncidents,
          openIncidents: updatedIncidents.filter((i) => i.status === 'Open').length,
        };
      });
    },

    approveIncident: (id) => {
      get().updateIncidentStatus(id, 'False Positive');
      get().addFeedback({
        incidentId: id,
        isFraud: false,
        comment: 'Approved - False positive',
        timestamp: Date.now(),
      });
    },

    blockIncident: (id) => {
      get().updateIncidentStatus(id, 'Resolved');
      set((state) => ({
        blockedTransactions: state.blockedTransactions + 1,
      }));
      get().addFeedback({
        incidentId: id,
        isFraud: true,
        comment: 'Blocked - Confirmed fraud',
        timestamp: Date.now(),
      });
    },

    addFeedback: (feedback) => {
      set((state) => {
        const newFeedbacks = [...state.feedbacks, feedback];
        const confirmedFraud = newFeedbacks.filter((f) => f.isFraud).length;
        const falsePositives = newFeedbacks.filter((f) => !f.isFraud).length;

        return {
          feedbacks: newFeedbacks,
          confirmedFraud,
          falsePositives,
        };
      });
    },

    triggerRetraining: () => {
      set({ isRetraining: true });
      // Simulate retraining process
      setTimeout(() => {
        set((state) => ({
          isRetraining: false,
          modelMetrics: {
            ...state.modelMetrics,
            accuracy: Math.min(0.99, state.modelMetrics.accuracy + 0.01),
            precision: Math.min(0.98, state.modelMetrics.precision + 0.01),
            recall: Math.min(0.97, state.modelMetrics.recall + 0.01),
            f1Score: Math.min(0.98, (state.modelMetrics.precision + state.modelMetrics.recall) / 2),
            version: `v2.3.${Math.floor(Math.random() * 10) + 1}`,
          },
        }));
      }, 3000);
    },

    simulateHighRiskEvent: () => {
      const transaction = generateTransaction();
      // Force high risk
      transaction.riskScore = 0.9 + Math.random() * 0.1;
      transaction.riskLevel = 'High';
      get().addTransaction(transaction);
    },

    startSimulation: () => {
      // Clear existing intervals
      get().stopSimulation();

      // Generate transactions every 2-5 seconds
      simulationInterval = window.setInterval(() => {
        const transaction = generateTransaction();
        get().addTransaction(transaction);
        
        // Update processing rate
        set((state) => ({
          eventProcessingRate: Math.floor(Math.random() * 50) + 100, // 100-150 events/sec
        }));
      }, 2000 + Math.random() * 3000);

      // Generate anomaly data every second
      anomalyInterval = window.setInterval(() => {
        const dataPoint = generateAnomalyDataPoint();
        set((state) => {
          const newData = [...state.anomalyData, dataPoint];
          // Keep last 60 data points (1 minute at 1 per second)
          return {
            anomalyData: newData.slice(-60),
          };
        });
      }, 1000);
    },

    stopSimulation: () => {
      if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      if (anomalyInterval !== null) {
        clearInterval(anomalyInterval);
        anomalyInterval = null;
      }
    },
  };
});
