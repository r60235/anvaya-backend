const Lead = require('../models/lead.models');

// Get leads closed last week
exports.getLeadsClosedLastWeek = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const closedLeads = await Lead.find({
      status: 'Closed',
      closedAt: { $gte: oneWeekAgo }
    }).populate('salesAgent', 'name');

    res.json(closedLeads);
  } catch (error) {
    console.error('Get closed leads error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get total leads in pipeline
exports.getPipelineTotal = async (req, res) => {
  try {
    const pipelineLeads = await Lead.countDocuments({
      status: { $ne: 'Closed' }
    });

    res.json({ totalLeadsInPipeline: pipelineLeads });
  } catch (error) {
    console.error('Get pipeline total error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get leads closed by agent
exports.getLeadsClosedByAgent = async (req, res) => {
  try {
    const closedLeadsByAgent = await Lead.aggregate([
      { $match: { status: 'Closed' } },
      {
        $group: {
          _id: '$salesAgent',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'salesagents',
          localField: '_id',
          foreignField: '_id',
          as: 'agent'
        }
      },
      {
        $unwind: '$agent'
      },
      {
        $project: {
          agentName: '$agent.name',
          closedLeads: '$count'
        }
      }
    ]);

    res.json(closedLeadsByAgent);
  } catch (error) {
    console.error('Get closed by agent error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get lead status distribution
exports.getLeadStatusDistribution = async (req, res) => {
  try {
    const statusDistribution = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(statusDistribution);
  } catch (error) {
    console.error('Get status distribution error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};