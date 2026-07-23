const agentMiddleware = (req, res, next) => {
  if (req.userRole !== 'AGENT') {
    return res.status(403).json({ error: 'Only agents can perform this action' });
  }
  next();
};

module.exports = agentMiddleware;