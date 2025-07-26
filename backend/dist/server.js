"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
const LOGS_FILE = path_1.default.join(__dirname, '../src/logs.json');
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Helper function to read logs
const readLogs = () => {
    try {
        const data = fs_1.default.readFileSync(LOGS_FILE, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        return [];
    }
};
// Helper function to write logs
const writeLogs = (logs) => {
    fs_1.default.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf8');
};
// POST /logs - Ingest a single log entry
app.post('/logs', (req, res) => {
    const newLog = req.body;
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
app.get('/logs', (req, res) => {
    let logs = readLogs();
    const { level, message, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit } = req.query;
    // Apply filters
    if (level) {
        logs = logs.filter(log => log.level === level);
    }
    if (message) {
        logs = logs.filter(log => log.message.toLowerCase().includes(message.toLowerCase()));
    }
    if (resourceId) {
        logs = logs.filter(log => log.resourceId === resourceId);
    }
    if (timestamp_start) {
        logs = logs.filter(log => new Date(log.timestamp) >= new Date(timestamp_start));
    }
    if (timestamp_end) {
        logs = logs.filter(log => new Date(log.timestamp) <= new Date(timestamp_end));
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
