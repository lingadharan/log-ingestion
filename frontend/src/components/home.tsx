import { useCallback, useEffect, useState } from "react";
import LogIngestionForm from "./LogIngestionForm";
import LogFilterBar from "./LogFilterBar";
import LogResultsView from "./LogResultsView";
import '../App.css';

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

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    level: '',
    message: '',
    resourceId: '',
    timestamp_start: '',
    timestamp_end: '',
    traceId: '',
    spanId: '',
    commit: ''
  });

  const fetchLogs = useCallback(async () => {
    setApiError(null); // Clear previous API errors
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:3000/logs?${query}`);
      if (!response.ok) {
        const errorData = await response.json();
        setApiError(errorData.error || 'Failed to fetch logs');
        setLogs([]); // Clear logs on error
        return;
      }
      const data: LogEntry[] = await response.json();
      setLogs(data);
    } catch (error) {
      setApiError('Network error or server is unreachable');
      setLogs([]); // Clear logs on error
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [filters, fetchLogs]);

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="App">
      <h1>Log Ingestion and Querying System</h1>
      <LogIngestionForm onLogAdded={fetchLogs} />
      <LogFilterBar onApplyFilters={handleApplyFilters} />
      {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
      <LogResultsView logs={logs} />
    </div>
  );
}