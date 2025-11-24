const Comment = require('../models/comment.models');
const Lead = require('../models/lead.models');
const SalesAgent = require('../models/salesAgent.models');
const { validationResult } = require('express-validator');

// Add comment to lead
exports.addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { commentText, author } = req.body;

    // Verify lead exists
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Verify sales agent exists -  404 
    const agent = await SalesAgent.findById(author);
    if (!agent) {
      return res.status(404).json({ 
        error: `Sales agent with ID '${author}' not found.` 
      });
    }

    const comment = new Comment({
      lead: id,
      author,
      commentText
    });

    const savedComment = await comment.save();
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('author', 'name');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all comments for a lead
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify lead exists
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    const comments = await Comment.find({ lead: id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};