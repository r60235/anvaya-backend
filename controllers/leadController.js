const Lead = require('../models/lead.models');
const SalesAgent = require('../models/salesAgent.models');
const Comment = require('../models/comment.models');
const { validationResult } = require('express-validator');

// Create a new Lead
exports.createLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority
    } = req.body;

    // Verify sales agent exists - 404 
    const agent = await SalesAgent.findById(salesAgent);
    if (!agent) {
      return res.status(404).json({ 
        errors : `Sales agent with ID '${salesAgent}' not found.` 
      });
    }

    const lead = new Lead({
      name,
      source,
      salesAgent,
      status,
      tags: tags || [],
      timeToClose,
      priority
    });

    const savedLead = await lead.save();
    const populatedLead = await Lead.findById(savedLead._id)
      .populate('salesAgent', 'name email');

    res.status(201).json(populatedLead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a lead
exports.updateLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // First check if lead exists
    const existingLead = await Lead.findById(id);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Verify sales agent exists if provided -  404 
    if (updateData.salesAgent) {
      const agent = await SalesAgent.findById(updateData.salesAgent);
      if (!agent) {
        return res.status(404).json({ 
          error: `Sales agent with ID '${updateData.salesAgent}' not found.` 
        });
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('salesAgent', 'name email');

    res.json(lead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate('salesAgent', 'name email');

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Also delete associated comments
    await Comment.deleteMany({ lead: id });

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all leads 
exports.getLeads = async (req, res) => {
  try {
    const { salesAgent, status, tags, source } = req.query;
    const filter = {};

    if (salesAgent) filter.salesAgent = salesAgent;
    if (status) filter.status = status;
    if (tags) filter.tags = { $in: tags.split(',') };
    if (source) filter.source = source;

    const leads = await Lead.find(filter)
      .populate('salesAgent', 'name email')
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};