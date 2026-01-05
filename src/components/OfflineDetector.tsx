'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RotateCcw } from 'lucide-react';

export default function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      {isOnline ? (
        <>
          <RotateCcw className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-medium">Connection restored</p>
            <p className="text-sm opacity-90">You're back online</p>
          </div>
        </>
      ) : (
        <>
          <WifiOff className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-medium">No internet connection</p>
            <p className="text-sm opacity-90">Some features may not work</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 px-3 py-1 bg-white text-red-500 rounded font-medium text-sm hover:bg-red-50 transition-colors"
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
}
