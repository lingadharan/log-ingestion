import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app: Express = express();
const PORT = 3000;
const LOGS_FILE = path.join(__dirname, '../src/logs.json');

app.use(cors());
app.use(express.json());

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

// Helper function to read logs
const readLogs = (): LogEntry[] => {
    try {
        const data = fs.readFileSync(LOGS_FILE, 'utf8');
        return JSON.parse(data) as LogEntry[];
    } catch (error) {
        return [];
    }
};

// Helper function to write logs
const writeLogs = (logs: LogEntry[]) => {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf8');
};

// POST /logs - Ingest a single log entry
app.post('/logs', (req: Request, res: Response) => {
    const newLog: LogEntry = req.body;

    // Validation
    const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'];
    for (const field of requiredFields) {
        if (!(field in newLog)) {
            return res.status(400).json({ error: `Missing required log field: ${field}` });
        }
    }

    const allowedLevels = ['info', 'warn', 'error', 'debug'];
    if (!allowedLevels.includes(newLog.level)) {
        return res.status(400).json({ error: 'Invalid log level. Must be one of: info, warn, error, debug' });
    }

    if (typeof newLog.message !== 'string') {
        return res.status(400).json({ error: 'Message must be a string' });
    }
    if (typeof newLog.resourceId !== 'string') {
        return res.status(400).json({ error: 'Resource ID must be a string' });
    }
    if (typeof newLog.traceId !== 'string') {
        return res.status(400).json({ error: 'Trace ID must be a string' });
    }
    if (typeof newLog.spanId !== 'string') {
        return res.status(400).json({ error: 'Span ID must be a string' });
    }
    if (typeof newLog.commit !== 'string') {
        return res.status(400).json({ error: 'Commit must be a string' });
    }
    if (typeof newLog.metadata !== 'object' || newLog.metadata === null || Array.isArray(newLog.metadata)) {
        return res.status(400).json({ error: 'Metadata must be an object' });
    }

    // Validate timestamp format (ISO 8601)
    if (isNaN(new Date(newLog.timestamp).getTime())) {
        return res.status(400).json({ error: 'Invalid timestamp format. Must be ISO 8601' });
    }

    const logs = readLogs();
    logs.push(newLog);
    writeLogs(logs);
    res.status(201).json(newLog);
});

// GET /logs - Retrieve and filter log entries
app.get('/logs', (req: Request, res: Response) => {
    let logs = readLogs();

    const { level, message, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit } = req.query;

    // Apply filters
    if (level) {
        logs = logs.filter(log => log.level === level);
    }
    if (message) {
        logs = logs.filter(log => log.message.toLowerCase().includes((message as string).toLowerCase()));
    }
    if (resourceId) {
        logs = logs.filter(log => log.resourceId === resourceId);
    }
    if (timestamp_start) {
        logs = logs.filter(log => new Date(log.timestamp) >= new Date(timestamp_start as string));
    }
    if (timestamp_end) {
        logs = logs.filter(log => new Date(log.timestamp) <= new Date(timestamp_end as string));
    }
    if (traceId) {
        logs = logs.filter(log => log.traceId === traceId);
    }
    if (spanId) {
        logs = logs.filter(log => log.spanId === spanId);
    }
    if (commit) {
        logs = logs.filter(log => log.commit === commit);
    }

    // Sort by timestamp in reverse chronological order
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.status(200).json(logs);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});