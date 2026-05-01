/**
 * QueuePilot Backend Server
 * Express API server for ticket analysis
 */

import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.js';
import importRouter from './routes/import.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', analyzeRouter);
app.use('/api/import', importRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'QueuePilot API',
    version: '1.0.0',
    description: 'AI-powered support ticket triage system',
    endpoints: {
      analyze: 'POST /api/analyze',
      demoTickets: 'GET /api/demo-tickets',
      config: 'GET /api/config',
      health: 'GET /api/health',
      importSources: 'GET /api/import/sources',
      importWebhook: 'POST /api/import/webhook',
      importDemo: 'POST /api/import/demo',
      importTickets: 'GET /api/import/tickets'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 QueuePilot Server Started');
  console.log('=================================');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
  console.log('=================================');
});

export default app;

// Made with Bob
