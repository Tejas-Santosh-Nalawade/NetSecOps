import { useEffect, useState } from 'react';
import { healthCheck } from '../api/client';

export default function ApiStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await healthCheck();
        setIsConnected(true);
        setModelLoaded(health.model_loaded);
      } catch {
        setIsConnected(false);
        setModelLoaded(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return null; // Don't show anything while checking
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
        title={isConnected ? 'Backend connected' : 'Backend disconnected'}
      />
      <span className="text-gray-600">
        {isConnected ? 'API Connected' : 'API Disconnected'}
        {isConnected && modelLoaded && ' • Model Loaded'}
      </span>
    </div>
  );
}
