import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import StatusPopup from './StatusPopup';

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

interface LogIngestionFormProps {
  onLogAdded: () => void;
}

const LogIngestionForm: React.FC<LogIngestionFormProps> = ({ onLogAdded }) => {
  const [newLog, setNewLog] = useState<LogEntry>({
    level: 'info',
    message: '',
    resourceId: '',
    timestamp: new Date().toISOString(),
    traceId: '',
    spanId: '',
    commit: '',
    metadata: {}
  });
  const [metadataInput, setMetadataInput] = useState<string>('{}'); // Store raw string for metadata
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');

  // Initialize metadataInput when newLog changes (e.g., after successful submission)
  useEffect(() => {
    setMetadataInput(JSON.stringify(newLog.metadata, null, 2));
  }, [newLog.metadata]);

  const handleNewLogChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "metadata") {
      setMetadataInput(value); // Update raw string input
      try {
        JSON.parse(value); // Just try parsing to validate, don't set newLog yet
        setMetadataError(null);
      } catch (error) {
        setMetadataError("Invalid JSON for metadata");
      }
    } else if (name === "timestamp") {
      const date = new Date(value);
      setNewLog({ ...newLog, [name]: date.toISOString() });
    } else {
      setNewLog({ ...newLog, [name]: value });
    }
  };

  const handleAddLog = async (e: FormEvent) => {
    e.preventDefault();
    setShowPopup(false); // Hide any previous popups

    let parsedMetadata: Record<string, any> = {};
    try {
      parsedMetadata = JSON.parse(metadataInput);
      setMetadataError(null);
    } catch (error) {
      setMetadataError("Invalid JSON for metadata");
      setPopupMessage("Invalid JSON for metadata. Log not added.");
      setPopupType('error');
      setShowPopup(true);
      return; // Don't submit if metadata is invalid
    }

    const logToSubmit = { ...newLog, metadata: parsedMetadata };

    try {
      const response = await fetch('http://localhost:3000/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setPopupMessage(errorData.error || 'Failed to add log');
        setPopupType('error');
        setShowPopup(true);
        return;
      }

      setNewLog({
        level: 'info',
        message: '',
        resourceId: '',
        timestamp: new Date().toISOString(),
        traceId: '',
        spanId: '',
        commit: '',
        metadata: {}
      });
      setMetadataInput('{}'); // Reset metadata input
      onLogAdded();
      setPopupMessage('Log added successfully!');
      setPopupType('success');
      setShowPopup(true);
    } catch (error) {
      setPopupMessage('Network error or server is unreachable');
      setPopupType('error');
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="log-ingestion">
      <h2>Ingest New Log</h2>
      <form onSubmit={handleAddLog}>
        <select name="level" value={newLog.level} onChange={handleNewLogChange} required>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
        <input type="text" name="message" placeholder="Message" value={newLog.message} onChange={handleNewLogChange} required />
        <input type="text" name="resourceId" placeholder="Resource ID" value={newLog.resourceId} onChange={handleNewLogChange} required />
        <input type="datetime-local" name="timestamp" value={newLog.timestamp.substring(0, 16)} onChange={handleNewLogChange} required />
        <input type="text" name="traceId" placeholder="Trace ID" value={newLog.traceId} onChange={handleNewLogChange} required />
        <input type="text" name="spanId" placeholder="Span ID" value={newLog.spanId} onChange={handleNewLogChange} required />
        <input type="text" name="commit" placeholder="Commit" value={newLog.commit} onChange={handleNewLogChange} required />
        <textarea name="metadata" placeholder="Metadata (JSON)" value={metadataInput} onChange={handleNewLogChange}></textarea>
        {metadataError && <p style={{ color: 'red' }}>{metadataError}</p>}
        <button type="submit">Add Log</button>
      </form>
      {showPopup && (
        <StatusPopup
          message={popupMessage}
          type={popupType}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default LogIngestionForm;
