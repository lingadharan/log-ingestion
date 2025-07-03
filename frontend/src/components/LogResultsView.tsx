import React from 'react';

interface LogEntry {
  level: string;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: Record<string, any>;
}

interface LogResultsViewProps {
  logs: LogEntry[];
}

const LogResultsView: React.FC<LogResultsViewProps> = ({ logs }) => {
  const getLogLevelClass = (level: string) => {
    switch (level) {
      case 'error':
        return 'log-error';
      case 'warn':
        return 'log-warn';
      case 'info':
        return 'log-info';
      case 'debug':
        return 'log-debug';
      default:
        return '';
    }
  };

  return (
    <div className="log-results">
      <h2>Log Entries</h2>
      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <table className="log-table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Message</th>
              <th>Resource ID</th>
              <th>Timestamp</th>
              <th>Trace ID</th>
              <th>Span ID</th>
              <th>Commit</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className={`log-item ${getLogLevelClass(log.level)}`}>
                <td>{log.level}</td>
                <td>{log.message}</td>
                <td>{log.resourceId}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.traceId}</td>
                <td>{log.spanId}</td>
                <td>{log.commit}</td>
                <td>{JSON.stringify(log.metadata)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LogResultsView;
