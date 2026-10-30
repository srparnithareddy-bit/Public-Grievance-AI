/**
 * Public Grievance AI Assistant - Unified Full-Stack Server
 * Problem ID: HACK-P438 (College Hackathon)
 * 
 * Tech Stack: Node.js, Express.js, MongoDB (Mongoose), Google Gemini AI, React + Vite
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./config/db');
const { seedMongoIfEmpty } = require('./services/store');

const authRoutes = require('./routes/auth');
const grievanceRoutes = require('./routes/grievances');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for development servers
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Express JSON Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger for debugging
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// System Health & Diagnostics endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'
  );

  return res.status(200).json({
    status: 'ONLINE',
    project: 'Public Grievance AI Assistant',
    problemId: 'HACK-P438',
    database: dbStatus,
    aiService: {
      provider: 'Google Gemini',
      geminiKeyConfigured: hasGeminiKey,
      mode: hasGeminiKey ? 'Gemini 1.5 Flash API' : 'Active Intelligent Fallback Engine',
    },
    timestamp: new Date(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/ai', aiRoutes);

// 404 Handler for undefined API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' does not exist.`,
  });
});

// Serve compiled Frontend Production Build
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`📦 Serving production frontend build from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  // SPA fallback: any non-API GET route returns index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send({
      message: '🚀 Public Grievance AI Assistant Backend API is running!',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        grievances: '/api/grievances',
        ai: '/api/ai',
      },
    });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server and initialize DB
const startServer = async () => {
  await connectDB();
  await seedMongoIfEmpty();

  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🏛️  Public Grievance AI Assistant Full-Stack Server`);
    console.log(`🌐 Live URL:        http://localhost:${PORT}`);
    console.log(`🩺 Health check:    http://localhost:${PORT}/api/health`);
    console.log(`==================================================\n`);
  });
};

startServer();
