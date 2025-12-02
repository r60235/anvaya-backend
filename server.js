require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection.db');

// Route imports
const leadRoutes = require('./routes/leads');
const agentRoutes = require('./routes/agents');
const commentRoutes = require('./routes/comments'); 
const reportRoutes = require('./routes/reports');

const app = express();

// Connect to database
connectDB();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api', commentRoutes);
app.use('/api/reports', reportRoutes);

// check
app.get('/api/health', (req, res) => {
  res.json({ message: 'SalesApp API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Conditional server start for local development only
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;