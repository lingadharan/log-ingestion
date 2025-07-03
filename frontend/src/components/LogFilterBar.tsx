import React, { useState, ChangeEvent } from 'react';

interface LogFilterBarProps {
  onApplyFilters: (filters: {
    level: string;
    message: string;
    resourceId: string;
    timestamp_start: string;
    timestamp_end: string;
    traceId: string;
    spanId: string;
    commit: string;
  }) => void;
}

const LogFilterBar: React.FC<LogFilterBarProps> = ({ onApplyFilters }) => {
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

  

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="filter-bar">
      <h2>Filter Logs</h2>
      <div className="filter-inputs">
        <input type="text" name="message" placeholder="Search Message" value={filters.message} onChange={handleFilterChange} />
        <select name="level" value={filters.level} onChange={handleFilterChange}>
          <option value="">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
        <input type="text" name="resourceId" placeholder="Filter by Resource ID" value={filters.resourceId} onChange={handleFilterChange} />
        <input type="datetime-local" name="timestamp_start" value={filters.timestamp_start} onChange={handleFilterChange} />
        <input type="datetime-local" name="timestamp_end" value={filters.timestamp_end} onChange={handleFilterChange} />
        <input type="text" name="traceId" placeholder="Filter by Trace ID" value={filters.traceId} onChange={handleFilterChange} />
        <input type="text" name="spanId" placeholder="Filter by Span ID" value={filters.spanId} onChange={handleFilterChange} />
        <input type="text" name="commit" placeholder="Filter by Commit" value={filters.commit} onChange={handleFilterChange} />
      </div>
      <div className="filter-button-container">
        <button onClick={() => onApplyFilters(filters)}>Apply Filters</button>
      </div>
    </div>
  );
};

export default LogFilterBar;
