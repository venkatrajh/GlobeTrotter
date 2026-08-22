const express = require('express');
const {
  updateBudgetItem,
  deleteBudgetItem,
} = require('../controllers/budgetController');
const { validateRequest } = require('../validators/authValidators'); // Reuse the wrapper
const { updateBudgetItemSchema } = require('../validators/budgetValidators');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.put('/items/:itemId', validateRequest(updateBudgetItemSchema), updateBudgetItem);
router.delete('/items/:itemId', deleteBudgetItem);

module.exports = router;
