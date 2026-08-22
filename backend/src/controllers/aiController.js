const aiBoundary = require('../services/aiBoundary');

const generateTrip = async (req, res, next) => {
  try {
    const result = await aiBoundary.generateTrip(req.body);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const optimizeBudget = async (req, res, next) => {
  try {
    const result = await aiBoundary.optimizeBudget(req.body);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateTrip,
  optimizeBudget
};
