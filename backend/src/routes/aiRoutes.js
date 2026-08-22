const express = require('express');
const { generateTrip, optimizeBudget } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

const { validateRequest } = require('../validators/authValidators');
const aiBoundary = require('../services/aiBoundary');

const router = express.Router();

router.use(authMiddleware);

router.post('/trip-generator', validateRequest(aiBoundary.schemas.TripGeneratorRequestSchema), generateTrip);
router.post('/budget-optimizer', validateRequest(aiBoundary.schemas.BudgetOptimizerRequestSchema), optimizeBudget);

module.exports = router;
