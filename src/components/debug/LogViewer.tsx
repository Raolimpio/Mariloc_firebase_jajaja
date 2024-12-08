import { useState, useEffect } from 'react';
import Logger from '@/lib/logger';

export function LogViewer() {
  const [logs, setLogs] = useState(Logger.getLogs());
  const [storageStatus, setStorageStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(Logger.getLogs());
    }, 1000);

    // Test storage connection
    Logger.testStorageConnection().then(setStorageStatus);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-h-96 w-96 overflow-auto rounded-lg bg-white p-4 shadow-lg">
      <h3 className="mb-4 font-semibold">Debug Logs</h3>
      
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-medium">Storage Status:</span>
        {storageStatus === null ? (
          <span className="text-sm text-gray-500">Testing...</span>
        ) : storageStatus ? (
          <span className="text-sm text-green-600">Connected</span>
        ) : (
          <span className="text-sm text-red-600">Disconnected</span>
        )}
      </div>

      <div className="space-y-2">
        {logs.map((log, index) => (
          <div 
            key={index}
            className={`rounded p-2 text-sm ${
              log.level === 'error' ? 'bg-red-100' :
              log.level === 'warn' ? 'bg-yellow-100' :
              'bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{log.level.toUpperCase()}</span>
              <span className="text-xs text-gray-500">
                {log.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p>{log.message}</p>
            {log.data && (
              <pre className="mt-1 text-xs">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            )}
            {log.error && (
              <pre className="mt-1 text-xs text-red-600">
                {log.error.message}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}