const prisma = require('../utils/prismaClient');

// Create a new report (requires login)
const createReport = async (req, res) => {
  try {
    const { agentName, agentPhone, description, area, proofUrl } = req.body;

    if (!agentName || !agentPhone || !description || !area) {
      return res.status(400).json({ error: 'agentName, agentPhone, description, and area are required' });
    }

    const report = await prisma.agentReport.create({
      data: {
        agentName,
        agentPhone,
        description,
        area,
        proofUrl: proofUrl || null,
        userId: req.userId, // comes from authMiddleware
      },
    });

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Search reports by agent name or phone (open to everyone)
const searchReports = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'A search query is required' });
    }

    const reports = await prisma.agentReport.findMany({
      where: {
        OR: [
          { agentName: { contains: query } },
          { agentPhone: { contains: query } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get recent reports (open to everyone) - for the feed
const getRecentReports = async (req, res) => {
  try {
    const reports = await prisma.agentReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20, // limit to latest 20
    });

    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


// Get all reports for one specific agent (by exact phone number)
const getAgentReports = async (req, res) => {
  try {
    const { phone } = req.params; 

    const reports = await prisma.agentReport.findMany({
      where: { agentPhone: phone },
      orderBy: { createdAt: 'desc' },
    });

    if (reports.length === 0) {
      return res.status(404).json({ error: 'No reports found for this agent' });
    }

    res.status(200).json({
      agentName: reports[0].agentName,
      agentPhone: reports[0].agentPhone,
      totalReports: reports.length,
      reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { createReport, searchReports, getRecentReports, getAgentReports };