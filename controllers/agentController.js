const SalesAgent = require('../models/salesAgent.models');
const { validationResult } = require('express-validator');

// Create a new sales agent
exports.createAgent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    // Check if agent already exists
    const existingAgent = await SalesAgent.findOne({ email });
    if (existingAgent) {
      return res.status(409).json({ error: 'Sales agent with this email already exists' });
    }

    const agent = new SalesAgent({ name, email });
    const savedAgent = await agent.save();

    res.status(201).json(savedAgent);
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all sales agents
exports.getAgents = async (req, res) => {
  try {
    const agents = await SalesAgent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};